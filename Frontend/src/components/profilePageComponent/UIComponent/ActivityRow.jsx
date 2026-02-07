import { Trophy, Calendar, CheckCircle2, Clock } from "lucide-react";

function ActivityRow({ data }) {
  const { contest, score, solvedCount, unsolvedCount, finishedAt } = data;
  const totalQuestions = solvedCount + unsolvedCount;
  const isFullSolve = solvedCount === totalQuestions && totalQuestions > 0;
  
  // Format Date: "Feb 07, 2026"
  const dateStr = new Date(finishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-xl transition-all hover:bg-slate-800/30">
      
      <div className="flex items-center gap-4">
        {/* Icon based on performance */}
        <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center border
            ${score > 0 
                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' 
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }
        `}>
           <Trophy size={20} strokeWidth={score > 0 ? 2 : 1.5} />
        </div>

        <div>
          <h4 className="text-white font-semibold text-base group-hover:text-blue-400 transition-colors">
            {contest.title}
          </h4>
          
          <div className="flex items-center gap-3 mt-1.5">
            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar size={12} />
                <span>{dateStr}</span>
            </div>

            {/* Solved Count */}
            <div className={`flex items-center gap-1.5 text-xs font-medium ${isFullSolve ? 'text-green-400' : 'text-slate-400'}`}>
                <CheckCircle2 size={12} />
                <span>Solved {solvedCount}/{totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Section */}
      <div className="text-right pl-4 border-l border-slate-800">
        <div className="text-lg font-bold text-white tabular-nums tracking-tight">
            {Number(score).toFixed(1)}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            Score
        </div>
      </div>

    </div>
  );
}

export { ActivityRow };