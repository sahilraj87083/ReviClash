import {asyncHandler} from '../utils/AsyncHandler.utils.js'
import {ApiError} from '../utils/ApiError.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'
import mongoose, { isValidObjectId } from 'mongoose'
import { Collection } from '../models/collection.model.js'
import { Question } from "../models/question.model.js";
import {CollectionQuestion} from '../models/collectionQuestion.model.js'
import { createCollectionService } from '../services/collection.services.js'


const createCollection = asyncHandler( async (req, res) => {
    const {name , description, isPublic} = req.body

    if (!name || !name.trim()) {
        throw new ApiError(400, "Collection name is required");
    }
    const isPublicSafe = typeof isPublic === "boolean" ? isPublic : false;

    const collection = await createCollectionService(
        {
            ownerId : req.user._id,
            name : name.trim(),
            description : description?.trim() || "",
            isPublic : isPublicSafe
        }
    )

    return res
        .status(201)
        .json(new ApiResponse(201, "Collection created", collection));
})

const deleteCollections = asyncHandler( async (req, res) => {
    const {collectionId} = req.params

    if(!isValidObjectId(collectionId)){
        throw new ApiError(400, "Invalid collection ID");
    }

    const collection = await Collection.findOneAndDelete({
        _id: collectionId,
        ownerId: req.user._id,
    });

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    // Remove all question links (safe cleanup)
    await CollectionQuestion.deleteMany({ collectionId: collectionId });

    return res
        .status(200)
        .json(new ApiResponse(200, "Collection deleted"));

})

const getMyCollections = asyncHandler( async (req, res) => {

    const collections = await Collection.find(
        {
            ownerId : req.user._id
        }
    ).sort({createdAt : -1})

    return res
        .status(200)
        .json(new ApiResponse(200, "Collections fetched", collections));
})


const getCollectionById = asyncHandler( async (req, res) => {

    const {collectionId} = req.params

    if(!isValidObjectId(collectionId)){
        throw new ApiError(400, "Invalid collection ID");
    }

    const collection = await Collection.findOne(
        {
            _id : collectionId,
            ownerId : req.user._id
        }
    )

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Collection fetched", collection));
})

const updateCollection = asyncHandler( async (req, res) => {
    
    const {collectionId} = req.params
    const { name, description, isPublic } = req.body;

    if(!isValidObjectId(collectionId)){
        throw new ApiError(400, "Invalid collection ID");
    }

    if (!name && !description && isPublic === undefined) {
        throw new ApiError(400, "At least one field is required");
    }

    if (name && !name.trim()) {
        throw new ApiError(400, "Collection name cannot be empty");
    }

    const update = {};
    if (name){
        update.name = name.trim();
        update.nameLower = name.trim().toLowerCase();
    }
    if (description !== undefined) update.description = description.trim();
    if (isPublic !== undefined) update.isPublic = isPublic;

    const collection = await Collection.findOneAndUpdate(
        {
            _id : collectionId,
            ownerId : req.user._id
        },
        {
            $set : update
        },
        {
            new : true,
            runValidators : true
        }
    )

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Collection updated", collection));
})

const getCollectionQuestions = asyncHandler( async (req, res) => {
    const {collectionId} = req.params

    if(!isValidObjectId(collectionId)){
        throw new ApiError(400, "Invalid collection ID");
    }

    const collection = await Collection.findOne({
        _id: collectionId,
        ownerId: req.user._id,
    });

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    const questions = await CollectionQuestion.aggregate(
        [
            { 
                $match : {
                    collectionId : new mongoose.Types.ObjectId(collectionId),
                }
            },
            {
                $sort : {
                    order : 1,
                    addedAt : -1
                }
            },
            {
                $lookup : {
                    from: "questions",
                    localField: "questionId",
                    foreignField: "_id",
                    as: "question",
                }
            },
            {
                $unwind : "$question"
            },
            {
                $match : {
                    "question.isDeleted": false
                }
            },
            {
                $project: {
                    _id: 0,
                    order: 1,
                    addedAt: 1,
                    question: 1,
                }
            }
        ]
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Collection questions fetched", {
                collection,
                questions,
            })
        );
})


export {
    createCollection,
    deleteCollections,
    getMyCollections,
    getCollectionById,
    updateCollection,
    getCollectionQuestions
}