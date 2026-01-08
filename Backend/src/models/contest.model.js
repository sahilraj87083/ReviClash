import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
    {
        contestCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        questionIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
            },
        ],

        durationInMin: {
            type: Number,
            required: true,
        },

        startsAt: Date,
        endsAt: Date,

        visibility: {
            type: String,
            enum: ["private", "shared", "public"],
            default: "private",
        },

        status: {
            type: String,
            enum: ["upcoming", "live", "ended"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

export const Contest = mongoose.model("Contest", contestSchema);
