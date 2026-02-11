import { asyncHandler } from "../utils/AsyncHandler.utils";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { ApiError } from "../utils/ApiError.utils";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.js";
import { Like } from "../models/like.model.js";

const togglePostLike = asyncHandler( async(req, res) => {

})


const getAllLikedPost = asyncHandler( async(req, res) => {

})


// future extend to
// const toggleCommentLike = asyncHandler( async(req, res) => {

// })


export{
    togglePostLike,
    getAllLikedPost
}