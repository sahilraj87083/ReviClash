function RecentRow({ title, score, solved, total, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex justify-between items-center px-6 py-4 hover:bg-slate-800 transition"
    >
      <div >
        <p className="font-medium text-white">{title}</p>
        <p className="text-s font-medium text-slate-400">
          Solved {solved}/{total}
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-white">{score}</p>
        <p className="text-xs text-slate-400">Score</p>
      </div>
    </div>
  );
}


export default RecentRow