import { asyncHandler } from "../utils/AsyncHandler.utils";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { ApiError } from "../utils/ApiError.utils";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.js";
import { Post } from "../models/post.model.js";
import { createPost } from "../services/post.services.js";


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

        const post = await createPost({
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

})

const getAllPost = asyncHandler( async(req, res) => {

})

const getPostById = asyncHandler( async(req, res) => {

})

const editPost = asyncHandler( async(req, res) => {

})


export{
    addPost,
    deletePost,
    getAllPost,
    getPostById,
    editPost
}