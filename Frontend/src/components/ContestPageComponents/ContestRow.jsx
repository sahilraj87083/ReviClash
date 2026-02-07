import { useNavigate } from "react-router-dom";
import { 
  Trophy, 
  Lock, 
  Globe, 
  Calendar, 
  Clock, 
  ChevronRight,
  Zap 
} from "lucide-react";

function ContestRow({ contest }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (contest.status === 'ended') {
      navigate(`/contests/${contest._id}/leaderboard`);
    } else if (contest.status === "upcoming") {
      if (contest.visibility === "private") {
        navigate(`/user/contests/private/${contest._id}`);
      } else {
        navigate(`/user/contests/public/${contest._id}`);
      }
    } else {
      navigate(`/contests/${contest._id}/live`);
    }
  };

  // Helper for Status UI
  const getStatusConfig = (status) => {
    switch (status) {
      case "live":
        return {
          color: "text-red-500",
          bg: "bg-red-500/10 border-red-500/20",
          icon: Zap,
          label: "Live Now"
        };
      case "upcoming":
        return {
          color: "text-blue-400",
          bg: "bg-blue-500/10 border-blue-500/20",
          icon: Clock,
          label: "Upcoming"
        };
      default:
        return {
          color: "text-slate-400",
          bg: "bg-slate-800 border-slate-700",
          icon: Trophy,
          label: "Ended"
        };
    }
  };

  const statusConfig = getStatusConfig(contest.status);
  const StatusIcon = statusConfig.icon;

  // Format Date (Simple formatter)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div 
      onClick={handleNavigate}
      className="group flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-800/50 transition-all cursor-pointer border-l-2 border-transparent hover:border-red-500 gap-4"
    >
      <div className="flex items-start gap-4">
        {/* Icon Box */}
        <div className={`p-3 rounded-xl ${statusConfig.bg} ${statusConfig.color} shrink-0`}>
          <StatusIcon size={24} />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-white font-semibold text-lg group-hover:text-red-400 transition-colors">
            {contest.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
            {/* Status Badge */}
            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.color} border border-transparent`}>
                {contest.status === 'live' && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span></span>}
                {statusConfig.label}
            </span>

            {/* Visibility */}
            <div className="flex items-center gap-1.5">
              {contest.visibility === 'private' ? <Lock size={14} /> : <Globe size={14} />}
              <span className="capitalize">{contest.visibility}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>
                {contest.status === 'upcoming' 
                  ? `Starts: ${formatDate(contest.startsAt)}` 
                  : `Ended: ${formatDate(contest.endsAt)}`
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Arrow */}
      <div className="hidden md:flex items-center text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all">
        <ChevronRight size={24} />
      </div>
    </div>
  );
}

export default ContestRow;