import { useState } from "react";

function CreateContestModal({ open, onClose, collection, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    questionCount: 5,
    durationInMin: 60,
    visibility: "private",
  });

  if (!open || !collection) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      collectionId: collection._id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Create Contest
          </h2>
          <p className="text-slate-400 text-sm">
            From collection: <span className="text-white">{collection.name}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            placeholder="Contest title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="questionCount"
              min={1}
              max={collection.questionsCount}
              value={form.questionCount}
              onChange={handleChange}
              className="p-3 rounded bg-slate-800 border border-slate-700"
              placeholder="Questions"
            />

            <input
              type="number"
              name="durationInMin"
              min={10}
              value={form.durationInMin}
              onChange={handleChange}
              className="p-3 rounded bg-slate-800 border border-slate-700"
              placeholder="Duration (min)"
            />
          </div>

          <select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          >
            <option value="private">Private</option>
            <option value="shared">Shared</option>
            <option value="public">Public</option>
          </select>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-md font-semibold"
            >
              Create Contest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateContestModal;
