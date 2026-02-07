function Tab({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-medium transition-all whitespace-nowrap outline-none
        ${
          active
            ? "text-white border-b-2 border-red-500 bg-gradient-to-t from-red-500/5 to-transparent"
            : "text-slate-400 hover:text-white border-b-2 border-transparent hover:border-slate-700 hover:bg-slate-800/30"
        }
      `}
    >
      <span>{label}</span>
      
      {/* Badge for Counts (Optional) */}
      {count !== undefined && (
        <span 
            className={`
                text-[10px] px-1.5 py-0.5 rounded-full transition-colors
                ${active 
                    ? "bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]" 
                    : "bg-slate-800 text-slate-500 group-hover:text-white group-hover:bg-slate-700"
                }
            `}
        >
            {count}
        </span>
      )}
    </button>
  );
}

export { Tab };