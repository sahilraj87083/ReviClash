import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true,
        trim: true,
        maxlength: 1500
    },
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post',
        required: true,
        index: true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true,
        index: true
    },
    // To support nested replies
    parentId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
        index: true
    },
    
    likeCount: {
        type: Number,
        default: 0
    },
    replyCount: {
        type: Number,
        default: 0
    }
}, { timestamps : true })

// Optimized index to fetch top-level comments for a post quickly
commentSchema.index({ postId : 1, parentId: 1, createdAt: -1 });

export const Comment = mongoose.model('Comment', commentSchema);