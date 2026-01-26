import { useEffect, useState } from "react";
import {
    followUserService,
    unfollowUserService,
    getFollowStatusService,
} from "../services/follow.services";

export const useFollow = (targetUserId) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        isFollowing: false,
        isFollowedBy: false,
    });

    const fetchStatus = async () => {
        const res = await getFollowStatusService(targetUserId);
        setStatus(res.data.data);
    };

    useEffect(() => {
        if (!targetUserId) return;
        fetchStatus();
    }, [targetUserId]);

    const follow = async () => {
        if (loading) return;
        setLoading(true);
        await followUserService(targetUserId);
        setStatus((s) => ({ ...s, isFollowing: true }));
        setLoading(false);
    };

    const unfollow = async () => {
        if (loading) return;
        setLoading(true);
        await unfollowUserService(targetUserId);
        setStatus((s) => ({ ...s, isFollowing: false }));
        setLoading(false);
    };

    return {
        ...status,
        follow,
        unfollow,
        loading,
        refetch: fetchStatus,
    };
};
