import { api } from "./api.services";

export const toggleRepostService = async (postId) => {
    const res = await api.post(`/repost/${postId}`);
    return res.data.data;
};

export const getAllRepostedPostsService = async ({ cursor, limit = 15 } = {}) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit);

    const res = await api.get(`/repost?${params.toString()}`);
    return res.data.data;
};