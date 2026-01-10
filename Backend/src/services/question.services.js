import { Question } from "../models/question.model.js";
import {ApiError} from '../utils/ApiError.utils.js'
import {URL} from 'url'

const normalizeUrlservice = (url) => {
    try {
        new URL(url);
    } catch {
        throw new ApiError(400, "Invalid problem URL");
    }
    return url
        .trim()
        .toLowerCase()           // collapse case differences
        .replace(/\/+$/, "")     // remove trailing slash
        .split("?")[0];          // remove tracking params
};

const uploadQuestionService = async (
    {
        ownerId,
        title,
        platform,
        problemUrl,
        difficulty,
        topics = [],
    }
) => {
    try {

        const question = await Question.create({
            ownerId : ownerId,
            title : title.trim(),
            platform : platform.trim(),
            problemUrlOriginal : problemUrl,
            problemUrlNormalized : normalizeUrlservice(problemUrl),
            difficulty : difficulty.trim().toLowerCase(),
            topics : [...new Set(
                        topics
                            .filter(t => typeof t === "string" && t.trim())
                            .map(t => t.toLowerCase().trim())
                        )
                    ]
        })
    
        return question
    } catch (error) {
        if (error.code === 11000) {
            // Mongo duplicate key error
            throw new ApiError(409, "You have already added this question");
        }

        throw new ApiError(400, "Error while uploading question");
    }
}


export {
    normalizeUrlservice,
    uploadQuestionService
}
