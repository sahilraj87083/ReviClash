function RecentRow({ data, onClick }) {
    return (
        <div 
            onClick={onClick}
            className="p-4 hover:bg-slate-800/50 transition cursor-pointer flex items-center justify-between group"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:text-white group-hover:bg-slate-700 transition">
                    {data.contest.title.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-white group-hover:text-blue-400 transition">{data.contest.title}</p>
                    <p className="text-xs text-slate-400">
                        {data.solvedCount} / {data.solvedCount + data.unsolvedCount} Solved
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-white">{Math.round(data.score)}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Score</p>
            </div>
        </div>
    )
}


export default RecentRow