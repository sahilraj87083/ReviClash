import mongoose from "mongoose";

const collectionQuestionSchema = new mongoose.Schema(
    {
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
            required: true,
            index: true,
        },

        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
            index: true,
        },

        order: {
            type: Number,
            default: 0,
        },

        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: false }
);

    // Prevent duplicates
collectionQuestionSchema.index(
    { collectionId: 1, questionId: 1 },
    { unique: true }
);

export const CollectionQuestion = mongoose.model("CollectionQuestion", collectionQuestionSchema);
