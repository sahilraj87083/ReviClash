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

})

const getUserContestHistory = asyncHandler(async (req , res) => {

})

const getLeaderboard = asyncHandler(async (req , res) => {

})

export {
    getUserStats,
    getUserTopicStats,
    getUserContestHistory,
    getLeaderboard
}