import mongoose, { isValidObjectId } from "mongoose";

import { ContestParticipant } from "../models/contestParticipant.model.js";
import { Contest } from "../models/contest.model.js";
import { QuestionAttempt } from "../models/questionAttempt.model.js";

import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";

import { createContestParticipantService, finalizeContestSubmissionService } from "../services/contestParticipant.services.js";


// join contest
const joinContest = asyncHandler(async (req, res) => {
    const { identifier } = req.params;

    let contest;

    if (mongoose.isValidObjectId(identifier)) {
        contest = await Contest.findOne({
            $or: [
                { _id: identifier },
                { contestCode: identifier }
            ]
        });
    } else {
        contest = await Contest.findOne({
            contestCode: identifier
        });
    }

    if (!contest) throw new ApiError(404, "Contest not found");

    if (contest.status === "ended")
        throw new ApiError(403, "Contest already ended");

    const existing = await ContestParticipant.findOne({
        contestId: contest._id,
        userId: req.user._id
    });

    if (existing) {
        return res.json(new ApiResponse(200, "Already joined", existing));
    }

    const participant = await createContestParticipantService({
        contestId: contest._id,
        userId: req.user._id,
        joinedAt: new Date()
    });

    return res.status(200).json(
        new ApiResponse(200, "Joined contest", participant)
    );
});

//  LEAVE CONTEST 
const leaveContest = asyncHandler(async (req, res) => {
    const { contestId } = req.params;

    if (!isValidObjectId(contestId)) {
        throw new ApiError(400, "Invalid contest ID");
    }

    const contest = await Contest.findById(contestId);

    if (!contest) {
        throw new ApiError(404, "Contest not found");
    }

    if (contest.status === "live") {
        throw new ApiError(403, "Cannot leave contest after it starts");
    }

    const deleted = await ContestParticipant.findOneAndDelete({
        contestId,
        userId: req.user._id
    });

    if (!deleted) {
        throw new ApiError(404, "You are not part of this contest");
    }

    return res.status(200).json(
        new ApiResponse(200, "Left contest successfully", {})
    );
});

// start contest for user :  start timer for this user
const startContestForUser = asyncHandler(async (req, res) => {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId);
    if (!contest) throw new ApiError(404, "Contest not found");

    if (contest.status !== "live") {
        throw new ApiError(403, "Contest not started yet");
    }

    if (contest.endsAt < new Date()) {
        throw new ApiError(403, "Contest already ended");
    }

    const participant = await ContestParticipant.findOne({
        contestId,
        userId: req.user._id,
    });

    if (!participant) throw new ApiError(403, "Not joined");

    if (participant.startedAt) {
        return res.json(new ApiResponse(200, "Already started", participant));
    }

    const attempts = contest.questionIds.map(q => ({
        contestId,
        questionId: q,
        userId: req.user._id,
    }));

    await QuestionAttempt.insertMany(attempts);

    participant.startedAt = new Date();
    await participant.save();

    return res.json(
        new ApiResponse(200, "Contest started for user", participant)
    );
});

const submitContest = asyncHandler(async (req, res) => {
    const { contestId } = req.params
    const { attempts } = req.body;

    if(!isValidObjectId(contestId)){
        throw new ApiError(400, "Invalid contest ID");
    }

    const contest = await Contest.findById(contestId);

    if(!contest){
        throw new ApiError(404, "Contest not found");
    }

    const participant = await ContestParticipant.findOne(
        {
            contestId : contestId,
            userId : req.user._id
        }
    )

    if (!participant) throw new ApiError(403, "You are not part of this contest");

    if (participant.submissionStatus === "submitted") {
        throw new ApiError(400, "Contest already submitted");
    }

    const now = new Date();

    const allowedUntil = new Date(
        participant.startedAt.getTime() + contest.durationInMin * 60 * 1000
    );

    if (now > allowedUntil) {
        throw new ApiError(403, "Contest time has expired");
    }

    // Frontend sends:
    // {
    // "attempts" : 
    //     [
    //         { "questionId": "...", "status": "solved", "timeSpent": 120 },
    //         { "questionId": "...", "status": "unsolved", "timeSpent": 300 }
    //     ]
    // }

    await finalizeContestSubmissionService({
        contest,
        participant,
        userId: req.user._id,
        attempts: attempts ?? null
    });

    return res.status(200).json(new ApiResponse(200, "Contest submitted successfully"));

})

// get my rank
const getMyContestRank = asyncHandler( async (req, res) => {
    const { contestId } = req.params;

    if(!isValidObjectId(contestId)){
        throw new ApiError(400, "Invalid contest ID");
    }
    const contestObjectId = new mongoose.Types.ObjectId(contestId);

    const participant = await ContestParticipant.findOne({
        contestId : contestObjectId,
        userId : req.user._id,
        submissionStatus : 'submitted'
    })

    if (!participant) {
        throw new ApiError(404, "You have not submitted this contest");
    }

    const [betterCount, total] = await Promise.all([
        ContestParticipant.countDocuments({
            contestId: contestObjectId,
            submissionStatus: "submitted",
            $or: [
                { score: { $gt: participant.score } },
                {
                    score: participant.score,
                    timeTaken: { $lt: participant.timeTaken }
                },
                {
                    score: participant.score,
                    timeTaken: participant.timeTaken,
                    finishedAt: { $lt: participant.finishedAt }
                }
            ]
        }),
        ContestParticipant.countDocuments({
            contestId: contestObjectId,
            submissionStatus: "submitted"
        })
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Rank fetched", {
            rank: betterCount + 1,
            totalParticipants: total,
            score: participant.score,
            solvedCount: participant.solvedCount,
            timeTaken: participant.timeTaken
        })
    );
})

//  GET MY PARTICIPANT STATE (resume / refresh / reconnect)
const getMyParticipantState = asyncHandler(async (req, res) => {
    const { contestId } = req.params;

    if (!isValidObjectId(contestId)) {
        throw new ApiError(400, "Invalid contest ID");
    }

    const participant = await ContestParticipant.findOne({
        contestId,
        userId: req.user._id,
    }).select(
        "startedAt finishedAt submissionStatus solvedCount unsolvedCount score timeTaken"
    );

    if (!participant) {
        throw new ApiError(404, "You have not joined this contest");
    }

    return res.status(200).json(
        new ApiResponse(200, "Participant state fetched", participant)
    );
});


// GET CONTEST PARTICIPANTS (lobby / host view)
const getContestParticipants = asyncHandler(async (req, res) => {
    const { contestId } = req.params;

    if (!isValidObjectId(contestId)) {
        throw new ApiError(400, "Invalid contest ID");
    }

    const participants = await ContestParticipant.aggregate([
        {
            $match: { contestId: new mongoose.Types.ObjectId(contestId) }
            },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                _id: 1,
                joinedAt: 1,
                startedAt: 1,
                submissionStatus: 1,
                "user.username": 1,
                "user.fullName": 1,
                "user.avatar": 1,
                "user._id" : 1,
            }
        },
        { $sort: { joinedAt: 1 } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Participants fetched", participants)
    );
});



export {
    joinContest,
    leaveContest,
    startContestForUser,
    submitContest,
    getMyContestRank,
    getMyParticipantState,
    getContestParticipants,
    
}


