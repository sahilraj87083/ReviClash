import { useEffect, useState, useRef } from "react";
import { Heart, Reply, MoreHorizontal, Trash2, Loader2 } from "lucide-react";


const CommentNode = ({ comment, isReply = false, parentId = null, user, handleLike, handleDelete, handleToggleReplies, setReplyingTo, expandedReplies, loadingReplies, replies }) => {
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);

    const avatarUrl = comment?.userId?.avatar?.url || `https://ui-avatars.com/api/?name=${comment?.userId?.fullName || 'U'}&background=0D8ABC&color=fff`;
    const isOwner = user?._id === comment?.userId?._id;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`flex gap-3 ${isReply ? 'mt-4' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0 overflow-hidden">
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-sm text-white truncate">{comment?.userId?.username}</span>
                        <span className="text-xs text-slate-500 shrink-0">
                            {comment?.createdAt ? new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Just now'}
                        </span>
                    </div>
                </div>
                
                <p className="text-sm text-slate-300 mt-0.5 whitespace-pre-wrap break-words">{comment?.content}</p>
                
                <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500 relative">
                    <button onClick={() => handleLike(comment._id, parentId)} className={`flex items-center gap-1 hover:text-red-500 transition-colors ${comment.isLiked ? 'text-red-500' : ''}`}>
                        <Heart size={14} className={comment?.isLiked ? 'fill-red-500' : ''} /> {comment?.likeCount > 0 && comment.likeCount}
                    </button>
                    {!isReply && (
                        <button onClick={() => setReplyingTo(comment)} className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                            <Reply size={14} /> Reply
                        </button>
                    )}
                    
                    {isOwner && (
                        <div className="relative" ref={optionsRef}>
                            <button 
                                onClick={() => setShowOptions(!showOptions)} 
                                className="hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-800"
                            >
                                <MoreHorizontal size={14} />
                            </button>
                            
                            {showOptions && (
                                <div className="absolute left-0 top-full mt-1 w-auto bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <button 
                                        onClick={() => {
                                            setShowOptions(false);
                                            handleDelete(comment._id, parentId);
                                        }} 
                                        className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {!isReply && comment?.replyCount > 0 && (
                    <div className="mt-2">
                        <button onClick={() => handleToggleReplies(comment._id)} className="text-xs text-blue-400 font-medium flex items-center gap-2 hover:text-blue-300 transition-colors">
                            <div className="w-6 h-[1px] bg-slate-700"></div>
                            {expandedReplies[comment._id] ? 'Hide replies' : `View ${comment.replyCount} replies`}
                        </button>
                        
                        {expandedReplies[comment._id] && (
                            <div className="pl-2 mt-2 border-l-2 border-slate-800">
                                {loadingReplies[comment._id] ? (
                                    <div className="flex items-center gap-2 text-slate-500 p-2">
                                        <Loader2 size={14} className="animate-spin" />
                                        <span className="text-xs">Loading replies...</span>
                                    </div>
                                ) : (
                                    replies[comment._id]?.map(reply => (
                                        <CommentNode 
                                            key={reply._id} 
                                            comment={reply} 
                                            isReply={true} 
                                            parentId={comment._id} 
                                            user={user}
                                            handleLike={handleLike}
                                            handleDelete={handleDelete}
                                            handleToggleReplies={handleToggleReplies}
                                            setReplyingTo={setReplyingTo}
                                            expandedReplies={expandedReplies}
                                            loadingReplies={loadingReplies}
                                            replies={replies}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentNode