import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
    userId : { // liked by
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true,
        index: true
    },
    targetId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    targetType: { 
        type: String, 
        enum: ['Post', 'Comment', 'Reel'],
        required: true 
    }

}, {timestamps : true})

likeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

export const Like = mongoose.model('Like', likeSchema)