import { api } from "./api.services";


/* JOIN CONTEST*/
export const joinContestService = (contestId) =>
    api.post(`/contest-participants/${contestId}/join`).then(res => res.data.data);


/* LEAVE CONTEST*/
export const leaveContestService = async (contestId) => {
    api.delete(`/contest-participants/${contestId}/leave`).then(res => res.data.data);
}

export const getLiveTimerService = async (contestId) => {
    api.get(`/contest-participants/${contestId}/time`).then(res => res.data.data)
}

/* START (USER TIMER) */
export const enterLiveContestService = async (contestId) => {
    const res = await api.post(`/contest-participants/${contestId}/start`)
    return res.data.data
}


/* SUBMIT */
export const submitContestService = (contestId, attempts) =>
    api.post(`/contest-participants/${contestId}/submit`, { attempts }).then(res => res.data.data);;


/* MY RANK */
export const getMyRankService = (contestId) =>
    api.get(`/contest-participants/${contestId}/rank`).then(res => res.data.data);


/* MY PARTICIPANT STATE */
export const getParticipantStateService = (contestId) =>
    api.get(`/contest-participants/${contestId}/me`).then(res => res.data.data);


/* ALL PARTICIPANTS */
export const getAllParticipantsService = (contestId) =>
    api.get(`/contest-participants/${contestId}/participants`).then(res => res.data.data);
