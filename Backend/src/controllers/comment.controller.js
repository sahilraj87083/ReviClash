import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { isValidObjectId } from "mongoose";


const addComment = asyncHandler( async(req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    if(!postId || isValidObjectId(postId)){
        throw new ApiError(403, "Invalid post Id");
    }

    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment cannot be empty");
    }

    const post = await Post.findById(postId)

    if(!post){
        throw new ApiError('400', 'Post not fount')
    }

    const comment = await Comment.create({
        postId,
        userId: req.user._id,
        content
    });

   post.commentCount++;
   await post.save();

   return res.status(200).json(new ApiResponse(200, "Comment added", comment));

})

const deleteComment = asyncHandler( async(req, res) => {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");


    if (comment.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    await comment.deleteOne();

    return res.json(new ApiResponse(200, "Comment deleted", null));
})

const getAllComment = asyncHandler( async(req, res) => {
    const { postId } = req.params;
    const { cursor, limit = 15 } = req.query;

    if(!postId || isValidObjectId(postId)){
        throw new ApiError(403, "Invalid post Id");
    }
    const safeLimit = limit > 0 ? limit : 15

    const query = { postId };
    if (cursor) query.createdAt = { $lt: new Date(cursor) };

    const comments = await Comment.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(safeLimit) + 1)
        .populate("userId", "username fullname avatar.url")
        .lean();

    let nextCursor = null
    const hasMore = false
    if(comments.length > safeLimit){
        const nextItem = comments.pop();
        nextCursor = nextItem.createdAt
        hasMore = true
    }
    
    return res.status(200).json(
        new ApiResponse(200, "posts fetched successfully" ,{
            comments,
            nextCursor,
            hasMore
        })
    );
})


const editComment = asyncHandler( async(req, res) => {
    const { commentId } = req.params;
    const { content } = req.body

    if(!content || !content.trim()){
        throw new ApiError("content is required")
    }

    if(!commentId || isValidObjectId(commentId)){
        throw new ApiError(403, "Invalid comment Id");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    if (comment.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    comment.content = content.trim();
    await comment.save();

    return res.json(new ApiResponse(200, "Comment updated", comment));
})


export {
    addComment,
    deleteComment,
    getAllComment,
    editComment
}