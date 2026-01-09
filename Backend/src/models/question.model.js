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

        problemUrlOriginal: {
            type: String,
            required: true,
        },

        problemUrlNormalized: { // for duplicacy check
            type: String,
            required: true,
            index: true,
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


questionSchema.index(
    { ownerId: 1, problemUrlNormalized: 1 },
    { unique: true }
);

export const Question = mongoose.model("Question", questionSchema);
