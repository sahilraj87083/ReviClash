import { FileQuestion, Plus } from "lucide-react";

function EmptyQuestionsState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-16 text-center">
      
      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <FileQuestion size={40} className="text-slate-500" />
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">
        Your question bank is empty
      </h3>
      
      <p className="text-slate-400 max-w-sm mx-auto mb-8">
        Start building your personal repository of coding problems. Track progress and organize them into collections.
      </p>

      <button
        onClick={onAdd}
        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold shadow-lg shadow-red-900/20 transition-all hover:-translate-y-1 flex items-center gap-2"
      >
        <Plus size={20} /> Add Your First Question
      </button>
    </div>
  );
}

export default EmptyQuestionsState;