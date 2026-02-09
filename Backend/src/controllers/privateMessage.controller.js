import { asyncHandler } from '../utils/AsyncHandler.utils.js'
import { paginate } from '../utils/pagination.utils.js'
import { getConversationMessagesService, clearConversationService} from '../services/privateMessage.service.js'
import { getPrivateRoom } from '../utils/getPrivateRoom.js'
import { ApiResponse } from '../utils/ApiResponse.utils.js'
import { ApiError } from '../utils/ApiError.utils.js'
import { PrivateMessage } from '../models/privateMessage.model.js'
import { Follow } from '../models/follow.model.js'
import { User } from '../models/user.model.js'
import mongoose from 'mongoose'


const getInbox = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user?._id);

    const conversations = await PrivateMessage.aggregate([
        {
            $match : {
                deletedFor : { $ne : userId},
                $or : [
                    { senderId : userId},
                    { receiverId : userId}
                ]
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $group : {
                _id : '$conversationId',
                lastMessage : { 
                    $first : '$message'
                },
                lastAt : { 
                    $first : "$createdAt"
                },
                senderId : {
                    $first : '$senderId'
                },
                receiverId : {
                    $first : '$receiverId'
                },
                unreadCount: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $ne: ["$senderId", userId] }, // sent by other user
                                    { $ne: ["$status", "read"] }    // not read
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $addFields : {
                otherUserId : {
                    $cond : [
                        { $eq : ["$senderId", userId]},
                        "$receiverId",
                        "$senderId",
                    ]
                }
            }
        },
        {
            $lookup : {
                from : "users",
                localField: "otherUserId",
                foreignField : '_id',
                as : "user"
            }
        },
        { $unwind: "$user" },
        {
            $project : {
                conversationId: "$_id",
                unreadCount: 1,
                lastMessage: 1,
                lastAt: 1,
                user : {
                    _id: "$user._id",
                    fullName: "$user.fullName",
                    avatar: {
                        url : "$user.avatar.url"
                    },
                    username : '$user.username'
                }
            }
        },
        { $sort : { lastAt : -1}}
    ])

    const existingUserIds = conversations.map(c => c.user._id.toString());

    const followDocs = await Follow.find({
        $or: [
            { followerId: userId },
            { followingId: userId }
        ]
    }).lean();

    const relatedUserIds = new Set();

    followDocs.forEach( f => {
        if (f.followerId.toString() !== userId.toString())
            relatedUserIds.add(f.followerId.toString());

        if (f.followingId.toString() !== userId.toString())
            relatedUserIds.add(f.followingId.toString());
    });

    const newChatUserIds = [...relatedUserIds].filter(
        id => !existingUserIds.includes(id)
    );

    const newUsers = await User.find(
        { _id: { $in: newChatUserIds } },
        { fullName: 1, avatar: {
            url : 1
        }, username : 1 }
    ).lean();

    const inbox = [
        ...conversations.map(c => ({
            conversationId: c.conversationId,
            unreadCount: c.unreadCount,
            lastMessage: c.lastMessage,
            lastAt: c.lastAt,
            user: c.user,
            isNew: false
        })),

        ...newUsers.map(u => ({
            conversationId: null,
            lastMessage: "start conversation",
            unreadCount: 0,
            lastAt: null,
            user: u,
            isNew: true
        }))
    ];

    inbox.sort((a, b) => {
        if (!a.lastAt && !b.lastAt) return 0;
        if (!a.lastAt) return 1;
        if (!b.lastAt) return -1;
        return new Date(b.lastAt) - new Date(a.lastAt);
    });

    return res.status(200).json(new ApiResponse(200, "Inbox fetched", inbox));
})

const getPrivateMessages = asyncHandler(async (req, res) => {
    const { otherUserId } = req.params
    const { cursor } = req.query;

    const room = getPrivateRoom(req.user._id, otherUserId);

    const isAllowed = await Follow.exists({
        $or : [
            { followerId: req.user._id, followingId: otherUserId },
            { followerId: otherUserId, followingId: req.user._id }
        ]
    })

    if (!isAllowed) {
        throw new ApiError(403, "Not authorized to chat with this user");
    }

    const messageData = await getConversationMessagesService({
        userId : req.user._id,
        room,
        limit: 20,
        cursor: cursor
    });

    return res.status(200).json(
        new ApiResponse(200, "message fetched successfully", { 
            messages: messageData.messages.reverse(),
            nextCursor: messageData.nextCursor 
        })
    )

})

const clearPrivateConversation = asyncHandler (async (req, res) => {
    const { otherUserId } = req.params

    const room = getPrivateRoom(req.user._id, otherUserId)

    await clearConversationService(room, req.user._id);

    return res.status(200).json( new ApiResponse(200, "Chat cleared successfully", {}))
})

export {
    getInbox,
    getPrivateMessages,
    clearPrivateConversation
}