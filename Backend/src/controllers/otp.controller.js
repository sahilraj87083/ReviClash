import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { OTP } from "../models/otp.model.js";
import { User } from '../models/user.model.js'
import { sendEmail } from "../utils/sendEmail.utils.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

// send otp
const sendOTP = asyncHandler( async (req, res) => {
    const { email } = req.body

    if (!email) throw new ApiError(400, "Email is required");

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(409, "User already exists");

    // Generate 6-digit OTP
    const otpPayload = crypto.randomInt(100000, 999999).toString();

    // Upsert logic (Delete old OTP if exists, then create new one)
    // We do this because 'findOneAndUpdate' triggers 'pre save' hooks inconsistently for hashing
    await OTP.findOneAndDelete({ email });
    
    await OTP.create({
        email,
        otp: otpPayload // This will be hashed by the pre-save hook
    });

    // Send Email (await even if it delays response, because awaiting ensures delivery)
    await sendEmail({
        to: email,
        subject: "ReviClash Verification Code",
        htmlContent : `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to ReviClash!</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #4F46E5; letter-spacing: 5px;">${otpPayload}</h1>
                <p>This code expires in 15 minutes.</p>
            </div>
        `,
        endpoint : 'no-reply'
    });

    return res.status(200).json(
        new ApiResponse(200, "OTP sent successfully")
    );
})

// 2. Verify OTP (For UI Feedback Only - Does NOT delete)
const verifyOTP = asyncHandler( async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) throw new ApiError(400, "Details required");

    // Find the hashed record
    const record = await OTP.findOne({ email });
    if (!record) throw new ApiError(400, "OTP expired or invalid");

    // Compare Hash 
    const isValid = await bcrypt.compare(otp, record.otp);
    if (!isValid) throw new ApiError(400, "Incorrect OTP");

    // DO NOT DELETE HERE. Wait for Registration.
    
    return res.status(200).json(
        new ApiResponse(200, "OTP Verified")
    );
})


export {
    sendOTP,
    verifyOTP
}