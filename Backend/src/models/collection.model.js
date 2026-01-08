import mongoose from "mongoose";

import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        description: {
            type: String,
            maxlength: 300,
        },

        isPublic: {
            type: Boolean,
            default: false,
        },

        questionsCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

collectionSchema.index({ ownerId: 1, name: 1 });

export const Collection = mongoose.model("Collection", collectionSchema);
