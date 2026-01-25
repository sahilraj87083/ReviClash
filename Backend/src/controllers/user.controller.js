import {ApiError} from '../utils/ApiError.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'
import {asyncHandler} from '../utils/AsyncHandler.utils.js'
import {uploadOnCloudinary, deleteFromCloudinary} from '../utils/cloudinary.utils.js'
import {hashToken} from '../utils/hashToken.utils.js'
import {User} from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { createNewUserService, generateAccessAndRefereshTokensService } from '../services/user.services.js'


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

    const user = await createNewUserService({
        fullName : fullName,
        email : email,
        password : password,
        username : username
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
    }).select('+password')

    if(!user){
         throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.verifyPassword(password)

    if(!isPasswordValid){
         throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokensService(user._id)

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
                user : loggedInUser,
                accessToken,
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
    const incomingRefreshToken = req.cookies?.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request");
    }

    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        if(!decodedToken){
            throw new ApiError(401, "Invalid refresh token");
        }

        const hashedToken = hashToken(incomingRefreshToken);

        const user = await User.findOne(
            {
                _id : decodedToken._id,
                refreshToken : hashedToken
            }
        ).select("+refreshToken");

        if (!user) {
            throw new ApiError(401, "Refresh token revoked");
        }

        const {accessToken, refreshToken} = await generateAccessAndRefereshTokensService(user._id)

        //  send new cookie

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
                "Access token refreshed",
                {
                    user : user,
                    accessToken : accessToken
                }
            )
        )

    } catch (error) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password must be different from old password");
    }

    if(newPassword !== confirmPassword){
        throw new ApiError(
            400,
            "New password and Confirm Password mismatch"
        )
    }

    const user = await User.findById(req.user?._id).select("+password +refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isOldPasswordValid = await user.verifyPassword(oldPassword)

    if(!isOldPasswordValid){
        throw new ApiError(401, "Invalid old password")
    }

    // Update password
    user.password = newPassword

    // Revoke all sessions
    user.refreshToken = undefined;

    await user.save()

    // Clear cookies → force re-login
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully. Please login again.", {}))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "User fetched successfully",
        req.user
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, bio} = req.body

    if (!fullName && !bio) {
        throw new ApiError(400, "At least one field is required")
    }
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (bio) updateFields.bio = bio;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : updateFields
        },
        {
            new : true,
            runValidators : true,
        }
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "Account details updated successfully", user))
})

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    if (!req.file.mimetype.startsWith("image/")) {
        //const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        throw new ApiError(400, "Only image files are allowed");
    }

    // 1️ get current user FIRST (to capture old avatar)
    const user = await User.findById(req.user._id).select("avatar");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const oldAvatarPublicId = user.avatar?.public_id;

    // Upload new avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar || !avatar.public_id) {
        throw new ApiError(400, "Error while uploading avatar on Cloudinary")
    }
    let updatedUser;
    try {
        updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set : {
                    avatar : {
                        public_id : avatar.public_id,
                        url : avatar.secure_url
                    }
                }
            },
            {
                new : true
            }
        ).select('-password -refreshToken')
    } catch (error) {

        // Rollback new upload if DB update fails
        await deleteFromCloudinary(avatar.public_id);

        throw new ApiError(500, "Error updating avatar in database")
    }

    if(!updatedUser){
        throw new ApiError(500, "Error updating avatar in database")
    }

    //Delete old avatar from Cloudinary
    if(oldAvatarPublicId){
        // Deletion should never block user success.
        await deleteFromCloudinary(oldAvatarPublicId).catch(() => {});
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Avatar image updated successfully", updatedUser)
    )
})

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "CoverImage file is missing")
    }

    if (!req.file.mimetype.startsWith("image/")) {
        //const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        throw new ApiError(400, "Only image files are allowed");
    }

    // 1️ get current user FIRST (to capture old coverImage)
    const user = await User.findById(req.user._id).select("coverImage");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const oldCoverImagePublicId = user.coverImage?.public_id;

    // Upload new CoverImage
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage || !coverImage.public_id) {
        throw new ApiError(400, "Error while uploading CoverImage on Cloudinary")
    }
    let updatedUser;
    try {
        updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set : {
                    coverImage : {
                        public_id : coverImage.public_id,
                        url : coverImage.secure_url
                    }
                }
            },
            {
                new : true
            }
        ).select('-password -refreshToken')
    } catch (error) {

        // Rollback new upload if DB update fails
        await deleteFromCloudinary(coverImage.public_id);

        throw new ApiError(500, "Error updating coverImage in database")
    }

    if(!updatedUser){
        throw new ApiError(500, "Error updating coverImage in database")
    }

    //Delete old coverImage from Cloudinary
    if(oldCoverImagePublicId){
        // Deletion should never block user success.
        await deleteFromCloudinary(oldCoverImagePublicId).catch(() => {});
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "CoverImage image updated successfully", updatedUser)
    )
})

const getUserProfile = asyncHandler( async (req, res) => {
    // get all the details of user by username
    const {username} = req.params;
    
    if(!username || typeof username !== "string" || !username?.trim()){
        throw new ApiError(400, "Username is required")
    }

    const viewerId = req.user?._id || null; // may be public request

    const profile = await User.aggregate([
        {
            $match : {
                username : username.toLowerCase(),
                $or : [
                    { isActive : true },
                    {isActive : { $exists : false}}
                ]
            }
        },
        // Followers count
        {
            $lookup : {
                from: 'follows',
                localField : '_id',
                foreignField : 'followingId',
                as : 'followers'
            }
        },
        //  Following count
        {
            $lookup : {
                from : 'follows',
                localField : '_id',
                foreignField : 'followerId',
                as : 'following'
            }
        },
        // User stats
        {
            $lookup : {
                from : 'userstats',
                localField : '_id',
                foreignField : 'userId',
                as : 'stats'
            }
        },
        // Collections
        {
            $lookup: {
                from: "collections",
                let: { userId: "$_id" },
                pipeline: [
                {
                    $match: {
                    $expr: {
                        $and: [
                        { $eq: ["$ownerId", "$$userId"] },
                        { $eq: ["$visibility", "public"] }
                        ]
                    }
                    }
                }
                ],
                as: "collections"
            }
        },
        // Is viewer following this user?

        ...(viewerId ?
            [
                {
                    $lookup : {
                        from : 'follows',
                        let : { profileUserId : '$_id'},
                        pipeline : [
                            {
                                $match : {
                                    $expr : {
                                        $and : [
                                            { $eq : ["$followingId" , '$$profileUserId']},
                                            { $eq : ["$followerId" , new mongoose.Types.ObjectId(viewerId)]}
                                        ]
                                    }
                                }
                            }
                        ],
                        as : "viewerFollow",
                    }
                }
            ]
            : []
        ),
        {
            $addFields : {
                followersCount: { $size: "$followers" },
                followingCount: { $size: "$following" },
                isFollowedByViewer : {
                    $cond: {
                        if: { $gt: [{ $size: { $ifNull: ["$viewerFollow", []] } }, 0] },
                        then: true,
                        else: false,
                    }
                },
                stats: { $arrayElemAt: ["$stats", 0] },
            }
        },
        // Remove sensitive fields
        {
            $project : {
                password: 0,
                refreshToken: 0,
                followers: 0,
                following: 0,
                viewerFollow: 0,
            }
        }
    ])


    if (!profile || !profile.length) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "User profile fetched successfully", profile[0])
    );
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
    updateUserCoverImage,
    getUserProfile
}


