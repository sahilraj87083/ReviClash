import mongoose , {isValidObjectId} from "mongoose";
import { Follow } from "../models/follow.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {asyncHandler} from "../utils/AsyncHandler.utils.js";
import { followUserService } from "../services/follow.services.js";

const followUser = asyncHandler(async (req, res) => {
    console.log("pahunch gya roger that")
    const {targetUserId} = req.params
    const currUser = req.user._id;

    if(!isValidObjectId(targetUserId)){
        throw new ApiError(400, "Invalid user ID");
    }

    if (targetUserId.toString() === currUser.toString()) {
        throw new ApiError(400, "You cannot follow yourself");
    }

    await followUserService({
        followerId : currUser,
        followingId : targetUserId
    })

    return res
        .status(201)
        .json(new ApiResponse(201, "User followed"));
})

const unfollowUser = asyncHandler(async (req, res) => {
    console.log("roger unfollowed")
    const {targetUserId} = req.params
    const currUser = req.user._id;

    if(!isValidObjectId(targetUserId)){
        throw new ApiError(400, "Invalid user ID");
    }

    if (targetUserId.toString() === currUser.toString()) {
        throw new ApiError(400, "Invalid req, you can't unfollow yourself");
    }

    const result = await Follow.deleteOne({
        followerId : currUser,
        followingId : targetUserId
    })

    if (result.deletedCount === 0) {
        throw new ApiError(404, "You are not following this user");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "User unfollowed"));
})

const getFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 50);
    const skip = (pageNum - 1) * limitNum;

    const matchStage = {
        followingId: new mongoose.Types.ObjectId(userId)
    };

    const [followers, total] = await Promise.all([
        Follow.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "users",
                    localField: "followerId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            { $skip: skip },
            { $limit: limitNum },
            {
                $project: {
                    userId: "$user._id",
                    username: "$user.username",
                    fullName: "$user.fullName",
                    avatar: "$user.avatar"
                }
            }
        ]),
        Follow.countDocuments(matchStage)
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Followers fetched", {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            followers
        })
    );
});



const getFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 50);
    const skip = (pageNum - 1) * limitNum;

    const matchStage = {
        followerId: new mongoose.Types.ObjectId(userId)
    };
    
    const [following, total] = await Promise.all([
        Follow.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: -1 }},
            {
                $lookup: {
                    from: "users",
                    localField: "followingId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $match: {
                    "user.isActive": { $ne: false }
                }
            },
            { $skip: skip },
            { $limit: limitNum },
            {
                $project: {
                    userId: "$user._id",
                    username: "$user.username",
                    fullName: "$user.fullName",
                    avatar: "$user.avatar"
                }
            }
        ]),
        Follow.countDocuments(matchStage)
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Following fetched", {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            following
        })
    );
})


const getFollowStatus = asyncHandler(async (req, res) => {
    const { targetUserId } = req.params;
    const currentUserId = req.user._id;

    if (!isValidObjectId(targetUserId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    if (targetUserId.toString() === currentUserId.toString()) {
        throw new ApiError(400, "Invalid request");
    }

    const [isFollowing, isFollowedBy] = await Promise.all([
        Follow.exists({
            followerId: currentUserId,
            followingId: targetUserId,
        }),
        Follow.exists({
            followerId: targetUserId,
            followingId: currentUserId,
        }),
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Follow status", {
                isFollowing: !!isFollowing,
                isFollowedBy: !!isFollowedBy,
        })
    );
})

export {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowStatus
}