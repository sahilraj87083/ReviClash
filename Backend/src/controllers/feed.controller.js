import { asyncHandler } from "../utils/AsyncHandler.utils";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { ApiError } from "../utils/ApiError.utils";
import { Post } from "../models/post.model.js";
import { Follow } from "../models/follow.model.js";

const getGeneralfeed = asyncHandler( async(req, res) => {
    const { cursor, limit = 15 } = req.query

    const safeLimit = limit > 0 ? limit : 15

    const query = {
        visibility : 'general'
    }
    if(cursor){
        query.createdAt = { $lt : new Date(cursor)} 
    }

    const posts = await Post.find(query)
            .sort({ createdAt : -1 })
            .limit(safeLimit + 1)
            .populate('authorId', 'username fullname avatar.url')

    let hasMore = false;
    let nextCursor = null

    if(posts.length > safeLimit){
        const nextItem = posts.pop()
        nextCursor = nextItem.createdAt
        hasMore = true
    }

    return res.json(new ApiResponse(200, "Posts fetched successfully", {
        posts,
        nextCursor,
        hasMore
    }));
})

const getFriendsFeed = asyncHandler( async(req, res) => {
    const { cursor, limit = 15 } = req.query

    const safeLimit = limit > 0 ? limit : 15

    const following = await Follow.find({
        followerId : req.user._id,
    }).select('followingId')

    const ids = following.map((f) => (f.followingId))

    const query = {
        authorId : {
            $in : ids
        }
    }

    if(cursor){
        query.createdAt = { $lt : new Date(cursor)}
    }

    const posts = await Post.find(query)
                .sort({ createdAt : -1})
                .limit(safeLimit + 1)
                .populate("authorId", "username fullname avatar.url");

    let nextCursor = null
    const hasMore = false

    if(posts.length > safeLimit){
        const nextItem = posts.pop();
        nextCursor = nextItem.createdAt
        hasMore = true
    }

    return res.status(200).json(
        new ApiResponse(200, "Posts fetched Successfully",
            {
                posts: posts,
                nextCursor,
                hasMore
            }
        )
    );
})

export {
    getGeneralfeed,
    getFriendsFeed
}