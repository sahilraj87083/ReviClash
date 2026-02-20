import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Image as ImageIcon, Globe, Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";

// Maximum limits
const MAX_FILES = 3;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

function PostMediaArea({ files, previews, onAddFiles, onRemoveFile }) {
    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        // Handle Validation Errors (Size, Type)
        if (fileRejections.length > 0) {
            const errorMessages = fileRejections.map(rejection => {
                const errors = rejection.errors.map(e => {
                    if (e.code === 'file-too-large') return 'Larger than 2MB';
                    if (e.code === 'file-invalid-type') return 'Not an image';
                    return e.message;
                }).join(', ');
                return `${rejection.file.name}: ${errors}`;
            });
            toast.error(`Some files were rejected:\n${errorMessages.join('\n')}`);
        }

        // Handle Max Files Error
        const remainingSlots = MAX_FILES - files.length;
        if (remainingSlots <= 0 && acceptedFiles.length > 0) {
            alert(`You can only upload a maximum of ${MAX_FILES} images.`);
            return;
        }

        // Add valid files
        const filesToAdd = acceptedFiles.slice(0, remainingSlots);
        if (filesToAdd.length > 0) {
            onAddFiles(filesToAdd);
        }
    }, [files.length, onAddFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] }, // Only accept images
        maxSize: MAX_FILE_SIZE,    // 2 MB limit
    });

    // 1. Empty State - No Images Selected
    if (previews.length === 0) {
        return (
            <div
                {...getRootProps()}
                className={`w-full min-h-[120px] sm:min-h-[200px] flex flex-col justify-center items-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
                    ${isDragActive ? "border-blue-500 bg-blue-500/10 scale-[0.98]" : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"}
                `}
            >
                <input {...getInputProps()} />
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isDragActive ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-400"}`}>
                    <ImageIcon size={24} />
                </div>
                <p className="text-sm font-medium text-slate-300">
                    {isDragActive ? "Drop images here!" : "Drag & drop images, or click to browse"}
                </p>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                    Max {MAX_FILES} images, up to 2MB each
                </p>
            </div>
        );
    }

    // 2. Filled State - Showing Selected Images
    return (
        <div className="space-y-3">
            <div className={`grid gap-2 ${previews.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {previews.map((preview, index) => (
                    <div 
                        key={index} 
                        className={`relative w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group ${previews.length === 3 && index === 0 ? 'col-span-2 aspect-video sm:h-48' : 'aspect-square sm:aspect-video sm:h-40'}`}
                    >
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRemoveFile(index); }}
                            className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg"
                            title="Remove image"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            
            {/* Add More Button if slots are available */}
            {previews.length < MAX_FILES && (
                <div
                    {...getRootProps()}
                    className="w-full py-3 flex justify-center items-center border border-dashed border-slate-600 hover:border-blue-500 bg-slate-800/30 hover:bg-blue-500/10 rounded-xl cursor-pointer transition-all duration-200"
                >
                    <input {...getInputProps()} />
                    <span className="text-sm text-slate-400 font-medium flex items-center gap-2">
                        <Plus size={16} /> Add more images ({MAX_FILES - previews.length} remaining)
                    </span>
                </div>
            )}
        </div>
    );
}

export function CreatePostModal({ open, onClose, user }) {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);         // Array to hold actual files
    const [previews, setPreviews] = useState([]);   // Array to hold Object URLs
    const [isPosting, setIsPosting] = useState(false);
    const [showDropzone, setShowDropzone] = useState(false);

    // Cleanup object URLs when component unmounts or modal closes to prevent memory leaks
    useEffect(() => {
        if (!open) {
            previews.forEach(url => URL.revokeObjectURL(url));
            setFiles([]);
            setPreviews([]);
            setContent("");
            setShowDropzone(false);
        }
    }, [open]);

    if (!open) return null;

    const handleAddFiles = (newFiles) => {
        setFiles(prev => [...prev, ...newFiles]);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
        setShowDropzone(true);
    };

    const handleRemoveFile = (indexToRemove) => {
        URL.revokeObjectURL(previews[indexToRemove]); // Free memory
        
        const newFiles = files.filter((_, i) => i !== indexToRemove);
        const newPreviews = previews.filter((_, i) => i !== indexToRemove);
        
        setFiles(newFiles);
        setPreviews(newPreviews);

        if (newFiles.length === 0 && !content.trim()) {
            setShowDropzone(false);
        }
    };

    const handlePost = async () => {
        if (!content.trim() && files.length === 0) return;
        setIsPosting(true);
        
        try {
            // NOTE: Update this part to append to FormData since you are uploading multiple files
            // const formData = new FormData();
            // formData.append("content", content);
            // files.forEach(file => formData.append("images", file));
            // await createPostService(formData);

            console.log("Posting Text:", content);
            console.log("Posting Files:", files);
            
            await new Promise(res => setTimeout(res, 1000)); // Mock network delay
            onClose(); // Cleanup handled by useEffect
        } catch (error) {
            console.error("Failed to post:", error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 sm:fade-in duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800/80 shrink-0">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Create Post
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto no-scrollbar flex-1 space-y-4">
                    <div className="flex gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0 overflow-hidden border border-slate-700">
                            {user?.avatar?.url ? (
                                <img src={user.avatar.url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                    {user?.fullName?.[0] || 'U'}
                                </div>
                            )}
                        </div>
                        
                        {/* Text Area */}
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-white mb-1">{user?.fullName || 'User'}</h3>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What do you want to talk about?"
                                className="w-full bg-transparent text-white placeholder:text-slate-500 text-lg sm:text-xl resize-none outline-none min-h-[100px] sm:min-h-[150px]"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Media Dropzone (Conditional) */}
                    {showDropzone && (
                        <div className="pl-0 sm:pl-13 animate-in fade-in slide-in-from-top-2 duration-300">
                             <PostMediaArea 
                                files={files} 
                                previews={previews} 
                                onAddFiles={handleAddFiles} 
                                onRemoveFile={handleRemoveFile} 
                             />
                        </div>
                    )}
                </div>

                {/* Footer Tools & Action */}
                <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/50 rounded-b-2xl shrink-0">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowDropzone(true)}
                            disabled={files.length >= MAX_FILES}
                            className="p-2.5 text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors tooltip-trigger disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Add Images"
                        >
                            <ImageIcon size={22} />
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-800 text-slate-400 text-sm font-medium transition-colors ml-2">
                            <Globe size={16} /> Anyone
                        </button>
                    </div>

                    <button
                        onClick={handlePost}
                        disabled={isPosting || (!content.trim() && files.length === 0)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isPosting ? <Loader2 size={18} className="animate-spin" /> : null}
                        {isPosting ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}