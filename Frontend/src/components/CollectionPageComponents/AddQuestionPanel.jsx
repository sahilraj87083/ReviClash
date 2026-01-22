import { useState } from "react";
import { uploadQuestionService } from "../../services/question.services";
import { addQuestionToCollection } from "../../services/collection.service";
import { useParams } from "react-router-dom";

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
    

    // console.log(data)
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Question</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            placeholder="Question title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          />

          <input
            name="problemUrl"
            placeholder="Problem URL"
            value={problemUrl}
            onChange={(e) => setProblemUrl(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          />

          <select
            name="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          >
            <option>LeetCode</option>
            <option>GFG</option>
            <option>Codeforces</option>
            <option>Other</option>
          </select>

          <select
            name="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            name="topics"
            placeholder="Topics (comma separated)"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-md font-semibold"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddQuestionPanel;
