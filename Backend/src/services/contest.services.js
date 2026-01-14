import { Contest } from "../models/contest.model.js";
import {ApiError} from '../utils/ApiError.utils.js'
import crypto from 'crypto'

import { ContestParticipant } from "../models/contestParticipant.model.js";
import { QuestionAttempt } from "../models/questionAttempt.model.js";
import { Userstat } from "../models/userStats.model.js";

const createContestService = async ({
    title,
    owner,
    questionIds,
    durationInMin,
    visibility
}) => {
    const contestCode = crypto.randomBytes(4).toString("hex");

    try {
        const contest = await Contest.create(
            {
                contestCode : contestCode,
                owner : owner,
                title : title,
                questionIds : questionIds,
                durationInMin : durationInMin,
                visibility : visibility,
                status : "live"
            }
        )
    
        if(!contest){
            throw new ApiError(500, "Error while creating the contest", {})
        }
        return contest;

    } catch (error) {
        throw new ApiError(500, "Server Error while creating the contest", error.message)
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

    if (attempts) {
        // Manual submit → update attempts from frontend
        for (const a of attempts) {
            const safeTime = Math.max(0, Number(a.timeSpent) || 0);

            const updated = await QuestionAttempt.updateOne(
                {
                    contestId: contest._id,
                    userId,
                    questionId: a.questionId
                },
                {
                    $set: {
                        status: a.status,
                        timeSpent: safeTime
                    }
                }
            );

            if (!updated.matchedCount) {
                throw new ApiError(400, "Invalid question attempt");
            }

            if (a.status === "solved") solved++;
            totalTime += safeTime;
        }
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

    const totalQuestions = contest.questionIds.length;
    const unsolved = totalQuestions - solved;
    const score = solved * 100 - totalTime * 0.1;

    await ContestParticipant.updateOne(
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
    // const accuracy = attempted === 0 ? 0 : (solved / attempted) * 100;
    // const avgTime = attempted === 0 ? 0 : totalTime / attempted;

    await Userstat.updateOne(
        { userId },
        [
            {
                $set: {
                    totalContests: { $add: ["$totalContests", 1] },
                    totalQuestionsSolved: { $add: ["$totalQuestionsSolved", solved] },
                    totalQuestionsAttempted: { $add: ["$totalQuestionsAttempted", attempted] },

                    avgAccuracy: {
                        $cond: [
                            { $eq: [{ $add: ["$totalQuestionsAttempted", attempted] }, 0] },
                            0,
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            { $add: ["$totalQuestionsSolved", solved] },
                                            { $add: ["$totalQuestionsAttempted", attempted] }
                                        ]
                                    },
                                    100
                                ]
                            }
                        ]
                    },

                    avgTimePerQuestion: {
                        $cond: [
                            { $eq: [{ $add: ["$totalQuestionsAttempted", attempted] }, 0] },
                            0,
                            {
                                $divide: [
                                    { $add: ["$totalTimeSpent", totalTime] },
                                    { $add: ["$totalQuestionsAttempted", attempted] }
                                ]
                            }
                        ]
                    }
                }
                }
            ],
            { upsert: true, updatePipeline: true }
        );
};



export {
    createContestService,
    finalizeContestSubmissionService
}