import mongoose , {isValidObjectId} from "mongoose";
import { Follow } from "../models/follow.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {asyncHandler} from "../utils/AsyncHandler.utils.js";
import { followUserService } from "../services/follow.services.js";

const followUser = asyncHandler(async (req, res) => {

})

const unfollowUser = asyncHandler(async (req, res) => {

})

const getFollowers = asyncHandler(async (req, res) => {

})


const getFollowing = asyncHandler(async (req, res) => {

})


const getFollowStatus = asyncHandler(async (req, res) => {

})

export {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowStatus
}