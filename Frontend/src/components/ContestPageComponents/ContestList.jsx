import ContestRow from "./ContestRow";
import { Loader2, Ghost } from "lucide-react";

function ContestList({ contests, loading, hasMore, onLoadMore }) {
  
  const handleScroll = (e) => {
    const el = e.target;
    // Load more when user is 50px away from bottom
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
        // Prevent calling if already loading or no more data
        if (!loading && hasMore) {
            onLoadMore();
        }
    }
  };

  return (
    <div
      className="
        w-full
        bg-slate-900/40 backdrop-blur-md 
        border border-slate-700/50 rounded-2xl 
        overflow-hidden flex flex-col
        shadow-xl shadow-black/20
      "
      style={{ height: 'calc(100vh - 180px)' }} // Responsive height based on header
    >
      {/* Scrollable Area */}
      <div 
        className="flex-1 overflow-y-auto divide-y divide-slate-800 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        onScroll={handleScroll}
      >
        {contests.map((c) => (
          <ContestRow key={c._id} contest={c} />
        ))}

        {/* Loading Skeletons */}
        {loading && (
          <div className="p-4 space-y-4">
             {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-4 animate-pulse">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-800 rounded w-1/4"></div>
                    </div>
                </div>
             ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && contests.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 min-h-[400px]">
              <div className="p-4 bg-slate-800/50 rounded-full">
                <Ghost size={40} />
              </div>
              <p className="text-lg">No contests found here.</p>
          </div>
        )}
        
        {/* End of List Indicator */}
        {!hasMore && contests.length > 0 && (
            <div className="p-6 text-center text-slate-600 text-xs uppercase tracking-widest font-bold">
                End of List
            </div>
        )}
      </div>
    </div>
  );
}

export default ContestList;