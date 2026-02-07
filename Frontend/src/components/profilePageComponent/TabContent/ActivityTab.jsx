import { ActivityRow } from "../";
import { useState, useEffect } from "react";
import { getUserRecentActivity } from "../../../services/profile.services";
import { BarChart2, Ghost } from "lucide-react";

function ActivityTab({ userId }) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const data = await getUserRecentActivity(userId);
        setActivity(data);
      } catch (error) {
        console.error("Failed to fetch activity", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-900/50 border border-slate-800 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!activity.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
        <div className="p-4 bg-slate-800 rounded-full mb-3 opacity-50">
            <BarChart2 size={32} />
        </div>
        <p className="text-sm font-medium">No recent activity found</p>
        <p className="text-xs text-slate-600 mt-1">Participate in contests to see stats here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {activity.map((a) => (
        // Passing the full object 'a' to allow the Row component to handle logic
        <ActivityRow key={a.contestId} data={a} />
      ))}
    </div>
  );
}

export { ActivityTab };