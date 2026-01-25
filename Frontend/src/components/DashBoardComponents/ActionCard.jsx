function ActionCard({ title, desc, action, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-slate-900/60 border border-slate-700/50 rounded-xl p-6
                 hover:border-red-500 hover:-translate-y-1 hover:shadow-xl transition-all
                 flex flex-col"
    >
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-slate-400 text-sm mt-2">{desc}</p>
      </div>

      <p className="text-red-500 mt-auto pt-4 font-medium">
        {action} →
      </p>
    </div>
  );
}



export default ActionCard