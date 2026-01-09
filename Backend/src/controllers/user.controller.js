import {ApiError} from '../utils/ApiError.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'
import {asyncHandler} from '../utils/AsyncHandler.utils.js'
import {uploadOnCloudinary, deleteFromCloudinary} from '../utils/cloudinary.utils.js'
import { generateAccessAndRefereshTokens } from '../utils/generateToken.utils.js'
import {hashToken} from '../utils/hashToken.utils.js'
import {User} from '../models/user.model.js'



const registerUser = asyncHandler(async(req, res) => {
    const {username, fullName, email, password} = req.body

    if([username, fullName, email, password].some((field) => field.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    // find existed user
    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    // create new user

    const user = await User.create({
        fullName : fullName,
        email : email,
        password : password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id)

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", createdUser)
    )

})

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    if(!email){
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({
        email : email
    })

    if(!user){
         throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.verifyPassword(password)

    if(!isPasswordValid){
         throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");


    const option = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie('accessToken', accessToken, option)
    .cookie('refreshToken', refreshToken, option)
    .json(
        new ApiResponse(
            200,
            "User logged In Successfully",
            {
                user : loggedInUser
            }
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    
    if (!userId) {
        throw new ApiError(401, "Unauthorized request")
    }

    const user = await User.findByIdAndUpdate(
        userId, 
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, "User logged Out", {}))
})


const refreshAccessToken = asyncHandler( async (req, res) => {
    
})

const changeCurrentPassword = asyncHandler(async(req, res) => {

})

const getCurrentUser = asyncHandler(async(req, res) => {

})

const updateAccountDetails = asyncHandler(async(req, res) => {

})

const updateUserAvatar = asyncHandler(async(req, res) => {

})

const updateUserCoverImage = asyncHandler(async(req, res) => {

})


// later 
// verifyEmail
// resendVerificationEmail
// forgotPassword
// resetPassword

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}


