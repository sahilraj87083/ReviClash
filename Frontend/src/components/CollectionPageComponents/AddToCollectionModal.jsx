import { useEffect, useState } from "react";
import { Button, Select } from "../";
import { getMyCollections } from "../../services/collection.service";

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
      await onConfirm(selectedCollection)
      onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 space-y-5">

        <h2 className="text-xl font-semibold text-white">
          Add to Collection
        </h2>

        <Select
          label="Select Collection"
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
          options={collections}
          placeholder="Choose collection"
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!selectedCollection}
            onClick={handleAddQuestionToCollection}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddToCollectionModal;
