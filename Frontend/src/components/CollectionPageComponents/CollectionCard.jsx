import { useNavigate } from "react-router-dom";
import { Folder, Trophy, Trash2, ArrowRight, Lock, Globe } from "lucide-react";

function CollectionCard({ collection, onCreateContest, mode = 'owner', onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 flex flex-col h-full relative overflow-hidden">
      
      {/* Top Decor */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-800 rounded-lg text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
            <Folder size={24} />
        </div>
        <div className="flex items-center gap-2">
             {collection.isPublic ? (
                 <span className="text-xs text-slate-500 flex items-center gap-1"><Globe size={12} /> Public</span>
             ) : (
                 <span className="text-xs text-slate-500 flex items-center gap-1"><Lock size={12} /> Private</span>
             )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-6 flex-1">
        <h3 className="text-lg font-bold text-white mb-1 truncate">{collection.name}</h3>
        <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">
            {collection.description || "No description provided."}
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase tracking-wider mb-6 bg-slate-950/50 p-2 rounded-lg">
         <span>Questions</span>
         <span className="text-white text-sm">{collection.questionsCount || 0}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <button 
            onClick={() =>  mode === 'owner' ?  navigate(`/user/collections/${collection._id}/questions`) : navigate(`/collections/${collection._id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white transition-colors"
        >
            View <ArrowRight size={14} />
        </button>
        {
          mode === 'owner' && (
            <button 
                onClick={() => onCreateContest(collection)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-500 hover:text-yellow-400 transition-colors"
                title="Create Contest"
            >
                <Trophy size={18} />
            </button>
          )
        }
        {
          mode === 'owner' && (
            <button 
                onClick={() => onDelete(collection._id)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors"
                title="Delete Collection"
            >
                <Trash2 size={18} />
            </button>
          )
        }
        
      </div>
    </div>
  );
}

export default CollectionCard;