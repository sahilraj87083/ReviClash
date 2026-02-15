import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { Repost } from "../models/repost.model.js";

const toggleRepost = asyncHandler( async(req, res) => {
    const { postId } = req.params;

    if(!postId || isValidObjectId(postId)){
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



const getAllRepostedPosts = asyncHandler( async(req, res) => {

    const { cursor, limit = 50} = req.query
    const safeLimit = limit > 0 ? limit : 50

    const query = {
        userId : req.user._id
    }
    if(cursor) {
        query.createdAt = { $lt : new Date(cursor)}
    }

    const repostedPosts = await Repost.aggregate([
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
    if(repostedPosts.length > safeLimit){
        const nextItem = repostedPosts.pop();
        nextCursor = nextItem.createdAt
        hasMore = true
    }
    
    return res.status(200).json(
        new ApiResponse(200, "posts fetched successfully" ,{
            posts: repostedPosts,
            nextCursor,
            hasMore
        })
    );
})


export {
    toggleRepost,
    getAllRepostedPosts,
}