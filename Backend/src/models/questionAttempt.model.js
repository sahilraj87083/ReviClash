import mongoose from "mongoose";

const questionAttemptSchema = new mongoose.Schema(
    {
        contestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contest",
            required: true,
        },

        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["solved", "unsolved"],
            default : "unsolved",
            required: true,
        },

        timeSpent: {
            type: Number, // seconds
            default: 0,
        },
    },
    { timestamps: true }
);

questionAttemptSchema.index({
    contestId: 1,
    userId: 1,
    questionId: 1,
});

export const QuestionAttempt = mongoose.model("QuestionAttempt", questionAttemptSchema);
