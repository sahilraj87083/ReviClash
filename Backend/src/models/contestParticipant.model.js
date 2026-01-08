import mongoose from "mongoose";

const contestParticipantSchema = new mongoose.Schema(
  {
        contestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contest",
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        joinedAt: Date,
        startedAt: Date,
        finishedAt: Date,

        solvedCount: {
            type: Number,
            default: 0,
        },

        unsolvedCount: {
            type: Number,
            default: 0,
        },

        score: {
            type: Number,
            default: 0,
        },

        timeTaken: {
            type: Number, // seconds
            default: 0,
        },

        submissionStatus: {
            type: String,
            enum: ["submitted", "not_submitted"],
            default: "not_submitted",
        },
    },
    { timestamps: true }
    );

contestParticipantSchema.index(
    { contestId: 1, userId: 1 },
    { unique: true }
);

export const ContestParticipant = mongoose.model( "ContestParticipant", contestParticipantSchema);
