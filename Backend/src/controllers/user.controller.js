import {ApiError} from '../utils/ApiError.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'
import {asyncHandler} from '../utils/AsyncHandler.utils.js'
import {uploadOnCloudinary, deleteFromCloudinary} from '../utils/cloudinary.utils.js'
import {hashToken} from '../utils/hashToken.utils.js'
import {User} from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { createNewUserService, generateAccessAndRefereshTokensService } from '../services/user.services.js'
import { OTP } from '../models/otp.model.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { sendEmail } from '../utils/sendEmail.utils.js'

const registerUser = asyncHandler(async(req, res) => {

    const {username, fullName, email, password, otp} = req.body

    if([username, fullName, email, password, otp].some((field) => field.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    // 2. Verify OTP (Final Check)
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
         throw new ApiError(400, "OTP expired. Please request a new one.");
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
        throw new ApiError(400, "Invalid OTP");
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

    // CLEANUP: Now we delete the OTP so it can't be used again
    await OTP.deleteOne({ _id: otpRecord._id });

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
        secure : true,
        sameSite: "none"
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
                refreshToken
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
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

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
        ).select("+refreshToken +emailVerified");

        if (!user) {
            throw new ApiError(401, "Refresh token revoked");
        }

        const {accessToken, refreshToken} = await generateAccessAndRefereshTokensService(user._id)

        //  send new cookie

        const option = {
            httpOnly : true,
            secure : true,
            sameSite : 'None'
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
                    accessToken : accessToken,
                    refreshToken : refreshToken
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

const searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === "") {
        return res.status(200).json(new ApiResponse(200, "No query provided", []));
    }

    // Performing case-insensitive search on username OR fullName
    // Exclude the current user from results
    const users = await User.find({
        $and: [
            { _id: { $ne: req.user._id } }, // Exclude self
            {
                $or: [
                    { username: { $regex: query, $options: "i" } },
                    { fullName: { $regex: query, $options: "i" } }
                ]
            }
        ]
    })
    .select("fullName username avatar.url _id") 
    .limit(5);

    return res.status(200).json(
        new ApiResponse(200, "Users fetched successfully", users)
    );
});


const updateUsername = asyncHandler(async (req, res) => {
    const { newUsername } = req.body;

    const normalized = newUsername.toLowerCase().trim();

    // same username → no-op
    if (normalized === req.user.username) {
        return res.json(
            new ApiResponse(200, "Username unchanged", req.user)
            );
    }

    // check if taken
    const exists = await User.exists({ username: normalized });

    if (exists) {
        throw new ApiError(409, "Username already taken");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { username: normalized },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(500, "Failed to update username");
    }

    return res.status(200).json(
        new ApiResponse(200, "Username updated successfully", updatedUser)
    );
});

const checkUsernameAvailability = asyncHandler( async( req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
    }
    const user = await User.findOne({ username: username.trim().toLowerCase()});

    return res.status(200).json(
        new ApiResponse(200, "Username check complete", {
            isAvailable: !user,
            username: username 
        })
    );
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
        {
            $lookup: {
                from: "collections",
                localField: "_id",
                foreignField: "ownerId",
                pipeline: [{ $match: { isPublic: true } }],
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
                'avatar.public_id' : 0,
                'avatar._id' : 0,
                'coverImage.public_id' : 0,
                'coverImage._id' : 0,
                'collections.nameLower' : 0
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

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if (!token) throw new ApiError(400, "Token missing");

    const hashed = hashToken(token);

    const user = await User.findOne({
        emailVerificationToken: hashed,
        emailVerificationExpiry: { $gt: Date.now() }
    }).select("+emailVerificationToken");

    if (!user) throw new ApiError(400, "Token invalid or expired");
    
    if (user.emailVerified) {
        return res.json(new ApiResponse(200, "Email already verified"));
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save();

    res.json(new ApiResponse(200, "Email verified successfully"));
});


const resendVerificationEmail = asyncHandler(async (req, res) => {
    
    // await sendVerificationEmail(req.user._id);
    console.log("fix resendVerificationEmail inside user controller")
    res.json(new ApiResponse(200, "Verification email resent"));
});

// fix forgot password
const sendForgotPasswordOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
        throw new ApiError(404, "User not found with this email");
    }

    // Generate & Save OTP (Separate collection keeps User model clean)
    const otpPayload = crypto.randomInt(100000, 999999).toString();

    await OTP.findOneAndDelete({ email });
    await OTP.create({ email, otp: otpPayload });

    await sendEmail({
        to: email,
        subject: "Reset Your Password - ReviClash",
        htmlContent: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #4F46E5; letter-spacing: 5px;">${otpPayload}</h1>
                <p>Expires in 15 minutes.</p>
            </div>
        `,
        endpoint: 'no-reply'
    });

    return res.status(200).json(new ApiResponse(200, "OTP sent to email"));
});

const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    // 1. Verify the OTP from the OTP collection
    const record = await OTP.findOne({ email });
    if (!record) throw new ApiError(400, "OTP expired or invalid");

    const isValid = await bcrypt.compare(otp, record.otp);
    if (!isValid) throw new ApiError(400, "Incorrect OTP");

    // 2. Generate a random secure token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // 3. Hash it using SHA-256 for storage
    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    // 4. Update USER model with the HASHED token
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "Token expired");
    
    // Correct fields based on your provided User model
    user.passwordResetToken = hashedToken;
    user.passwordResetExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // 5. Cleanup OTP
    await OTP.deleteOne({ email });

    // 6. Return the RAW token to the frontend
    return res.status(200).json(
        new ApiResponse(200, "OTP Verified", { resetToken: rawToken })
    );
});

const resetPassword = asyncHandler( async(req, res) => {
    const { email, newPassword, resetToken } = req.body;

    if (!resetToken || !newPassword) {
        throw new ApiError(400, "Missing token or password");
    }
    // 1. Hash the incoming raw token to match against DB
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // 2. Find user with matching Hash + Non-expired time
    const user = await User.findOne({
        email,
        passwordResetToken: hashedToken,
        passwordResetExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset session. Please try again.");
    }

    // 3. Update Password
    // Your User model's pre('save') hook will automatically hash this!
    user.password = newPassword; 
    
    // 4. Clear reset fields
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;

    await user.save();

    return res.status(200).json(new ApiResponse(200, "Password reset successfully"));
})




export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUsername,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserProfile,
    verifyEmail,
    resendVerificationEmail,
    sendForgotPasswordOTP,
    verifyForgotPasswordOTP,
    resetPassword,
    checkUsernameAvailability,
    searchUsers
}


