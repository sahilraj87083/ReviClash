import {asyncHandler} from '../utils/AsyncHandler.utils.js'
import {ApiError} from '../utils/ApiError.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'
import { isValidObjectId } from 'mongoose'
import { Collection } from '../models/collection.model.js'
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
    
})

const getCollectionQuestions = asyncHandler( async (req, res) => {
    
})


export {
    createCollection,
    deleteCollections,
    getMyCollections,
    getCollectionById,
    updateCollection,
    getCollectionQuestions
}