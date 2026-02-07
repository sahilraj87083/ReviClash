function StatCard({ title, value, icon: Icon, color, bg }) {
    return (
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition duration-300">
            <div className="flex items-start justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">{title}</span>
                <div className={`p-2 rounded-lg ${bg} ${color}`}>
                    <Icon size={18} />
                </div>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    )
}

export default StatCard