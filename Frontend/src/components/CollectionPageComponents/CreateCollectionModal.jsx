import { Button, Input } from '../';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';
import { FolderPlus, X } from 'lucide-react';

function CreateCollectionModal({ onClose, onCreate }) {
  const modalRef = useRef(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return; 
    onCreate({ name, description, isPublic });
    setName("");
    setDescription("");
    setIsPublic(false);
    onClose();
  };

  useGSAP(() => {
    gsap.from(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950/30">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <FolderPlus size={20} />
                </div>
                <h2 className="text-lg font-bold text-white">New Collection</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dynamic Programming Hard"
                    className="bg-slate-950 border-slate-700 focus:border-blue-500"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description..."
                    className="bg-slate-950 border-slate-700 focus:border-blue-500"
                />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-800">
                <input 
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    type="checkbox" 
                    id="public" 
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="public" className="text-sm text-slate-300 cursor-pointer select-none">
                    Make this collection public (Visible to everyone)
                </label>
            </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-slate-800 bg-slate-950/30">
          <Button variant="ghost" onClick={onClose} className="text-slate-300 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="primary" disabled={!name.trim()}>
            Create Collection
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateCollectionModal;