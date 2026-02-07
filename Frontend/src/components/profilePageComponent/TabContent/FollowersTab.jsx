import { useEffect, useState } from "react";
import { getFollowersService } from "../../../services/follow.services.js";
import { useNavigate } from "react-router-dom";
import { Users, ExternalLink, User } from "lucide-react";

function FollowersTab({ userId }) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const viewClickhandler = (username) => {
    if (!username) return;
    navigate(`/user/profile/${username}`);
  };

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const res = await getFollowersService(userId);
        setFollowers(res.followers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  // 1. Loading Skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-slate-800 rounded-xl bg-slate-900/30">
            <div className="w-12 h-12 bg-slate-800 rounded-full animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (followers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed animate-in fade-in zoom-in-95 duration-500">
        <div className="p-4 bg-slate-800/50 rounded-full mb-3 text-slate-600">
            <Users size={32} strokeWidth={1.5} />
        </div>
        <p className="text-base font-medium text-slate-400">No followers yet</p>
        <p className="text-xs text-slate-500 mt-1">This user hasn't connected with anyone yet.</p>
      </div>
    );
  }

  // 3. Grid List
  return (
    <div className="grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {followers.map((f) => (
        <div
          key={f.userId}
          className="group flex items-center justify-between p-4 rounded-xl
                     bg-slate-900/40 border border-slate-800
                     hover:border-slate-600 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex items-center gap-3 overflow-hidden">
             {/* Avatar */}
             <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center">
                {f.avatar?.url ? (
                    <img
                        src={f.avatar.url}
                        alt={f.fullName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <span className="text-lg font-bold text-slate-500">{f.fullName?.[0]?.toUpperCase()}</span>
                )}
             </div>

             {/* Info */}
             <div className="min-w-0">
                <h4 className="text-white font-semibold truncate text-sm group-hover:text-blue-400 transition-colors">
                    {f.fullName}
                </h4>
                <p className="text-xs text-slate-400 truncate">@{f.username}</p>
             </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => viewClickhandler(f.username)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
            title="View Profile"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export { FollowersTab };