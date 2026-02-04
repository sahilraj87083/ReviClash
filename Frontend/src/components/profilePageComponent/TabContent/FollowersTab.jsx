import { useEffect, useState } from "react";
import { getFollowersService } from "../../../services/follow.services.js";
import { useUserContext } from "../../../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";

function FollowersTab( { userId }) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const navigate = useNavigate()

  const viewClickhandler = (username) => {
    if(!username) return ;

    navigate(`/user/profile/${username}`)
  }

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

  if (loading) {
    return (
      <div className="text-slate-400 text-sm">
        Loading followers...
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="text-slate-400 text-sm text-center py-10">
        No followers yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followers.map((f) => (
        <div
          key={f.userId}
          className="flex items-center gap-4 p-4 rounded-lg
                     bg-slate-900/60 border border-slate-700/50
                     hover:bg-slate-800/60 transition"
        >
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700
                          flex items-center justify-center text-white font-semibold">
            {f.avatar?.url ? (
              <img
                src={f.avatar.url}
                alt={f.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              f.fullName?.[0]?.toUpperCase()
            )}
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">
              {f.fullName}
            </p>
            <p className="text-xs text-slate-400 truncate">
              @{f.username}
            </p>
          </div>

          {/* Action (future ready) */}
          <button
            className="text-xs px-3 py-1 rounded-md
                       bg-slate-800 hover:bg-slate-700
                       text-slate-300 transition"
            onClick={() => {
              viewClickhandler(f.username)
            }}
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
}

export { FollowersTab };
