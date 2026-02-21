import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { isValidObjectId } from "mongoose";

const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content, parentId } = req.body;

    if (!postId || !isValidObjectId(postId)) {
        throw new ApiError(403, "Invalid post Id");
    }

    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment cannot be empty");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    let validParentId = null;
    if (parentId) {
        if (!isValidObjectId(parentId)) {
            throw new ApiError(403, "Invalid parent comment Id");
        }
        const parentComment = await Comment.findById(parentId);
        if (!parentComment) {
            throw new ApiError(404, "Parent comment not found");
        }
        validParentId = parentId;
    }

    const comment = await Comment.create({
        postId,
        userId: req.user._id,
        content: content.trim(),
        parentId: validParentId
    });

    if (validParentId) {
        await Comment.findByIdAndUpdate(validParentId, { $inc: { replyCount: 1 } });
    } else {
        await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    }

    // Populate user info before returning so UI can render immediately
    await comment.populate("userId", "username fullName avatar.url");

    return res.status(201).json(new ApiResponse(201, "Comment added", { ...comment.toObject(), isLiked: false }));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(403, "Invalid comment Id");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    if (comment.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    const commentsToDeleteIds = [comment._id];

    if (comment.parentId) {
        await Comment.updateOne(
            { _id: comment.parentId, replyCount: { $gt: 0 } },
            { $inc: { replyCount: -1 } }
        );
    } else {
        const replies = await Comment.find({ parentId: commentId }).select('_id');
        const replyIds = replies.map(r => r._id);
        
        if (replyIds.length > 0) {
            commentsToDeleteIds.push(...replyIds);
            await Comment.deleteMany({ parentId: commentId });
        }
        
        await Post.updateOne(
            { _id: comment.postId, commentCount: { $gt: 0 } },
            { $inc: { commentCount: -1 } }
        );
    }

    await Like.deleteMany({ 
        targetId: { $in: commentsToDeleteIds }, 
        targetType: 'Comment' 
    });

    await comment.deleteOne();

    return res.json(new ApiResponse(200, "Comment deleted", null));
});

const getAllComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { cursor, limit = 15, parentId } = req.query;

    if (!postId || !isValidObjectId(postId)) {
        throw new ApiError(403, "Invalid post Id");
    }

    const safeLimit = limit > 0 ? Number(limit) : 15;

    // Fetch replies if parentId is provided, else fetch top-level comments
    let parsedParentId = null;
    if (parentId && parentId !== 'null' && parentId !== 'undefined') {
        if (!isValidObjectId(parentId)) throw new ApiError(403, "Invalid parent Id");
        parsedParentId = parentId;
    }

    const query = { postId, parentId: parsedParentId };
    
    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }

    const comments = await Comment.find(query)
        .sort({ createdAt: -1 })
        .limit(safeLimit + 1)
        .populate("userId", "username fullName avatar.url")
        .lean();

    let nextCursor = null;
    let hasMore = false;

    if (comments.length > safeLimit) {
        const nextItem = comments.pop();
        nextCursor = nextItem.createdAt;
        hasMore = true;
    }

    // Append isLiked property for the current user
    const commentIds = comments.map(c => c._id);
    const userLikes = await Like.find({
        targetId: { $in: commentIds },
        userId: req.user._id,
        targetType: 'Comment'
    }).select('targetId').lean();

    const likedCommentIds = new Set(userLikes.map(like => like.targetId.toString()));

    const formattedComments = comments.map(comment => ({
        ...comment,
        isLiked: likedCommentIds.has(comment._id.toString())
    }));
    
    return res.status(200).json(
        new ApiResponse(200, "Comments fetched successfully", {
            comments: formattedComments,
            nextCursor,
            hasMore
        })
    );
});

const editComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(400, "Content is required");
    }

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(403, "Invalid comment Id");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    if (comment.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    comment.content = content.trim();
    await comment.save();

    await comment.populate("userId", "username fullName avatar.url");

    return res.json(new ApiResponse(200, "Comment updated", comment));
});

export {
    addComment,
    deleteComment,
    getAllComment,
    editComment
};