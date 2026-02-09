import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true, // Speeds up search
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900, // 15 minutes TTL
    }
});

// Hash OTP before saving
otpSchema.pre("save", async function () {
    if (!this.isModified("otp")) return ;
    this.otp = await bcrypt.hash(this.otp, 10);
});

export const OTP = mongoose.model("OTP", otpSchema);