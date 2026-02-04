import { api } from "./api.services";

export const followUserService = (userId) =>
  api.post(`/follow/${userId}`);

export const unfollowUserService = (userId) =>
  api.delete(`/follow/${userId}`);

export const getFollowStatusService = (userId) =>
  api.get(`/follow/status/${userId}`);

export const getFollowersService = async (userId, page = 1) => {
  const res = await api.get(`/follow/followers/${userId}?page=${page}`)
  return res.data.data
}
  

export const getFollowingService = (userId, page = 1) =>
  api.get(`/follow/following/${userId}?page=${page}`);
