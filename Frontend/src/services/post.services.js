// src/services/post.services.js
import { api } from "./api.services";

export const createPostService = async (formData) => {
    const res = await api.post("/post", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data.data;
};

export const getAllPostsService = async ({ cursor, limit = 15 } = {}) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit);

    const res = await api.get(`/post?${params.toString()}`);
    return res.data.data;
};

export const getPostByIdService = async (postId) => {
    const res = await api.get(`/post/${postId}`);
    return res.data.data;
};

export const editPostService = async (postId, data) => {
    const res = await api.patch(`/post/${postId}`, data);
    return res.data.data;
};

export const deletePostService = async (postId) => {
    const res = await api.delete(`/post/${postId}`);
    return res.data.data;
};