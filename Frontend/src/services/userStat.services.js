import { api } from "./api.services";

export const getUserStats = async (userId) => {
    const res = await api.get(`/stats/${userId}`)
    return res.data.data
}
export const getUserContestHistory = async (userId, limit = 3) => {
  const res = await api.get(`/stats/${userId}/history`, {
    params: { limit }
  });
  return res.data.data.history;
};
