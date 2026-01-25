import mongoose, { isValidObjectId } from "mongoose";
import { Userstat } from "../models/userStats.model.js";
import { ContestParticipant } from "../models/contestParticipant.model.js";
import { Contest } from "../models/contest.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {asyncHandler} from "../utils/AsyncHandler.utils.js";


const getUserStats = asyncHandler(async (req , res) => {
    const { userId } = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID");
    }

    const userstats = await Userstat.findOne({userId : userId})

    return res.status(200).json(
        new ApiResponse(200, "User stats fetched", userstats || 
            {
                userId,
                totalContests: 0,
                totalQuestionsSolved: 0,
                totalQuestionsAttempted: 0,
                avgAccuracy: 0,
                avgTimePerQuestion: 0,
                topicStats: []
            })
    );

})

const getUserTopicStats = asyncHandler(async (req , res) => {
    const { userId } = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID");
    }

     const userstats = await Userstat.findOne({userId : userId}).select('topicStats')

     return res.status(200).json(
        new ApiResponse(200, "Topic stats fetched", userstats?.topicStats || [])
    );
})

const getUserContestHistory = asyncHandler(async (req , res) => {
    const { userId } = req.params

    const {page = 1, limit = 20} = req.query

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID");
    }

    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 50);
    const skip = (pageNum - 1) * limitNum;

    const matchStage = {
        userId: new mongoose.Types.ObjectId(userId)
    };

    const [history, total] = await Promise.all([
        ContestParticipant.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "contests",
                    localField: "contestId",
                    foreignField: "_id",
                    as: "contest"
                }
            },
            { $unwind: "$contest" },
            { $sort: { finishedAt: -1 } },
            { $skip: skip },
            { $limit: limitNum },
            {
                $project: {
                    contestId: 1,
                    "contest.title": 1,
                    solvedCount: 1,
                    unsolvedCount: 1,
                    score: 1,
                    timeTaken: 1,
                    finishedAt: 1
                }
            }
        ]),
        ContestParticipant.countDocuments(matchStage)
    ]);


    return res.status(200).json(
        new ApiResponse(200, "Contest history fetched", {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            limit: limitNum,
            history
        })
    );

})

const getLeaderboard = asyncHandler(async (req , res) => {
    const {page = 1, limit = 20} = req.query

    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 50);
    const skip = (pageNum - 1) * limitNum;

    const [leaderboard, total] = await Promise.all([
        Userstat.aggregate([
            { $sort: { totalQuestionsSolved: -1, avgAccuracy: -1 } },
            { $skip: skip },
            { $limit: limitNum },
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
                $match: {
                    "user.isActive": { $ne: false }   // exclude the disabled users
                }
            },
            {
                $project: {
                    "user.fullName": 1,
                    "user.username": 1,
                    "user.avatar": 1,
                    totalContests: 1,
                    totalQuestionsSolved: 1,
                    avgAccuracy: 1,
                    avgTimePerQuestion: 1
                }
            }
        ]),
        Userstat.countDocuments()
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Leaderboard fetched", {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            limit: limitNum,
            leaderboard
        })
    );
})





export {
    getUserStats,
    getUserTopicStats,
    getUserContestHistory,
    getLeaderboard,

}