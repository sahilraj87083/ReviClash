import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
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

        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent"
        },

        deletedFor: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    { timestamps: true }
);
privateMessageSchema.index({ conversationId: 1, _id: -1 });

export const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);
