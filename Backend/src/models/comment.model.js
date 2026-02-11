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
    }
},{timestamps : true})

commentSchema.index({ postId : 1, createdAt: -1 })


export const Comment = mongoose.model('Comment',commentSchema)