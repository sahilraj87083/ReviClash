import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Button,
  StatCard,
  ActionCard,
  RecentRow
} from "../components";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { getUserStats, getUserContestHistory } from "../services/userStat.services";

function Dashboard() {
  const containerRef = useRef(null);
  const navigate = useNavigate()
  const { user } = useUserContext()
  const [userStat, setUserStat] = useState()
  const [recentContests, setRecentContests] = useState();


  const fetchUserStats = async () => {
    if (!user?._id) return;
    const data = await getUserStats(user._id)
    setUserStat(data)
  }

  useEffect(() => {
    fetchUserStats();
  }, [])

  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      const history = await getUserContestHistory(user._id, 3);
      setRecentContests(history);
    })();
  }, [user?._id]);


  useGSAP(() => {
    gsap.from(containerRef.current.children, {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  const handleCreateCollection = () => {
    navigate("/user/collections?action=create");
  };

  const handleHostContest = () => {
    navigate("/user/contests?tab=create");
  };

  const handleJoinContest = () => {
    navigate("/user/contests?tab=join");
  };

  const handleViewCollections = () => {
    navigate("/user/collections?action=list");
  }
  const HandleQuestionClick = () => {
    navigate('/user/questions')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div ref={containerRef} className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* HERO / PROFILE SECTION */}
        <section className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-700">

          {/* Cover Image */}
          <div
            className="h-40 w-full bg-cover bg-center"
            style={{
              backgroundImage: (user?.coverImage ? user?.coverImage : "url(https://images.unsplash.com/photo-1517433456452-f9633a875f6f)")
            }}
          />

          {/* Content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-6 py-5">

            {/* Left: Profile */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xl font-bold text-white">
                {user?.avatar? user?.avatar : <p className="capitalize">{user?.fullName[0]}</p>}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user?.fullName}
                </h1>
                <p className="text-slate-400 text-sm" >@{user?.username}</p>
                {user?.bio ? user.bio : (<p className="text-slate-400 text-sm capitalize">
                  {user?.role}
                </p>)}
                <p className="text-slate-500 text-xs mt-1">
                  Welcome back! Ready to clash your skills today ⚔️
                </p>
              </div>
            </div>

            {/* Right: Quick Links */}
            <div className="flex gap-3">
              <Button variant="secondary" onClick = {HandleQuestionClick}>
                My Questions
              </Button>
              <Button variant="secondary" onClick = {handleViewCollections}>
                My Collections
              </Button>
            </div>
          </div>
        </section>


        {/* STATS */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Contests Played" value ={userStat?.totalContests} />
          <StatCard title="Problems Solved" value = {userStat?.totalQuestionsSolved} />
          <StatCard title="Accuracy" value = {userStat?.avgAccuracy.toFixed(3)} />
          <StatCard title="Avg Time / Q" value = {userStat?.avgTimePerQuestion.toFixed(3)} />
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard
              title="Create Collection"
              desc="Organize problems from different platforms."
              action="Create"
              onClick={handleCreateCollection}
            />
            <ActionCard
              title="Host a Contest"
              desc="Generate a contest from your collection."
              action="Host"
              onClick={handleHostContest}
            />
            <ActionCard
              title="Join Contest"
              desc="Enter a contest using code or link."
              action="Join"
              onClick={handleJoinContest}
            />
          </div>
        </section>

        {/* RECENT CONTESTS */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Contests
          </h2>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden">
            {recentContests?.length === 0 ? (
              <div className="p-6 text-slate-400 text-center">
                No contests played yet
              </div>
            ) : (
              recentContests?.map((c) => (
                <RecentRow
                  key={c.contestId}
                  title={c.contest.title}
                  score={Math.round(c.score)}
                  solved={c.solvedCount}
                  total={c.solvedCount + c.unsolvedCount}
                  onClick={() => navigate(`/contests/${c.contestId}/leaderboard`)}
                />
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Dashboard;
