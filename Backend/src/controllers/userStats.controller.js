import mongoose from "mongoose";
import { Userstat } from "../models/userStats.model.js";
import { ContestParticipant } from "../models/contestParticipant.model.js";
import { Contest } from "../models/contest.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {asyncHandler} from "../utils/AsyncHandler.utils.js";


const getUserStats = asyncHandler(async (req , res) => {

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