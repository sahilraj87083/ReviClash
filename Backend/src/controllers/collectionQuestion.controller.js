import {asyncHandler} from '../utils/AsyncHandler.utils.js'
import {ApiError} from '../utils/ApiError.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'
import { isValidObjectId } from 'mongoose'
import {CollectionQuestion} from '../models/collectionQuestion.model.js'
import { validateCollection } from '../services/collectionQuestion.service.js'
import { Question } from '../models/question.model.js'
import { Collection } from '../models/collection.model.js'


const addQuestionToCollection = asyncHandler( async (req, res) => {

    const { collectionId } = req.params;
    const { questionId } = req.body;

    if(!isValidObjectId(questionId)){
        throw new ApiError(400, "Invalid question ID");
    }

    await validateCollection(collectionId, req.user._id);

    const question = await Question.findOne({
        _id: questionId,
        ownerId: req.user._id,
        isDeleted: false,
    });

    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    try {
        await Promise.all([
            CollectionQuestion.create({
                collectionId,
                questionId
            }),

            Collection.updateOne(
                { _id : collectionId},
                {$inc : {
                    questionsCount : 1
                }}
            )
        ])
        
    } catch (error) {

        if (error.code === 11000) {
            throw new ApiError(409, "Question already in this collection");
        }

        throw error;
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "Question added to collection"));

})

const removeQuestionFromCollection = asyncHandler( async (req, res) => {
    const { collectionId, questionId } = req.params;

    if(!isValidObjectId(questionId)){
        throw new ApiError(400, "Invalid question ID");
    }

    await validateCollection(collectionId, req.user._id);

    const removed = await CollectionQuestion.findOneAndDelete({
        collectionId,
        questionId,
    });

    if (!removed) {
        throw new ApiError(404, "Question not found in this collection");
    }

    await Collection.updateOne(
        { _id: collectionId },
        { $inc: { questionsCount: -1 } }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, "Question removed from collection"));

})

const bulkAddQuestions = asyncHandler( async (req, res) => {
    
})

const bulkRemoveQuestions = asyncHandler( async (req, res) => {
    
})

const reorderCollectionQuestions = asyncHandler( async (req, res) => {
    
})

const removeAllQuestions = asyncHandler( async (req, res) => {
    
})



export {
    addQuestionToCollection,
    removeQuestionFromCollection,
    bulkAddQuestions,
    bulkRemoveQuestions,
    reorderCollectionQuestions,
    removeAllQuestions,
}