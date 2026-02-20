import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Image as ImageIcon, Globe, Loader2 } from "lucide-react";

// Responsive Dropzone adapted for post creation
function PostImageDropzone({ onSelect, preview, onClear }) {
    const onDrop = useCallback((files) => {
        if (!files.length) return;
        const file = files[0];
        if (!file.type.startsWith("image/")) return;
        onSelect(file);
    }, [onSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1
    });

    if (preview) {
        return (
            <div className="relative w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group">
                <img src={preview} alt="Preview" className="w-full max-h-[400px] object-contain" />
                <button 
                    onClick={(e) => { e.stopPropagation(); onClear(); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`w-full min-h-[120px] sm:min-h-[200px] flex flex-col justify-center items-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                ${isDragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"}
            `}
        >
            <input {...getInputProps()} />
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                <ImageIcon size={24} className={isDragActive ? "text-blue-400" : "text-slate-400"} />
            </div>
            <p className="text-sm font-medium text-slate-300">
                {isDragActive ? "Drop it here!" : "Drag & drop an image, or click to browse"}
            </p>
            <p className="text-xs text-slate-500 mt-2">Supports JPG, PNG, GIF</p>
        </div>
    );
}

export default  PostImageDropzone