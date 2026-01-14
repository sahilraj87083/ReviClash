import {asyncHandler} from '../utils/AsyncHandler.utils.js'
import {ApiError} from '../utils/ApiError.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'
import mongoose, { isValidObjectId } from 'mongoose'
import { Contest } from "../models/contest.model.js";
import {Collection} from "../models/collection.model.js"
import { ContestParticipant } from '../models/contestParticipant.model.js'
import { QuestionAttempt } from '../models/questionAttempt.model.js'
import { createContestService, finalizeContestSubmissionService } from '../services/contest.services.js'
import {createContestParticipantService} from '../services/contestParticipant.services.js'




const createContest = asyncHandler(async (req, res) => {
    const { collectionId, title, durationInMin, visibility, questionCount } = req.body;

    if(!isValidObjectId(collectionId)){
        throw new ApiError(400, "Invalid collection ID");
    }

    if (!questionCount || questionCount <= 0) {
        throw new ApiError(400, "questionCount must be greater than 0");
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
        questionIds = await collection.getRandomQuestionIds(questionCount);
    } catch (err) {
        throw new ApiError(400, "Not enough questions in collection");
    }


    const contest = await createContestService(
        {
            title,
            owner : req.user._id,
            questionIds,
            durationInMin,
            visibility
        }
    )

    return res
        .status(201)
        .json(
            new ApiResponse(201, "Contest created", contest)
        )

})


const joinContest = asyncHandler(async (req, res) => {

    const {id} = req.params;
    
    let contest;
    if (isValidObjectId(id)) {
        contest = await Contest.findOne({
            $or: [{ _id: id }, { contestCode: id }]
        });
    } else {
        contest = await Contest.findOne({ contestCode: id });
    }


    if (!contest) throw new ApiError(404, "Contest not found");

    if(contest.status !== 'live' || contest.endsAt < new Date()){
        throw new ApiError(403, "Contest expired");
    }

    const now = new Date()

    const existing = await ContestParticipant.findOne({
        contestId: contest._id,
        userId: req.user._id,
    });

    if (existing) return res.status(200).json(
        new ApiResponse(200, "Already joined", existing)
    );

    const participant = await createContestParticipantService({
        contestId: contest._id,
        userId: req.user._id,
        joinedAt: now,
        startedAt: now,
    });

    const attempts = contest.questionIds.map(q => ({
        contestId: contest._id,
        questionId: q,
        userId: req.user._id,
    }));

    await QuestionAttempt.insertMany(attempts);

    return res.status(200).json(
        new ApiResponse(200, "Contest started", participant)
    );
})


const submitContest = asyncHandler(async (req, res) => {
    const {contestId} = req.params

    if(!isValidObjectId(contestId)){
        throw new ApiError(400, "Invalid contest ID");
    }

    const contest = await Contest.findById(contestId);

    if(!contest){
        throw new ApiError(404, "Contest not found");
    }

    const participant = await ContestParticipant.findOne(
        {
            contestId : contestId,
            userId : req.user._id
        }
    )

    if (!participant) throw new ApiError(403, "You are not part of this contest");

    if (participant.submissionStatus === "submitted") {
        throw new ApiError(400, "Contest already submitted");
    }

    const now = new Date();

    const allowedUntil = new Date(
        participant.startedAt.getTime() + contest.durationInMin * 60 * 1000
    );

    if (now > allowedUntil) {
        throw new ApiError(403, "Contest time has expired");
    }

    // Frontend sends:
    // {
    // "attempts" : 
    //     [
    //         { "questionId": "...", "status": "solved", "timeSpent": 120 },
    //         { "questionId": "...", "status": "unsolved", "timeSpent": 300 }
    //     ]
    // }

    const { attempts } = req.body;

    await finalizeContestSubmissionService({
        contest,
        participant,
        userId: req.user._id,
        attempts: attempts
    });

    return res.status(200).json(new ApiResponse(200, "Contest submitted successfully"));

})



const getLeaderboard = asyncHandler(async (req, res) => {

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


const getContest = asyncHandler(async (req, res) => {

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
                    
                    "questions._id": 1,
                    "questions.title": 1,
                    "questions.difficulty": 1,
                    "questions.platform": 1
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


export {
    createContest,
    joinContest,
    submitContest,
    getLeaderboard,
    getContest
}