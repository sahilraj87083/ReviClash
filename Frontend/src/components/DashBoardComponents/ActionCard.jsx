function ActionCard({ title, desc, icon: Icon, onClick, highlight }) {
    return (
        <div 
            onClick={onClick}
            className={`
                group cursor-pointer p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
                ${highlight 
                    ? "bg-gradient-to-br from-red-600 to-orange-600 border-transparent" 
                    : "bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800"
                }
            `}
        >
            <div className="relative z-10">
                <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110
                    ${highlight ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white"}
                `}>
                    <Icon size={20} />
                </div>
                <h3 className={`font-bold text-lg mb-1 ${highlight ? "text-white" : "text-white"}`}>
                    {title}
                </h3>
                <p className={`text-sm ${highlight ? "text-white/80" : "text-slate-400"}`}>
                    {desc}
                </p>
            </div>
        </div>
    )
}



export default ActionCard