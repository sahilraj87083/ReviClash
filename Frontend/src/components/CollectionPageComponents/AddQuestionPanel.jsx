import { useState } from "react";
import { X, Link as LinkIcon, Hash, Layers, BarChart2, Type } from "lucide-react";

function AddQuestionPanel({ open, onClose, onSubmit }) {

  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState("LeetCode")
  const [problemUrl, setProblemUrl] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [topics, setTopics] = useState('')

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title : title,
      platform : platform,
      problemUrl : problemUrl,
      difficulty : difficulty,
      topics : topics.split(',').map((t) => t.trim().toLowerCase())
    }
    await onSubmit(data)
  };

  // Helper for input styles
  const inputClasses = "w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all";
  const labelClasses = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950/30">
          <div>
             <h2 className="text-xl font-bold text-white">Add New Question</h2>
             <p className="text-xs text-slate-400 mt-0.5">Fill in the details below</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Title */}
          <div>
            <label className={labelClasses}>
                <Type size={14} /> Question Title
            </label>
            <input
                name="title"
                placeholder="e.g. Longest Substring Without Repeating Characters"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={inputClasses}
            />
          </div>

          {/* URL */}
          <div>
            <label className={labelClasses}>
                <LinkIcon size={14} /> Problem URL
            </label>
            <input
                name="problemUrl"
                placeholder="https://leetcode.com/problems/..."
                value={problemUrl}
                onChange={(e) => setProblemUrl(e.target.value)}
                required
                className={inputClasses}
            />
          </div>

          {/* Platform & Difficulty Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
                <label className={labelClasses}>
                    <Layers size={14} /> Platform
                </label>
                <div className="relative">
                    <select
                        name="platform"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                        <option>LeetCode</option>
                        <option>GFG</option>
                        <option>Codeforces</option>
                        <option>Other</option>
                    </select>
                    {/* Custom Arrow Pointer */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
            </div>

            <div>
                <label className={labelClasses}>
                    <BarChart2 size={14} /> Difficulty
                </label>
                <div className="relative">
                    <select
                        name="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
            </div>
          </div>

          {/* Topics */}
          <div>
            <label className={labelClasses}>
                <Hash size={14} /> Topics
            </label>
            <input
                name="topics"
                placeholder="dp, array, string (comma separated)"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                className={inputClasses}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 transition-all transform active:scale-95"
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddQuestionPanel;