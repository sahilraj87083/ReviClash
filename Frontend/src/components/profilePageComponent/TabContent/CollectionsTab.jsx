import { CollectionCard } from '../../index';
import { Layers, FolderOpen } from "lucide-react";

function CollectionsTab({ collections }) {
  
  // 1. Loading/Empty State
  if (!collections || collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed animate-in fade-in zoom-in-95 duration-500">
        <div className="p-4 bg-slate-800/50 rounded-full mb-3 text-slate-600">
            <FolderOpen size={32} strokeWidth={1.5} />
        </div>
        <p className="text-base font-medium text-slate-400">No collections found</p>
        <p className="text-xs text-slate-500 mt-1">This user hasn't created any public collections yet.</p>
      </div>
    );
  }

  // 2. Grid Content
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {collections.map((c) => (
        <CollectionCard 
            key={c._id} 
            collection={c} 
            mode="public" 
        />
      ))}
    </div>
  );
}

export { CollectionsTab };