import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        type: {
            type: String,
            enum: [
                "follow",
                "contest_invite",
                "contest_start",
                "contest_end",
                "message",
                "collection_shared",
                "system",
            ],
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        entityType: {
            type: String,
            enum: ["contest", "user", "collection", "message", null],
            default: null,
        },

        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: true }
    );

notificationSchema.index({ recipientId: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
