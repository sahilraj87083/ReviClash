import { useState } from "react";
import ImageDropzone from "../Others/ImageDropzone";
import { useImageUpload } from "../../hooks/useImageUpload";
// import {
//     updateAvatarService,
//     updateCoverService,
// } from "../../services/user.services";
import toast from "react-hot-toast";

function ImageUploadModal({ open, onClose, onSuccess, type }) {
    const { preview, loading, selectFile, clearFile, upload } = useImageUpload(type, onSuccess);

    if (!open) return null;


    const handleUpload = async () => {
        await upload();
        onClose()
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-900 p-6 w-full max-w-[70vw]  rounded-xl  space-y-4">
                <h2 className="text-lg font-bold capitalize">
                Update {type === "avatar" ? "Avatar" : "Cover"}
                </h2>

                <ImageDropzone onSelect={selectFile} preview={preview} onClear={clearFile} />

                <div className="flex justify-end gap-3">
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    Cancel
                </button>

                <button
                    disabled={loading}
                    onClick={handleUpload}
                    className="bg-red-600 px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Uploading..." : "Save"}
                </button>
                </div>
            </div>
        </div>
    );
}

export default ImageUploadModal;
