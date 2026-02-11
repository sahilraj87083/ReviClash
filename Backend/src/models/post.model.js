import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    authorId : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true,
        index: true
    },

    likeCount : {
        type : Number,
        default : 0,
    },

    commentCount : {
        type : Number,
        default : 0,
    },

    repostCount : {
        type : Number,
        default : 0,
    },

    visibility : {
        type : String,
        enum : ['general', 'friends'],
        default : 'general',
        index : true
    },

    textContent : {
        type : String,
        trim : true,
        maxlength : 5000
    },

    images : [
        {
            url : { type : String },
            public_id : { type : String }
        }
    ]
}, { timestamps : true})

postSchema.index({ createdAt: -1 })
postSchema.index({ authorId: 1, createdAt: -1 })
postSchema.index({ visibility: 1, createdAt: -1 })

export const Post = mongoose.model('Post', postSchema)