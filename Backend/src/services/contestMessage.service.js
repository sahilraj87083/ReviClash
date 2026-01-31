import { ContestMessage } from '../models/contestMessage.model.js'

export const createContestMessageService = async ({contestId, senderId, message, messageType = "text", phase = "lobby"}) => {
    const msg = await ContestMessage.create({
        contestId : contestId,
        senderId : senderId,
        message : message,
        messageType : messageType,
        phase : phase
    })

    const populated = await msg.populate({
        path: "senderId",
        select: "fullName avatar username",
    });

    return populated;
}

export const createSystemMessageService = async ({contestId , message, phase = "live"}) => {
    return ContestMessage.create({
        contestId,
        senderId: null,
        message,
        messageType: "system",
        phase,
    });
}

export const getContestMessagesService = async ({ contestId, page, skip, limit }) => {
    return ContestMessage.find({ contestId }).populate("senderId", "fullName avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
}

