import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { Repost } from "../models/repost.model.js";
import { Post } from "../models/post.model.js";
import { isValidObjectId } from 'mongoose'
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";


const toggleRepost = asyncHandler( async(req, res) => {
    const { postId } = req.params;

    if(!postId || !isValidObjectId(postId)){
        throw new ApiError(403, "Invalid post Id");
    }

    try {
        await Repost.create({ userId: req.user._id, postId });
        await Post.updateOne({ _id: postId }, { $inc: { repostCount: 1 } });
        return res.json(new ApiResponse(200, "Reposted", null));
    } catch (err) {
        if (err.code !== 11000) throw err;

        await Repost.deleteOne({ userId: req.user._id, postId });
        await Post.updateOne({ _id: postId }, { $inc: { repostCount: -1 } });
        return res.json(new ApiResponse(200, "Repost removed", null));
    }
})



// Ensure you import the User and Like models at the top of your controller file:
// import { User } from "../models/user.model.js";
// import { Like } from "../models/like.model.js";

const getAllRepostedPosts = asyncHandler(async (req, res) => {
    // 1. Extract username from query
    const { cursor, limit = 15, username } = req.query;
    const safeLimit = limit > 0 ? Number(limit) : 15;

    const query = {};

    // 2. Fix the logical bug: Target the requested user, or default to current user
    let targetUserId = req.user._id;
    
    if (username) {
        const targetUser = await User.findOne({ username }).select("_id");
        if (!targetUser) {
            return res.status(200).json(new ApiResponse(200, "posts fetched successfully", {
                posts: [],
                nextCursor: null,
                hasMore: false
            }));
        }
        targetUserId = targetUser._id;
    }

    query.userId = targetUserId;

    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }

    const repostedPosts = await Repost.aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $limit: safeLimit + 1 },
        {
            $lookup: {
                from: 'posts',
                localField: 'postId',
                foreignField: '_id',
                as: 'post'
            }
        },
        { $unwind: '$post' },
        {
            $lookup: {
                from: 'users',
                localField: 'post.authorId', 
                foreignField: '_id',
                as: 'author'
            }
        },
        { $unwind: '$author' },
        {
            $project: {
                _id: "$post._id", // Map post._id to the root _id for React keys and FeedPost
                savedAt: "$createdAt", // Keep track of when it was reposted for cursor
                textContent: "$post.textContent",
                images: "$post.images",
                videos: "$post.videos",
                likeCount: "$post.likeCount",
                commentCount: "$post.commentCount",
                repostCount: "$post.repostCount",
                visibility: "$post.visibility",
                createdAt: "$post.createdAt", // Original post creation time
                authorId: {
                    _id: "$author._id",
                    username: "$author.username",
                    fullName: "$author.fullName",
                    avatar: { url: "$author.avatar.url" } // Properly nested avatar URL
                }
            }
        }
    ]);
    
    let nextCursor = null;
    let hasMore = false; 

    if (repostedPosts.length > safeLimit) {
        const nextItem = repostedPosts.pop();
        // Use savedAt (which is Repost.createdAt) for the pagination cursor
        nextCursor = nextItem.savedAt; 
        hasMore = true;
    }

    // 3. Add isLiked and isReposted flags relative to the LOGGED-IN user viewing the feed
    const postIds = repostedPosts.map(post => post._id);

    const [userLikes, userReposts] = await Promise.all([
        Like.find({ 
            targetId: { $in: postIds }, 
            userId: req.user._id, 
            targetType: 'Post' 
        }).select('targetId').lean(),
        
        Repost.find({ 
            postId: { $in: postIds }, 
            userId: req.user._id 
        }).select('postId').lean()
    ]);

    const likedPostIds = new Set(userLikes.map(like => like.targetId.toString()));
    const repostedPostIds = new Set(userReposts.map(repost => repost.postId.toString()));

    const formattedPosts = repostedPosts.map(post => ({
        ...post,
        isLiked: likedPostIds.has(post._id.toString()),
        isReposted: repostedPostIds.has(post._id.toString())
    }));
    
    return res.status(200).json(
        new ApiResponse(200, "posts fetched successfully" ,{
            posts: formattedPosts,
            nextCursor,
            hasMore
        })
    );
});


export {
    toggleRepost,
    getAllRepostedPosts,
}