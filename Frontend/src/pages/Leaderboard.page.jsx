import { getGlobalLeaderboardService } from "../services/leaderboard.services.js";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PodiumCard from "../components/ContestResultPageComponents/PodiumCard.jsx"; // Importing your reusable component
import { 
    Trophy, 
    Medal, 
    Target, 
    Zap, 
    Clock, 
    ChevronLeft, 
    ChevronRight, 
    Loader2
} from "lucide-react";

function Leaderboard() {
    const containerRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // State
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ page: 1, pages: 1, total: 0 });

    const currentPage = Number(searchParams.get("page")) || 1;

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getGlobalLeaderboardService(currentPage);
                setData(res.leaderboard);
                setStats({
                    page: res.page,
                    pages: res.pages,
                    total: res.total
                });
            } catch (error) {
                console.error("Failed to load leaderboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage]);

    // Handle Page Change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= stats.pages) {
            setSearchParams({ page: newPage });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Separate Top 3 (Only for Page 1)
    const isFirstPage = currentPage === 1;
    const topThree = isFirstPage ? data.slice(0, 3) : [];
    const restList = isFirstPage ? data.slice(3) : data;

    // Animations
    useGSAP(() => {
        if (loading) return;
        
        const tl = gsap.timeline();

        // Animate Podium
        if (isFirstPage && topThree.length > 0) {
            tl.from(".podium-container > *", {
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: "back.out(1.7)"
            });
        }

        // Animate List items
        tl.from(".leaderboard-row", {
            y: 20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out"
        }, "-=0.2");

    }, { scope: containerRef, dependencies: [loading, currentPage] });

    // Styles for your PodiumCard
    const rankStyles = {
        1: {
            bg: "bg-yellow-500/10 backdrop-blur-md",
            border: "border-yellow-500/50",
            text: "text-yellow-400",
            glow: "shadow-lg shadow-yellow-500/20",
            icon: <Trophy className="text-yellow-400 fill-yellow-400/20" />
        },
        2: {
            bg: "bg-slate-400/10 backdrop-blur-md",
            border: "border-slate-400/50",
            text: "text-slate-300",
            glow: "shadow-lg shadow-slate-500/20",
            icon: <Medal className="text-slate-300" />
        },
        3: {
            bg: "bg-orange-600/10 backdrop-blur-md",
            border: "border-orange-600/50",
            text: "text-orange-500",
            glow: "shadow-lg shadow-orange-600/20",
            icon: <Medal className="text-orange-500" />
        }
    };

    // Helper to map backend data to PodiumCard props
    const mapToPlayer = (item, rank) => ({
        user: item.user,
        rank: rank,
        score: item.avgAccuracy, // Mapping Accuracy to Score display
        solvedCount: item.totalQuestionsSolved
    });

    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-20 px-4 md:px-8 relative overflow-hidden">
            
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div ref={containerRef} className="max-w-6xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Global <span className="text-blue-500">Leaderboard</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        See where you stand among the best developers. Rankings are updated in real-time based on contest performance.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                        <p className="text-slate-500 animate-pulse">Calculating rankings...</p>
                    </div>
                ) : (
                    <>
                        {/* --- PODIUM SECTION (Only Page 1) --- */}
                        {isFirstPage && topThree.length > 0 && (
                            <div className="podium-container flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-16 px-4">
                                
                                {/* 2nd Place */}
                                {topThree[1] && (
                                    <div className="order-2 md:order-1 w-full md:w-72">
                                        <PodiumCard 
                                            player={mapToPlayer(topThree[1], 2)}
                                            styles={rankStyles[2]}
                                            order="order-2"
                                            height="h-64 md:h-72"
                                            isWinner={false}
                                        />
                                    </div>
                                )}
                                
                                {/* 1st Place */}
                                {topThree[0] && (
                                    <div className="order-1 md:order-2 w-full md:w-80 -mt-8 md:-mt-12 z-10">
                                        <PodiumCard 
                                            player={mapToPlayer(topThree[0], 1)}
                                            styles={rankStyles[1]}
                                            order="order-1"
                                            height="h-72 md:h-80"
                                            isWinner={true}
                                        />
                                    </div>
                                )}
                                
                                {/* 3rd Place */}
                                {topThree[2] && (
                                    <div className="order-3 w-full md:w-72">
                                        <PodiumCard 
                                            player={mapToPlayer(topThree[2], 3)}
                                            styles={rankStyles[3]}
                                            order="order-3"
                                            height="h-66 md:h-66"
                                            isWinner={false}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- LIST SECTION --- */}
                        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/80">
                                <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                                <div className="col-span-6 md:col-span-4 pl-2">User</div>
                                <div className="col-span-4 md:col-span-2 text-center hidden md:block">Solved</div>
                                <div className="col-span-4 md:col-span-2 text-center hidden md:block">Accuracy</div>
                                <div className="col-span-4 md:col-span-3 text-right pr-4">Stats</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-slate-800/50">
                                {restList.map((item, index) => {
                                    // Calculate actual rank based on page
                                    const actualRank = isFirstPage 
                                        ? index + 4 
                                        : (currentPage - 1) * 20 + index + 1;

                                    return (
                                        <div 
                                            key={item._id || index} 
                                            className="leaderboard-row grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/30 transition-colors group"
                                        >
                                            {/* Rank */}
                                            <div className="col-span-2 md:col-span-1 flex justify-center">
                                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700 group-hover:border-slate-600 group-hover:bg-slate-700 transition-all">
                                                    #{actualRank}
                                                </span>
                                            </div>

                                            {/* User Info */}
                                            <div className="col-span-6 md:col-span-4 flex items-center gap-3 pl-2">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                                                    {item.user?.avatar?.url ? (
                                                        <img src={item.user.avatar.url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold bg-slate-800">
                                                            {item.user?.fullName?.[0]?.toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors">
                                                        {item.user?.fullName}
                                                    </h3>
                                                    <p className="text-slate-500 text-xs truncate">@{item.user?.username}</p>
                                                </div>
                                            </div>

                                            {/* Solved Count (Desktop) */}
                                            <div className="col-span-2 text-center hidden md:flex items-center justify-center gap-1.5 text-slate-300 font-medium">
                                                <Target size={14} className="text-green-500" />
                                                {item.totalQuestionsSolved}
                                            </div>

                                            {/* Accuracy (Desktop) */}
                                            <div className="col-span-2 text-center hidden md:flex items-center justify-center gap-1.5 text-slate-300 font-medium">
                                                <Zap size={14} className="text-yellow-500" />
                                                {item.avgAccuracy.toFixed(1)}%
                                            </div>

                                            {/* Stats (Right Aligned) */}
                                            <div className="col-span-4 md:col-span-3 flex flex-col items-end justify-center pr-4">
                                                <div className="flex items-center gap-2 md:hidden mb-1">
                                                     <span className="text-xs text-green-400 font-bold">{item.totalQuestionsSolved} Solved</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                                    <Clock size={12} />
                                                    <span>{item.avgTimePerQuestion?.toFixed(0)}s avg</span>
                                                </div>
                                                <div className="text-[10px] text-slate-500 mt-0.5">
                                                    {item.totalContests} Contests
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* --- PAGINATION --- */}
                        <div className="flex items-center justify-between mt-8 px-2 pb-8">
                             <div className="text-sm text-slate-500">
                                Page <span className="text-white font-bold">{currentPage}</span> of {stats.pages}
                             </div>

                             <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === stats.pages}
                                    className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                             </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;