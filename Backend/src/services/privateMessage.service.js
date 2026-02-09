import { PrivateMessage } from '../models/privateMessage.model.js'
import { getPrivateRoom } from '../utils/getPrivateRoom.js'


export const createPrivateMessageService = async ({senderId , to, message}) => {
    const room = getPrivateRoom(senderId, to);

    const msg = await PrivateMessage.create({
        conversationId : room,
        senderId : senderId,
        receiverId : to,
        message : message
    })

    const populated = await msg.populate({
        path: "senderId",
        select: "fullName avatar username",
    });

    return populated;

}

export const getConversationMessagesService = async ({userId, room, limit = 20, cursor}) => {
    const safeLimit = limit > 0 ? limit : 20;
    // 1. Base Query
    const query = {
        conversationId: room,
        deletedFor: { $ne: userId }
    };

    if (cursor) {
        query._id = { $lt: cursor };
    }

    // 3. Fetch messages (Limit + 1 to check if next page exists)
    const messages = await PrivateMessage.find(query)
        .populate("senderId", "fullName avatar username")
        .sort({ _id: -1 }) // Sort Newest -> Oldest
        .limit(safeLimit + 1)  // Fetch one extra
        .lean();
    
    
    let nextCursor = null;
    // 4. Determine if there is a next page
    if (messages.length > limit) {
        // There are more messages! 
        // Remove the extra one we fetched
        const nextItem = messages.pop();
        
        // The new cursor is the ID of the last item in the list
        nextCursor = nextItem._id;
    }

    return {
        messages,
        nextCursor
    };
}

export const clearConversationService = async ( room , userId) => {
    // 1. Soft Delete: Mark messages as deleted for the current user
    await PrivateMessage.updateMany(
        { conversationId: room },
        { $addToSet : { deletedFor : userId}}
    );
    // 2. Hard Delete: Remove messages where BOTH users have deleted them
    // We check if the 'deletedFor' array has a size of 2 (Sender + Receiver)
    await PrivateMessage.deleteMany({
        conversationId: room,
        deletedFor: { $size: 2 } 
    });
}