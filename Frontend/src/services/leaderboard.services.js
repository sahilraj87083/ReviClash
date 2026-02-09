import { api } from "./api.services"; 

export const getGlobalLeaderboardService = async (page = 1, limit = 20) => {
    const res = await api.get(`/stats/leaderboard?page=${page}&limit=${limit}`);
    return res.data.data; 
};