import {asyncHandler} from '../utils/AsyncHandler.utils.js'
import {ApiError} from '../utils/ApiError.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'

import mongoose, { isValidObjectId } from 'mongoose'

import { Contest } from "../models/contest.model.js";
import { Collection } from "../models/collection.model.js"
import { ContestParticipant } from '../models/contestParticipant.model.js'
import { createContestService } from '../services/contest.services.js'
import { createContestParticipantService } from "../services/contestParticipant.services.js";

import { io } from '../socket.js';

// TODO: wrap createContest in mongoose session when more side effects added
const createContest = asyncHandler(async (req, res) => {
    const { collectionId, title, durationInMin, visibility, questionCount } = req.body;

    const qCount = Number(questionCount);
    const duration = Number(durationInMin);

    if (Number.isNaN(qCount) || Number.isNaN(duration)) {
        throw new ApiError(400, "Invalid numeric values");
    }

    if(!isValidObjectId(collectionId)){
        throw new ApiError(400, "Invalid collection ID");
    }

    if (!qCount || qCount <= 0) {
        throw new ApiError(400, "questionCount must be greater than 0");
    }

    if(duration <= 0){
        throw new ApiError(400, "Duration must be greater than 0");
    }

    const collection = await Collection.findOne(
        {
            _id : collectionId,
            ownerId : req.user._id
        }
    )

    if (!collection) throw new ApiError(404, "Collection not found");

    let questionIds;
    try {
        questionIds = await collection.getRandomQuestionIds(qCount);
    } catch (err) {
        throw new ApiError(400, "Not enough questions in collection");
    }


    const contest = await createContestService(
        {
            title,
            owner : req.user._id,
            questionIds,
            durationInMin : duration,
            visibility
        }
    )
    // host is the first participant 
    await createContestParticipantService({
        contestId: contest._id,
        userId: req.user._id,
        joinedAt: new Date()
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, "Contest created", contest)
        )

})


// (host starts contest globally)
const startContest = asyncHandler(async (req, res) => {
    const { contestId } = req.params;

    if (!isValidObjectId(contestId)) {
        throw new ApiError(400, "Invalid contest ID");
    }

    const contest = await Contest.findById(contestId);

    if (!contest) throw new ApiError(404, "Contest not found");

    // Only host can start
    if (contest.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only host can start contest");
    }

    if (contest.status !== "upcoming") {
        throw new ApiError(400, "Contest already started");
    }

    contest.startsAt = new Date();
    contest.endsAt = new Date(
        contest.startsAt.getTime() + contest.durationInMin * 60 * 1000
    );

    contest.status = "live";

    await contest.save();

    io.to(`contest:${contest._id}:lobby`).emit("contest-started", {
        contestId: contest._id
    });

    return res.status(200).json(
        new ApiResponse(200, "Contest started", contest)
    );
});


const getContestLeaderboard = asyncHandler(async (req, res) => {

    const {contestId} = req.params;

    if(!isValidObjectId(contestId)){
        throw new ApiError(400, "Invalid contest ID");
    }

    const contest = await Contest.findById(contestId).select("visibility owner");

    if (!contest) {
        throw new ApiError(404, "Contest not found");
    }

    if (
        contest.visibility === "private" &&
        contest.owner.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403, "This contest is private");
    }


    const leaderboard = await ContestParticipant.aggregate(
        [
            {
                $match : {
                    contestId : new mongoose.Types.ObjectId(contestId),
                    submissionStatus : 'submitted'
                }
            },
            {
                $sort: {
                    score: -1,
                    timeTaken: 1
                }
            },
            {
                $lookup : {
                    from : 'users',
                    localField : 'userId',
                    foreignField : '_id',
                    as : 'user',
                }
            },
            {
                $unwind : '$user'
            },
            {
                $project: {
                    _id: 0,
                    score: 1,
                    timeTaken: 1,
                    solvedCount: 1,
                    "user.fullName": 1,
                    "user.username": 1,
                    "user.avatar": 1
                }
            }
        ]
    )

    return res.status(200).json(
        new ApiResponse(200, "Leaderboard fetched", leaderboard)
    );

})


const getContestById = asyncHandler(async (req, res) => {

    const {contestId} = req.params;

    const match = isValidObjectId(contestId) ? {_id : new mongoose.Types.ObjectId(contestId)} : {contestCode: contestId}

    const contestMeta = await Contest.findOne(match).select("visibility owner");

    if (!contestMeta) {
        throw new ApiError(404, "Contest not found");
    }

    if (
        contestMeta.visibility === "private" &&
        contestMeta.owner.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403, "This contest is private");
    }


    const contest = await Contest.aggregate(
        [
            {
                $match : match
            },
            {
                $lookup : {
                    from : 'users',
                    localField : 'owner',
                    foreignField : '_id',
                    as : 'owner'
                }
            },
            {
                $unwind : '$owner'
            },
            {
                $lookup : {
                    from : 'questions',
                    localField : 'questionIds',
                    foreignField : '_id',
                    as: "questions"
                }
            },
            {
                $project : {
                    _id: 1,
                    contestCode: 1,
                    title: 1,
                    durationInMin: 1,
                    status: 1,
                    visibility: 1,
                    startsAt: 1,
                    endsAt: 1,
                    

                    "owner.fullName": 1,
                    "owner.username": 1,
                    "owner.avatar": 1,
                    "owner._id" : 1,
                    
                    "questions._id": 1,
                    "questions.title": 1,
                    "questions.difficulty": 1,
                    "questions.platform": 1,
                    "questions.problemUrlOriginal" : 1
                }
            }
        ]
    )

    if (!contest.length) {
        throw new ApiError(404, "Contest not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Contest fetched", contest[0])
    );

 /*   What getContest does

    It answers:
        “Show me this contest’s page”

    It returns:
        Contest info
        Owner (who hosted it)
        Questions inside it

    This is used for:

        Join screen
        Contest page
        Sharing by code
        Spectator view
        Leaderboard page
*/

})

const getActiveContests = asyncHandler(async (req, res) => {
    const contests = await Contest.find({
        owner: req.user._id,
        status: { $in: ["upcoming", "live"] },
    })
    .select("title status startsAt endsAt visibility")
    .sort({ createdAt: -1 });

    return res.json(new ApiResponse(200, "My contests", contests));
});



export {
    createContest,
    startContest,
    getContestLeaderboard,
    getContestById,
    getActiveContests,
}