import { api } from "./api.services.js";

export const addCommentService = async (postId, data) => {
    const res = await api.post(`/comment/${postId}`, data);
    return res.data.data;
};

export const getCommentsService = async ({ postId, cursor, limit = 15, parentId } = {}) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit);
    if (parentId) params.append("parentId", parentId);

    const res = await api.get(`/comment/${postId}?${params.toString()}`);
    return res.data.data;
};

export const editCommentService = async (commentId, content) => {
    const res = await api.patch(`/comment/edit/${commentId}`, { content });
    return res.data.data;
};

export const deleteCommentService = async (commentId) => {
    const res = await api.delete(`/comment/${commentId}`);
    return res.data.data;
};