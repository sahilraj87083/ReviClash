import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        platform: {
            type: String,
            enum: ["LeetCode", "GFG", "Codeforces", "Other"],
            required: true,
        },

        problemUrl: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
        },

        topics: {
            type: [String],
            index: true,
        },
    },
    { timestamps: true }
    );

export const Question = mongoose.model("Question", questionSchema);
