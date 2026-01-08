import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        plan: {
            type: String,
            enum: ["free", "pro", "elite"],
            default : "free",
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active",
        },

        startedAt: {
            type: Date,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        provider: {
            type: String,
            enum: ["stripe", "razorpay"],
        },

        providerSubscriptionId: String,
    },
    { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });

export const Subscription = mongoose.model("Subscription",subscriptionSchema);
