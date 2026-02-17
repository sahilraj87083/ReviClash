import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { Post } from "../models/post.model.js";
import { Follow } from "../models/follow.model.js";
import { Repost } from "../models/repost.model.js";

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
            .lean()

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
    // if user is not following anyone 
    if (!ids.length) {
        return res.json(new ApiResponse(200, "Feed fetched", {
            posts: [],
            nextCursor: null,
            hasMore: false
        }));
    }


    const postQuery = {
        authorId : {
            $in : ids
        }
    }
    const repostQuery = {
        userId: { $in: ids }
    };

    if(cursor){
        postQuery.createdAt = { $lt: new Date(cursor) };
        repostQuery.createdAt = { $lt: new Date(cursor) };
    }

    const [posts , reposts] = Promise.all([
        Post.find(postQuery)
            .populate("authorId", "username fullname avatar.url")
            .lean(),

        Repost.find(repostQuery)
            .populate({
                path: "postId",
                populate: {
                    path: "authorId",
                    select: "username fullname avatar.url"
                }
            })
            .populate("userId", "username fullname avatar.url")
            .lean()
    ])

    // Normalize
    const normalizedPosts = posts.map(post => ({
        type: "post",
        activityTime: post.createdAt,
        data: post
    }));
    
    const normalizedReposts = reposts.map(r => ({
        type: "repost",
        activityTime: r.createdAt,
        repostedBy: r.userId,
        data: r.postId
    }));

    const combined = [...normalizedPosts, ...normalizedReposts]
        .sort((a, b) => new Date(b.activityTime) - new Date(a.activityTime))
        .slice(0, safeLimit + 1);

    let nextCursor = null
    const hasMore = false

    if(combined.length > safeLimit){
        const nextItem = combined.pop();
        nextCursor = nextItem.activityTime;
        hasMore = true
    }

    return res.status(200).json(
        new ApiResponse(200, "Feed fetched Successfully",
            {
                posts: combined,
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