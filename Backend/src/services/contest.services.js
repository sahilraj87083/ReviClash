import { Contest } from "../models/contest.model.js";
import {ApiError} from '../utils/ApiError.utils.js'
import crypto from 'crypto'

const createContestService = async ({
    title,
    owner,
    questionIds,
    durationInMin,
    visibility
}) => {

    let attempts = 0;
    let contestCode;
    do {
        contestCode = crypto.randomBytes(4).toString("hex");
        attempts++;
        if (attempts > 5) {
            throw new ApiError(500, "Failed to generate contest code");
        }
    } while (await Contest.exists({ contestCode }));


    // try {
        const contest = await Contest.create(
            {
                contestCode : contestCode,
                owner : owner,
                title : title,
                questionIds : questionIds,
                durationInMin : durationInMin,
                visibility : visibility,
                status : "upcoming"
            }
        )
    
        if(!contest){
            throw new ApiError(500, "Error while creating the contest", {})
        }
        return contest;

    // } catch (error) {
    //     throw new ApiError(500, "Server Error while creating the contest", error.message)
    // }
}




export {
    createContestService,
}