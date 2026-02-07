import { useEffect, useState } from "react";
import { Button, Select } from "../";
import { getMyCollections } from "../../services/collection.service";
import { X, FolderPlus, Layers } from "lucide-react";

function AddToCollectionModal({ open, onClose, onConfirm }) {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");

  useEffect(() => {
    if (!open) return;

    (async () => {
      const res = await getMyCollections();
      setCollections(
        res.map((c) => ({
          label: c.name,
          value: c._id,
        }))
      );
    })();
  }, [open]);

  if (!open) return null;

  const handleAddQuestionToCollection = async () => {
      await onConfirm(selectedCollection);
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <FolderPlus size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-white">Add to Collection</h2>
                <p className="text-xs text-slate-400">Save selected questions</p>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
               <Layers size={14} /> Target Collection
            </div>
            <Select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              options={collections}
              placeholder="Choose a collection..."
              // className="w-full"
            />
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
             <p className="text-sm text-slate-400 leading-relaxed">
                <span className="text-white font-medium">Tip:</span> Grouping questions helps you practice specific topics more effectively.
             </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-slate-800/50 bg-slate-950/30">
          <Button variant="ghost" onClick={onClose} className="text-slate-300 hover:text-white">
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!selectedCollection}
            onClick={handleAddQuestionToCollection}
            className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20"
          >
            Add to Collection
          </Button>
        </div>

      </div>
    </div>
  );
}

export default AddToCollectionModal;