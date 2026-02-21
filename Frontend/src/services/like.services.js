import { api } from "./api.services";

export const togglePostLikeService = async (postId) => {
    const res = await api.post(`/like/${postId}`);
    return res.data.data;
};

export const getAllLikedPostsService = async ({ cursor, limit = 15 } = {}) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit);

    const res = await api.get(`/like?${params.toString()}`);
    return res.data.data;
};