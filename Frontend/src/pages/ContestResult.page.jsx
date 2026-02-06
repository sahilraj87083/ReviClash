import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeaderboardService } from "../services/contest.services";

import { 
    ContestResultHeader,
    MyResultCard,
    LeaderboardTable,
    QuestionBreakdown,

 } from "../components";

function ContestResultPage() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboardService(contestId)
      .then(setData)
      .catch(() => navigate("/user/contests"))
      .finally(() => setLoading(false));
  }, [contestId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading result...
      </div>
    );
  }

  if (!data) return null;

  const { contest, type } = data;

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10 space-y-6">
        {console.log(data)}
      <ContestResultHeader contest={contest} />

      <MyResultCard
        result={data.myResult}
        type={type}
      />

      {type === "group" && (
        <LeaderboardTable leaderboard={data.leaderboard} />
      )}

      <QuestionBreakdown
      questions={data?.contest?.questionIds}
        attempts={data?.myResult?.attempts
        }
      />
    </div>
  );
}

export default ContestResultPage;
