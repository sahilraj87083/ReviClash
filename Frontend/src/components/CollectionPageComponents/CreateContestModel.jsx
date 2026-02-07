import { useState } from "react";
import { Button, Input, Select } from "../";
import { Trophy, AlertCircle, X } from "lucide-react";

function CreateContestModal({ open, onClose, collection, onSubmit }) {
  const [loading, setLoading] = useState(false);

  // Safe defaults
  const [form, setForm] = useState({
    title: "",
    questionCount: collection?.questionsCount > 0 ? Math.min(5, collection.questionsCount) : 0,
    durationInMin: 60,
    visibility: "private",
  });

  if (!open || !collection) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      title: form.title,
      questionCount: Number(form.questionCount),      
      durationInMin: Number(form.durationInMin),      
      visibility: form.visibility,
      collectionId: collection._id,
    });
    setLoading(false);
  };

  const isEmpty = collection.questionsCount === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* HEADER */}
        <div className="flex justify-between items-start p-6 border-b border-slate-800 bg-slate-950/30">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Trophy size={20} className="text-yellow-500" /> Create Contest
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                    Using questions from <span className="text-white font-medium">{collection.name}</span>
                </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {isEmpty && (
             <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>This collection has 0 questions. Please add questions before creating a contest.</p>
             </div>
          )}

          <div className="space-y-1.5">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contest Title</label>
             <Input
                name="title"
                placeholder="e.g. Friday Night Battle"
                value={form.title}
                onChange={handleChange}
                required
                disabled={isEmpty}
                className="bg-slate-950 border-slate-700"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Questions</label>
                <Input
                    type="number"
                    name="questionCount"
                    min={1}
                    max={collection.questionsCount}
                    value={form.questionCount}
                    onChange={handleChange}
                    disabled={isEmpty}
                    className="bg-slate-950 border-slate-700"
                />
                <p className="text-[10px] text-slate-500 text-right">Max: {collection.questionsCount}</p>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</label>
                <Select
                    name="durationInMin"
                    value={form.durationInMin}
                    onChange={handleChange}
                    disabled={isEmpty}
                    options={[
                        { label: "30 min", value: 30 },
                        { label: "60 min", value: 60 },
                        { label: "90 min", value: 90 },
                        { label: "120 min", value: 120 },
                    ]}
                />
            </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visibility</label>
             <Select
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
                disabled={isEmpty}
                options={[
                    { label: "Private (Invite only)", value: "private" },
                    { label: "Shared (With code)", value: "shared" },
                    { label: "Public (Discoverable)", value: "public" },
                ]}
             />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <Button variant="ghost" onClick={onClose} disabled={loading} className="text-slate-300">
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={isEmpty}
              className={`shadow-lg shadow-blue-900/20 ${isEmpty ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : ''}`}
            >
              Launch Contest
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateContestModal;