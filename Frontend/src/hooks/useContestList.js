import { useState , useCallback, useEffect} from "react";
import { getAllContestsService, getCreatedContestsService, getJoinedContestsService } from "../services/contest.services";

export const useContestList = (type) => {
    const [contests, setContests] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalContest, setTotalContest] = useState(0)

    useEffect(() => {
        setContests([]);
        setPage(1);
        setHasMore(true);
        setTotalContest(0)
    }, [type]);

    const serviceMap = {
        all: getAllContestsService,
        created: getCreatedContestsService,
        joined: getJoinedContestsService,
    };

    const fetchMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const res = await serviceMap[type](page);
            setContests(prev => {
                const map = new Map(prev.map(c => [c._id, c]));
                res.contests.forEach(c => map.set(c._id, c));
                return Array.from(map.values());
            });
            setTotalContest(res.meta.total)
            setHasMore(page < res.meta.pages);
            setPage(p => p + 1);
        } finally {
            setLoading(false);
        }
    }, [type, page, loading, hasMore]);

    return { contests, fetchMore, loading, hasMore , totalContest };
};
