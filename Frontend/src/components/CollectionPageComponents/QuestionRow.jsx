import { ExternalLink, Trash2 } from "lucide-react";

function QuestionRow({ q, isSelected, onSelect, removeQuestion, mode = 'owner' }) {
  
  // Difficulty Badge Logic
  const getDifficultyStyle = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "hard": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-slate-700 text-slate-400";
    }
  };

  return (
    <div className={`
        group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_4fr_2fr_1fr] gap-4 items-center px-6 py-4 
        hover:bg-slate-800/40 transition-colors cursor-pointer
        ${isSelected ? "bg-red-500/5" : ""}
    `}>
        
        {/* CHECKBOX */}
        <div className="w-6 flex items-center" onClick={(e) => e.stopPropagation()}>
            <input 
                type="checkbox" 
                checked={isSelected}
                onChange={onSelect}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-red-600 focus:ring-red-500 focus:ring-offset-slate-900 cursor-pointer"
            />
        </div>

        {/* TITLE & META */}
        <div className="min-w-0 pr-4">
            <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {q.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getDifficultyStyle(q.difficulty)}`}>
                    {q.difficulty}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                    {q.platform}
                </span>
            </div>
        </div>

        {/* TOPICS (Hidden on mobile) */}
        <div className="hidden md:flex flex-wrap gap-1.5">
            {q.topics?.slice(0, 3).map((t) => (
                <span key={t} className="px-2 py-0.5 rounded bg-slate-800/50 text-slate-400 text-xs border border-slate-700/50 whitespace-nowrap">
                    {t}
                </span>
            ))}
            {q.topics?.length > 3 && (
                <span className="text-xs text-slate-500 px-1">+{q.topics.length - 3}</span>
            )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <a
                href={q.problemUrlOriginal}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                title="Solve Problem"
                onClick={(e) => e.stopPropagation()}
            >
                <ExternalLink size={16} />
            </a>

            {mode === 'owner' && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        removeQuestion();
                    }}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 transition-all"
                    title="Delete"
                >
                    <Trash2 size={16} />
                </button>
            )}
        </div>

    </div>
  );
}

export default QuestionRow;