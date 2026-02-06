import {ApiError} from '../utils/ApiError.utils.js'
import { ContestParticipant } from "../models/contestParticipant.model.js";
import { ContestMessage } from '../models/contestMessage.model.js'
import { QuestionAttempt } from "../models/questionAttempt.model.js";
import { Userstat } from "../models/userStats.model.js";
import { Contest } from '../models/contest.model.js';

const createContestParticipantService = async (
    {
        contestId,
        userId,
        joinedAt
    }
) => {
    try {
        
        const participant = await ContestParticipant.create({
            contestId : contestId,
            userId : userId,
            joinedAt : joinedAt
        })

        if(!participant){
            throw new ApiError(500, "Error while creating the contest participant", {})
        }
        return participant

    } catch (error) {
        throw new ApiError(500, "Server Error while creating the contest Participant", error.message)
    }
}

const finalizeContestSubmissionService = async ({
    contest,
    participant,
    userId,
    attempts = null   // null = auto-submit (use DB attempts)
}) => {

    if (participant.submissionStatus === "submitted") {
        return;   // already finalized
    }

    let solved = 0;
    let totalTime = 0;

    // --- STEP 1: Process Question Attempts (Parallel I/O) ---
    if (attempts) {
        // Manual submit → update attempts from frontend
        // Create an array of update promises

        const updatePromises = attempts.map(async (a) => {
            const safeTime = Math.max(0, Number(a.timeSpent) || 0);
            
            // Side effect: Calculate stats while iterating (CPU bound, fast)
            if (a.status === "solved") solved++;
            totalTime += safeTime;

            const result = await QuestionAttempt.updateOne(
                { contestId: contest._id, userId, questionId: a.questionId },
                { $set: { status: a.status, timeSpent: safeTime } }
            );

            if (!result.matchedCount) {
                 // Note: throwing inside Promise.all rejects the whole transaction
                throw new ApiError(400, `Invalid attempt for question ${a.questionId}`);
            }
        });

        // Execute all DB updates concurrently
        await Promise.all(updatePromises);

    } else {
        // Auto submit → read attempts from DB
        const dbAttempts = await QuestionAttempt.find({
            contestId: contest._id,
            userId
        });

        for (const a of dbAttempts) {
            if (a.status === "solved") solved++;
            totalTime += a.timeSpent || 0;
        }
    }

    // --- STEP 2: Calculate Stats ---
    const totalQuestions = contest.questionIds.length;
    const unsolved = totalQuestions - solved;
    const score = solved * 100 - totalTime * 0.01;

    // --- STEP 3: Update Participant & UserStats (Parallel I/O) ---

    // Promise 1: Update the specific contest participation record
    const participantUpdatePromise = ContestParticipant.updateOne(
        { _id: participant._id },
        {
            solvedCount: solved,
            unsolvedCount: unsolved,
            timeTaken: totalTime,
            submissionStatus: "submitted",
            finishedAt: new Date(),
            score
        }
    );

    // Update user stats
    const attempted = solved + unsolved;

    // Promise 2: Update global user statistics
    const userStatUpdatePromise = Userstat.updateOne(
        { userId },
        [
            {
            $set: {
                totalContests: {
                    $add: [{ $ifNull: ["$totalContests", 0] }, 1]
                },

                totalQuestionsSolved: {
                    $add: [{ $ifNull: ["$totalQuestionsSolved", 0] }, solved]
                },

                totalQuestionsAttempted: {
                    $add: [{ $ifNull: ["$totalQuestionsAttempted", 0] }, attempted]
                },

                totalTimeSpent: {
                    $add: [{ $ifNull: ["$totalTimeSpent", 0] }, totalTime]
                },

                avgAccuracy: {
                    $cond: [
                        {
                            $eq: [
                                {
                                    $add: [
                                        { $ifNull: ["$totalQuestionsAttempted", 0] },
                                        attempted
                                    ]
                                },
                                0
                            ]
                        },
                        0,
                        {
                            $multiply: [
                                {
                                    $divide: [
                                        {
                                            $add: [
                                                { $ifNull: ["$totalQuestionsSolved", 0] },
                                                solved
                                            ]
                                        },
                                        {
                                            $add: [
                                                { $ifNull: ["$totalQuestionsAttempted", 0] },
                                                attempted
                                            ]
                                        }
                                    ]
                                },
                                100
                            ]
                        }
                    ]
                },

                avgTimePerQuestion: {
                    $cond: [
                        {
                            $eq: [
                                {
                                    $add: [
                                        { $ifNull: ["$totalQuestionsAttempted", 0] },
                                        attempted
                                    ]
                                },
                                0
                            ]
                        },
                        0,
                        {
                            $divide: [
                                {
                                    $add: [
                                        { $ifNull: ["$totalTimeSpent", 0] },
                                        totalTime
                                    ]
                                },
                                {
                                    $add: [
                                        { $ifNull: ["$totalQuestionsAttempted", 0] },
                                        attempted
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
            }
        ],
        { upsert: true, updatePipeline: true }
    );

    // Await both updates
    await Promise.all([participantUpdatePromise, userStatUpdatePromise]);


    // --- STEP 4: Check Contest Completion & Cleanup ---
    // Check how many people are still pending
    const pending = await ContestParticipant.countDocuments({
        contestId: contest._id,
        submissionStatus: "not_submitted"
    });

    // If everyone is done, close the contest and clean up chat
    if (pending === 0) {
        const completionTasks = [];

        // 1. Mark contest as ended
        completionTasks.push(
            Contest.updateOne(
                { _id: contest._id },
                { status: "ended", endedAt: new Date() }
            )
        );

        // 2. Delete Group Chat if it's a shared/group contest
        if (contest.visibility === 'shared') {
            completionTasks.push(
                ContestMessage.deleteMany({ contestId: contest._id })
            );
        }

        // Execute cleanup tasks in parallel
        await Promise.all(completionTasks);
    }
};

export {
    createContestParticipantService,
    finalizeContestSubmissionService
}