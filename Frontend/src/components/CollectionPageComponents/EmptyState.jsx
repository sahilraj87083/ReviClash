import { Button } from '../';
import { FolderOpen, Plus } from 'lucide-react';

function EmptyState({ onCreate }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-16 text-center flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
         <FolderOpen size={40} className="text-slate-500" />
      </div>
      
      <h3 className="text-2xl font-bold text-white">
        No collections found
      </h3>
      <p className="text-slate-400 mt-2 max-w-sm mx-auto mb-8">
        Collections allow you to group problems by topic, difficulty, or contest preparation.
      </p>
      
      <Button
        variant="secondary"
        onClick={onCreate}
        className="px-6 py-3 rounded-full shadow-lg shadow-blue-900/20"
      >
        <Plus size={18} className="mr-2" /> Create First Collection
      </Button>
    </div>
  );
}

export default EmptyState;