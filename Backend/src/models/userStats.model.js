import mongoose from 'mongoose'
const userStatsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },

        totalContests: {
            type: Number,
            default: 0,
        },

        totalQuestionsSolved: {
            type: Number,
            default: 0,
        },

        totalQuestionsAttempted: {
            type: Number,
            default: 0,
        },

        avgAccuracy: {
            type: Number,
            default: 0,
        },

        totalTimeSpent: {
        type: Number,
        default: 0
        },
        
        avgTimePerQuestion: {
            type: Number,
            default: 0,
        },

        topicStats: [
            {
                topic: String,
                solved: Number,
                attempted: Number,
            },
        ],
    },
    { timestamps: true }
);

export const Userstat = mongoose.model("Userstat", userStatsSchema);
