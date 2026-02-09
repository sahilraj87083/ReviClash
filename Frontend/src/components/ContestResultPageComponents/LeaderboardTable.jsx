import { Trophy, Medal, Timer, CheckCircle2 } from "lucide-react";
import PodiumCard from "./PodiumCard";
function LeaderboardTable({ leaderboard = [] }) {
  if (!leaderboard || leaderboard.length === 0) return null;

  // Separate Top 3 from the rest
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Helper to get rank colors
  const getRankStyles = (rank) => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/50",
          text: "text-yellow-500",
          glow: "shadow-[0_0_20px_rgba(234,179,8,0.2)]",
          icon: "🥇",
        };
      case 2:
        return {
          bg: "bg-slate-400/10",
          border: "border-slate-400/50",
          text: "text-slate-300",
          glow: "shadow-[0_0_15px_rgba(148,163,184,0.1)]",
          icon: "🥈",
        };
      case 3:
        return {
          bg: "bg-orange-700/10",
          border: "border-orange-700/50",
          text: "text-orange-400",
          glow: "shadow-[0_0_15px_rgba(194,65,12,0.1)]",
          icon: "🥉",
        };
      default:
        return {
          bg: "bg-slate-800/50",
          border: "border-slate-700",
          text: "text-slate-400",
          glow: "",
          icon: `#${rank}`,
        };
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-wide">
          Leaderboard
        </h3>
      </div>

      {/* --- PODIUM SECTION (Top 3) --- */}
      {/* Grid: On mobile stack vertically, on tablet+ show standard podium layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end relative">
        
        {/* Re-order for Desktop Podium: 2nd, 1st, 3rd */}
        {/* We map manually to control layout order */}
        
        {/* Rank 2 (Silver) - Left on Desktop */}
        {top3[1] && <PodiumCard player={top3[1]} styles={getRankStyles(2)} order="order-2 md:order-1" height="h-64 md:h-72" />}
        
        {/* Rank 1 (Gold) - Center on Desktop (Tallest) */}
        {top3[0] && <PodiumCard player={top3[0]} styles={getRankStyles(1)} order="order-1 md:order-2" height="h-72 md:h-80" isWinner />}
        
        {/* Rank 3 (Bronze) - Right on Desktop */}
        {top3[2] && <PodiumCard player={top3[2]} styles={getRankStyles(3)} order="order-3" height="h-66 md:h-66" />}
      </div>


      {/* --- LIST SECTION (Rank 4+) --- */}
      {rest.length > 0 && (
        <div className="flex flex-col gap-3 mt-6">
          <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 pl-2">
            Runner Ups
          </h4>
          
          {rest.map((p) => (
            <div
              key={p?.userId || p?.user?._id}
              className="group flex items-center justify-between bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-3 md:p-4 transition-all duration-300"
            >
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                {/* Rank Number */}
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-500 bg-slate-900 rounded-lg">
                  {p.rank}
                </span>

                {/* Avatar */}
                <img
                  src={p.user?.avatar?.url || `https://ui-avatars.com/api/?name=${p.user?.fullName}`}
                  alt={p.user?.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-slate-500 transition-colors"
                />

                {/* User Info */}
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-200 font-medium truncate text-sm md:text-base">
                    {p.user?.fullName}
                  </span>
                  <span className="text-slate-500 text-xs truncate">
                    @{p.user?.username}
                  </span>
                </div>
              </div>

              {/* Stats Grid (Right Side) */}
              <div className="flex items-center gap-4 md:gap-8 text-right">
                
                {/* Solved Count (Hidden on very small screens) */}
                <div className="hidden sm:flex flex-col items-end">
                   <div className="flex items-center gap-1 text-xs text-slate-400">
                     <CheckCircle2 size={12} /> Solved
                   </div>
                   <span className="text-slate-300 font-mono text-sm">{p.solvedCount}</span>
                </div>

                {/* Time (Hidden on small screens) */}
                <div className="hidden md:flex flex-col items-end">
                   <div className="flex items-center gap-1 text-xs text-slate-400">
                     <Timer size={12} /> Time
                   </div>
                   <span className="text-slate-300 font-mono text-sm">{p.totalTimeSpent}m</span>
                </div>

                {/* Score (Always Visible) */}
                <div className="flex flex-col items-end min-w-[60px]">
                   <span className="text-xs text-slate-500 font-semibold uppercase">Points</span>
                   <span className="text-white font-bold text-lg md:text-xl tracking-tight">
                     {p.score?.toFixed(1)}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default LeaderboardTable;