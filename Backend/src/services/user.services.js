import {User} from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.utils.js'
import { hashToken } from '../utils/hashToken.utils.js'
import crypto from "crypto";
import { sendMail } from "./email.service.js";



const createNewUserService = async (
    {fullName , email, password, username}
) => {


    const user = await User.create({
        fullName : fullName,
        email : email,
        password : password,
        username : username.toLowerCase()
    })

    return user;
}

const generateAccessAndRefereshTokensService = async (userId) => {
    try {
        const user = await User.findById(userId);
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = hashToken(refreshToken);
        await user.save({
            validateBeforeSave : false
        })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token", {message : error?.message})
    }
}

const sendVerificationEmail = async (user) => {
    const token = crypto.randomBytes(32).toString("hex");

    user.emailVerificationToken = hashToken(token);
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await sendMail({
        to: user.email,
        subject: "Verify your email",
        html: `
        <h2>Verify your email</h2>
        <a href="${verifyUrl}">Click here to verify</a>
        `,
    });
};

export {
    createNewUserService,
    generateAccessAndRefereshTokensService,
    sendVerificationEmail
}