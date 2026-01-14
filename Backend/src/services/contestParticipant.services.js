import { ContestParticipant } from "../models/contestParticipant.model.js";
import {ApiError} from '../utils/ApiError.utils.js'

const createContestParticipantService = async (
    {
        contestId,
        userId,
        joinedAt,
        startedAt,
    }
) => {
    try {
        
        const participant = await ContestParticipant.create({
            contestId : contestId,
            userId : userId,
            joinedAt : joinedAt,
            startedAt : startedAt
        })

        if(!participant){
            throw new ApiError(500, "Error while creating the contest participant", {})
        }
        return participant

    } catch (error) {
        throw new ApiError(500, "Server Error while creating the contest Participant", error.message)
    }
}

export {
    createContestParticipantService
}