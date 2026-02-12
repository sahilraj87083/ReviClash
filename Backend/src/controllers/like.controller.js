import { asyncHandler } from "../utils/AsyncHandler.utils";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { ApiError } from "../utils/ApiError.utils";
import { Like } from "../models/like.model.js";
import { isValidObjectId } from "mongoose";
import { Post } from "../models/post.model.js";

const togglePostLike = asyncHandler( async(req, res) => {
    const { postId } = req.params

    if(!postId || isValidObjectId(postId)){
        throw new ApiError(403, "Invalid post Id");
    }

    try {
        await Like.create({ userId: req.user._id, postId });
        await Post.updateOne({ _id: postId }, { $inc: { likeCount: 1 } });
        return res.json(new ApiResponse(200, "Post liked", null));
    } catch (err) {

        if (err.code !== 11000) throw err;

        await Like.deleteOne({ userId: req.user._id, postId });
        await Post.updateOne({ _id: postId }, { $inc: { likeCount: -1 } });
        return res.json(new ApiResponse(200,"Post unliked", null));
    }
})


const getAllLikedPost = asyncHandler( async(req, res) => {
    const {cursor , limit = 5} = req.query

    const safeLimit = limit > 0 ? limit : 10;

    const query = {
        userId : new mongoose.Types.ObjectId(req.user._id)
    }

    if(cursor){
        query.cursor = { $lt : new Date(cursor)}
    }

    const likedPosts = await Post.aggregate([
        {
            $match : query
        },

        { $sort: { createdAt: -1 } },
        { $limit: Number(safeLimit) + 1 },

        // join post
        {
            $lookup : {
                from : 'posts',
                localField : 'postId',
                foreignField : '_id',
                as: "post"
            }
        },
        { $unwind : '$post'},

        // join user
        {
            $lookup : {
                from : 'users',
                localField : 'post.authorId',
                foreignField : '_id',
                as : 'author'
            }
        },
        { $unwind : '$author'},

        {
            $project: {
                _id: 0,
                likedAt: "$createdAt",
                post: {
                    _id: "$post._id",
                    textContent: "$post.textContent",
                    images: "$post.images",
                    videos: "$post.videos",
                    likeCount: "$post.likeCount",
                    commentCount: "$post.commentCount",
                    repostCount: "$post.repostCount",
                    createdAt: "$post.createdAt"
                },
                author: {
                    _id: "$author._id",
                    username: "$author.username",
                    avatar: "$author.avatar.url"
                }
            }
        }
    ])

    let nextCursor = null
    const hasMore = false
    if(likedPosts.length > safeLimit){
        const nextItem = likedPosts.pop();
        nextCursor = nextItem.createdAt
        hasMore = true
    }

    return res.status(200).json(
        new ApiResponse(200, "posts fetched successfully" ,{
            posts: likedPosts,
            nextCursor,
            hasMore
        })
    );


})


// future extend to
// const toggleCommentLike = asyncHandler( async(req, res) => {

// })


export{
    togglePostLike,
    getAllLikedPost
}