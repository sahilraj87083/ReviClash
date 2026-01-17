import { useState } from "react";

function AddQuestionPanel({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    platform: "LeetCode",
    problemUrl: "",
    difficulty: "easy",
    topics: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      topics: form.topics
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    });
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
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          />

          <input
            name="problemUrl"
            placeholder="Problem URL"
            value={form.problemUrl}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          />

          <select
            name="platform"
            value={form.platform}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          >
            <option>LeetCode</option>
            <option>GFG</option>
            <option>Codeforces</option>
            <option>Other</option>
          </select>

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            name="topics"
            placeholder="Topics (comma separated)"
            value={form.topics}
            onChange={handleChange}
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
