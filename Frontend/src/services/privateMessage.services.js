import { api } from "./api.services";

export const getInboxService = async () => {
    const res = await api.get('/users/chat/inbox')
    return res.data.data
}

export const getPrivateMessagesService = async (otherUserId, cursor = null) => {
    const res = await api.get(`/users/chat/inbox/${otherUserId}`, {
        params: { 
            cursor: cursor // Pass the cursor as a query parameter
        }
    })
    return res.data.data
}

export const clearConversationService = async (otherUserId) => {
    const res = await api.delete(`/users/chat/inbox/${otherUserId}`);
    return res.data;
};