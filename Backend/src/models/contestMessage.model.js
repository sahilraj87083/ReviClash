import mongoose from 'mongoose'

const contestMessageSchema = new mongoose.Schema(
    {
        contestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contest",
            required: true,
            index: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: function () {
                return this.messageType === "text"; // only user messages require sender
            },
        },

        message: {
            type: String,
            required: true,
        },

        messageType: {
            type: String,
            enum: ["text", "system"],
            default: "text",
        },
        
        phase: {
            type: String,
            enum: ["lobby", "live", "ended"],
            default: "lobby",
            index: true,
        },
    },
    { timestamps: true }
);

export const ContestMessage = mongoose.model( "ContestMessage", contestMessageSchema);
