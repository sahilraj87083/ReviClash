import {Button , Input} from '../'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

function CreateCollectionModal({ onClose }) {
  const modalRef = useRef(null);

  useGSAP(() => {
    gsap.from(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 space-y-5"
      >
        <h2 className="text-xl font-semibold text-white">
          Create Collection
        </h2>

        <Input
          label="Collection Name"
          placeholder="e.g. DSA Core"
        />

        <Input
          label="Description"
          placeholder="Optional description"
        />

        <div className="flex items-center gap-2">
          <input type="checkbox" id="public" />
          <label htmlFor="public" className="text-sm text-slate-300">
            Make this collection public
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary">
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateCollectionModal