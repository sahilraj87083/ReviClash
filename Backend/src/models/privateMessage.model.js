import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
            index: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);
