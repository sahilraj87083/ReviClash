import { asyncHandler } from "../utils/AsyncHandler.utils";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { ApiError } from "../utils/ApiError.utils";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.js";
import { Post } from "../models/post.model.js";


const addPost = asyncHandler( async(req, res) => {

})

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