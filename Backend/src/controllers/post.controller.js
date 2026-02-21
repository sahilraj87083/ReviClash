import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.js";
import { Post } from "../models/post.model.js";
import { createPostService, deletePostService } from "../services/post.services.js";
import { isValidObjectId } from "mongoose";
import { User } from '../models/user.model.js'
import { Like } from "../models/like.model.js";
import { Repost } from "../models/repost.model.js";

const addPost = asyncHandler(async (req, res) => {
    const { textContent, visibility = "general" } = req.body;

    let images = [];
    let videos = [];
    let uploadedMedia = []; // for rollback

    try {

        // ------------------------
        // VIDEO VALIDATION
        // ------------------------

        if (req.files?.videos?.length > 1) {
            throw new ApiError(400, "Only one video allowed per post");
        }

        if (req.files?.videos?.length === 1) {
            const videoFile = req.files.videos[0];

            const MAX_SIZE = 10 * 1024 * 1024; // 10MB

            if (videoFile.size > MAX_SIZE) {
                throw new ApiError(400, "Video size must not exceed 10MB");
            }
        }

        // ------------------------
        // UPLOAD IMAGES (PARALLEL)
        // ------------------------

        if (req.files?.images?.length) {

            const imageUploadPromises = req.files.images.map(file =>
                uploadOnCloudinary(file.path, { resource_type: "image" })
            );

            const uploadedImages = await Promise.all(imageUploadPromises);

            images = uploadedImages.map(img => {
                uploadedMedia.push(img.public_id);
                return {
                    url: img.secure_url,
                    public_id: img.public_id
                };
            });
        }

        // ------------------------
        // UPLOAD VIDEO (PARALLEL SAFE)
        // ------------------------

        if (req.files?.videos?.length === 1) {

            const videoUpload = await uploadOnCloudinary(
                req.files.videos[0].path,
                { resource_type: "video" }
            );

            uploadedMedia.push(videoUpload.public_id);

            videos.push({
                url: videoUpload.secure_url,
                public_id: videoUpload.public_id,
                duration: videoUpload.duration,
                thumbnail: videoUpload.secure_url.replace(".mp4", ".jpg")
            });
        }

        // ------------------------
        // EMPTY POST CHECK
        // ------------------------

        if (
            (!textContent || !textContent.trim()) &&
            images.length === 0 &&
            videos.length === 0
        ) {
            throw new ApiError(400, "Post cannot be empty");
        }

        // ------------------------
        // CREATE POST
        // ------------------------

        const post = await createPostService({
            userId: req.user._id,
            visibility,
            textContent,
            images,
            videos
        });

        return res.status(201).json(
            new ApiResponse(201, "Post created successfully", post)
        );

    } catch (error) {

        // ------------------------
        // ROLLBACK CLOUDINARY UPLOADS
        // ------------------------

        if (uploadedMedia.length > 0) {
            await Promise.all(
                uploadedMedia.map(public_id =>
                    deleteFromCloudinary(public_id)
                )
            );
        }

        throw error;
    }
});


const deletePost = asyncHandler( async(req, res) => {
    const { postId } = req.params

    if(!postId || isValidObjectId(postId)){
        throw new ApiError(403, "Invalid post Id");
    }
    
    await deletePostService(postId, req.user._id);

    return res.json(
        new ApiResponse(200, "Post deleted successfully", null)
    );
})



const getAllPost = asyncHandler(async (req, res) => {
    const { cursor, limit = 15, username, visibility } = req.query;

    const safeLimit = limit > 0 ? Number(limit) : 15;
    const query = {};

    if (username) {
        const targetUser = await User.findOne({ username }).select("_id");
        if (!targetUser) {
            return res.status(200).json(new ApiResponse(200, 'posts fetched successfully', {
                posts: [],
                nextCursor: null,
                hasMore: false
            }));
        }
        query.authorId = targetUser._id;
    }

    if (visibility && ["general", "friends"].includes(visibility)) {
        query.visibility = visibility;
    }

    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }

    const posts = await Post.find(query)
        .populate('authorId', 'username fullName avatar.url')
        .sort({ createdAt: -1 })
        .limit(safeLimit + 1)
        .lean();
    
    let nextCursor = null;
    let hasMore = false;

    if (posts.length > safeLimit) {
        const nextItem = posts.pop();
        hasMore = true;
        nextCursor = nextItem.createdAt;
    }

    const postIds = posts.map(post => post._id);

    const [userLikes, userReposts] = await Promise.all([
        Like.find({ 
            targetId: { $in: postIds }, 
            targetType: 'Post', 
            userId: req.user._id 
        }).select('targetId').lean(),
        Repost.find({ 
            postId: { $in: postIds }, 
            userId: req.user._id 
        }).select('postId').lean()
    ]);

    const likedPostIds = new Set(userLikes.map(like => like.targetId.toString()));
    const repostedPostIds = new Set(userReposts.map(repost => repost.postId.toString()));

    const formattedPosts = posts.map(post => ({
        ...post,
        isLiked: likedPostIds.has(post._id.toString()),
        isReposted: repostedPostIds.has(post._id.toString())
    }));

    return res.status(200).json(new ApiResponse(200, 'posts fetched successfully', {
        posts: formattedPosts,
        nextCursor,
        hasMore
    }));
});

const getPostById = asyncHandler( async(req, res) => {
    const { postId } = req.params

    if(!postId || isValidObjectId(postId)){
        throw new ApiError(403, "Invalid post Id");
    }

    const post = await Post.findById(postId).populate(
        "authorId", 'username fullname avatar.url'
    )

    if (!post) throw new ApiError(404, "Post not found");

    return res.json(new ApiResponse(200, post, "Post fetched successfully"));
})

const editPost = asyncHandler( async(req, res) => {
    const { postId } = req.params;
    const { textContent, visibility } = req.body;

    const post = await Post.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    if (post.authorId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    if (textContent !== undefined) post.textContent = textContent;
    if (visibility) post.visibility = visibility;

    await post.save();

    return res.json(new ApiResponse(200, "Post updated", post));
    
})


export{
    addPost,
    deletePost,
    getAllPost,
    getPostById,
    editPost
}