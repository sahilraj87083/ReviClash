import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Repost } from "../models/repost.model.js";
import { SavedPost } from "../models/savedPost.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";

const createPostService = async ({
    userId,
    textContent ='',
    images,
    videos,
    visibility

}) => {
    const post = await Post.create({
        authorId : userId,
        textContent,
        images,
        videos,
        visibility
    })

    return post
}



const deletePostService = async (postId, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const post = await Post.findById(postId).session(session);

        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        if (post.authorId.toString() !== userId.toString()) {
            throw new ApiError(403, "Not authorized");
        }

        // Collect media public_ids
        const mediaToDelete = [
            ...(post.images?.map(img => img.public_id) || []),
            ...(post.videos?.map(vid => vid.public_id) || [])
        ];

        // Delete related documents
        await Promise.all([
            Like.deleteMany({ postId }, { session }),
            Comment.deleteMany({ postId }, { session }),
            Repost.deleteMany({ postId }, { session }),
            SavedPost.deleteMany({ postId }, { session })
        ]);

        // Delete Post
        await Post.deleteOne({ _id: postId }, { session });

        await session.commitTransaction();
        session.endSession();

        // Delete media AFTER transaction commit
        if (mediaToDelete.length > 0) {
            await Promise.all(
                mediaToDelete.map(public_id =>
                    deleteFromCloudinary(public_id)
                )
            );
        }

        return true;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};



export {
    createPostService,
    deletePostService
}