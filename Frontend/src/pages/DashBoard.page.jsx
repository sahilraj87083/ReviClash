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
import { 
  Trophy, 
  Target, 
  Clock, 
  Zap, 
  Layout, 
  Plus, 
  Play, 
  History,
  Loader2,
  CalendarDays
} from "lucide-react";

function Dashboard() {
  const containerRef = useRef(null);
  const historyRef = useRef(null); // Ref for Lazy Loading
  const navigate = useNavigate();
  const { user } = useUserContext();
  
  const [userStat, setUserStat] = useState(null);
  const [recentContests, setRecentContests] = useState(null); // null = not loaded yet
  const [loadingHistory, setLoadingHistory] = useState(false);

  // 1. Fetch Stats Immediately (Above Fold Content)
  useEffect(() => {
    if (!user?._id) return;
    (async () => {
        try {
            const data = await getUserStats(user._id);
            setUserStat(data);
        } catch (error) {
            console.error(error);
        }
    })();
  }, [user?._id]);

  // 2. Lazy Load History (Intersection Observer)
  useEffect(() => {
    if (!user?._id || recentContests !== null) return; // Don't fetch if already loaded

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchHistory();
          observer.disconnect(); // Stop observing once triggered
        }
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    if (historyRef.current) {
      observer.observe(historyRef.current);
    }

    return () => observer.disconnect();
  }, [user?._id, recentContests]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
        // Artificial delay to show the skeleton (remove in production if super fast)
        // await new Promise(r => setTimeout(r, 500)); 
        const history = await getUserContestHistory(user._id, 5);
        setRecentContests(history);
    } catch (error) {
        console.error(error);
    } finally {
        setLoadingHistory(false);
    }
  };

  // Animations
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(containerRef.current.children, {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  // Format Helpers
  const formatTime = (seconds) => {
     if(!seconds) return "0s";
     const m = Math.floor(seconds / 60);
     const s = Math.round(seconds % 60);
     return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 pt-10 text-white pb-20 selection:bg-red-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        
        {/* --- 1. HERO PROFILE SECTION --- */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          {/* Cover Image */}
          <div
            className="h-48 w-full bg-cover bg-center opacity-60"
            style={{
              backgroundImage: `url(${user?.coverImage?.url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"})` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          </div>

          <div className="relative px-6 pb-6 -mt-12 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
            
            <div className="flex items-end gap-5">
              {/* Avatar with Glow */}
              <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative w-24 h-24 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden flex items-center justify-center">
                    {user?.avatar?.url ? (
                        <img src={user.avatar.url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl font-bold capitalize">{user?.fullName?.[0]}</span>
                    )}
                  </div>
              </div>

              <div className="mb-2">
                <h1 className="text-3xl font-bold text-white leading-tight">
                  {user?.fullName}
                </h1>
                <p className="text-slate-400 font-medium">@{user?.username}</p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/user/questions')}
                className="flex-1 md:flex-none"
              >
                <History size={16} className="mr-2"/> My Questions
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate("/user/collections?action=list")}
                className="flex-1 md:flex-none"
              >
                <Layout size={16} className="mr-2"/> Collections
              </Button>
            </div>
          </div>
        </section>


        {/* --- 2. STATS GRID (Bento Style) --- */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
             title="Contests" 
             value={userStat?.totalContests || 0} 
             icon={Trophy} 
             color="text-yellow-400" 
             bg="bg-yellow-400/10"
          />
          <StatCard 
             title="Solved" 
             value={userStat?.totalQuestionsSolved || 0} 
             icon={Target} 
             color="text-green-400" 
             bg="bg-green-400/10"
          />
          <StatCard 
             title="Accuracy" 
             value={`${userStat?.avgAccuracy ? userStat.avgAccuracy.toFixed(1) : 0}%`} 
             icon={Zap} 
             color="text-blue-400" 
             bg="bg-blue-400/10"
          />
          <StatCard 
             title="Avg Time" 
             value={formatTime(userStat?.avgTimePerQuestion)} 
             icon={Clock} 
             color="text-orange-400" 
             bg="bg-orange-400/10"
          />
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* --- 3. QUICK ACTIONS (Left Col) --- */}
            <section className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap size={20} className="text-red-500" /> Quick Actions
                </h2>
                
                <div className="grid sm:grid-cols-3 gap-4">
                    <ActionCard
                        title="Create Collection"
                        desc="Organize problems."
                        icon={Plus}
                        onClick={() => navigate("/user/collections?action=create")}
                    />
                    <ActionCard
                        title="Host Contest"
                        desc="Challenge friends."
                        icon={Trophy}
                        highlight
                        onClick={() => navigate("/user/contests?tab=create")}
                    />
                    <ActionCard
                        title="Join Contest"
                        desc="Enter with code."
                        icon={Play}
                        onClick={() => navigate("/user/contests?tab=join")}
                    />
                </div>
            </section>

            {/* --- 4. RECENT HISTORY (Right Col - Lazy Loaded) --- */}
            <section ref={historyRef} className="space-y-6 min-h-[300px]">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CalendarDays size={20} className="text-blue-500" /> Recent Activity
                </h2>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    {/* Loading State */}
                    {loadingHistory && (
                         <div className="p-8 flex flex-col items-center justify-center text-slate-500 gap-3">
                            <Loader2 size={30} className="animate-spin text-red-500" />
                            <p className="text-sm">Loading history...</p>
                         </div>
                    )}

                    {/* Loaded State */}
                    {!loadingHistory && recentContests && (
                        <>
                            {recentContests.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <Trophy size={40} className="mx-auto mb-3 opacity-20" />
                                    <p>No contests played yet.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-800/50">
                                    {recentContests.map((c) => (
                                        <RecentRow
                                            key={c.contestId}
                                            data={c}
                                            onClick={() => navigate(`/contests/${c.contestId}/leaderboard`)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;