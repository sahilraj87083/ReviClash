import {asyncHandler} from '../utils/AsyncHandler.utils.js'
import {ApiError} from '../utils/ApiError.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'
import { isValidObjectId } from 'mongoose'
import { Collection } from '../models/collection.model.js'


const createCollection = asyncHandler( async (req, res) => {

})

const deleteCollections = asyncHandler( async (req, res) => {
    
})

const getMyCollections = asyncHandler( async (req, res) => {
    
})


const getCollectionById = asyncHandler( async (req, res) => {
    
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