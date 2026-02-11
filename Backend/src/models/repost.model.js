import mongoose from "mongoose";

const repostSchema = new mongoose.Schema({
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

repostSchema.index({ postId : 1, createdAt: -1 })
repostSchema.index({ userId: 1, postId: 1 }, { unique: true })

export const Repost = mongoose.model('Repost', repostSchema)