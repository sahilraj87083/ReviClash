import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils";
import { SavedPost } from "../models/savedPost.model.js";
import { isValidObjectId } from "mongoose";

const toggleSavePost = asyncHandler( async(req, res) => {
    const { postId } = req.params
    
    if(!postId || isValidObjectId(postId)){
        throw new ApiError(403, "Invalid post Id");
    }
    

    try {
        await SavedPost.create({ userId: req.user._id, postId });
        return res.json(new ApiResponse(200, "Post saved", null));

    } catch (err) {
        if (err.code !== 11000) throw err;

        await SavedPost.deleteOne({ userId: req.user._id, postId });
        return res.json(new ApiResponse(200, "Post unsaved", null));
    }
})



const getAllSavededPosts = asyncHandler( async(req, res) => {
    const { cursor, limit = 15} = req.query

    const safeLimit = limit > 0 ? limit : 15

    const query = {
        userId : req.user._id
    }
    if(cursor) {
        query.createdAt = { $lt : new Date(cursor)}
    }

    const savedPosts = await SavedPost.aggregate([
        {
            $match : query
        },
        { $sort : { createdAt : -1 }},
        { $limit : safeLimit + 1},
        {
            $lookup : {
                from : 'posts',
                localField : 'postId',
                foreignField : '_id',
                as : 'post'
            }
        },
        { $unwind : '$post'},
        {
            $lookup : {
                from : 'users',
                localField : '$post.authorId',
                foreignField : '_id',
                as : 'author'
            }
        },
        {$unwind : '$author'},
        {
            $project : {
                _id : 0,
                savedAt : "$createdAt",
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
    if(savedPosts.length > safeLimit){
        const nextItem = savedPosts.pop();
        nextCursor = nextItem.createdAt
        hasMore = true
    }

    return res.status(200).json(
        new ApiResponse(200, "posts fetched successfully" ,{
            posts: savedPosts,
            nextCursor,
            hasMore
        })
    );
})


export {
    toggleSavePost,
    getAllSavededPosts,
}