import { useEffect, useState, useRef } from "react";
import { Send, X, Loader2 } from "lucide-react";
import { 
    getCommentsService, 
    addCommentService, 
    deleteCommentService 
} from "../../services/comment.services.js";
import { toggleCommentLikeService } from "../../services/like.services.js";
import { useUserContext } from "../../contexts/UserContext";
import CommentNode from "./CommentNode.jsx";

const CommentSection = ({ postId, onClose }) => {
  const { user } = useUserContext();
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({}); 
  const [expandedReplies, setExpandedReplies] = useState({}); 
  const [loadingReplies, setLoadingReplies] = useState({});

  useEffect(() => {
    (async () => {
        try {
            const res = await getCommentsService({ postId });
            setComments(res.comments);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    })();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
        const data = { content: commentText };
        if (replyingTo) {
            data.parentId = replyingTo._id;
        }

        const newComment = await addCommentService(postId, data);

        if (replyingTo) {
            setReplies(prev => ({
                ...prev,
                [replyingTo._id]: [newComment, ...(prev[replyingTo._id] || [])]
            }));
            setComments(prev => prev.map(c => 
                c._id === replyingTo._id ? { ...c, replyCount: (c.replyCount || 0) + 1 } : c
            ));
            setExpandedReplies(prev => ({ ...prev, [replyingTo._id]: true }));
        } else {
            setComments(prev => [newComment, ...prev]);
        }

        setCommentText("");
        setReplyingTo(null);
    } catch (error) {
        console.error("Failed to post comment", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId, parentId = null) => {
    try {
        await deleteCommentService(commentId);
        
        if (parentId) {
            setReplies(prev => ({
                ...prev,
                [parentId]: prev[parentId].filter(c => c._id !== commentId)
            }));
            setComments(prev => prev.map(c => 
                c._id === parentId ? { ...c, replyCount: Math.max(0, c.replyCount - 1) } : c
            ));
        } else {
            setComments(prev => prev.filter(c => c._id !== commentId));
            setReplies(prev => {
                const newReplies = { ...prev };
                delete newReplies[commentId];
                return newReplies;
            });
        }
    } catch (error) {
        console.error("Failed to delete comment", error);
    }
  };

  const handleLike = async (commentId, parentId = null) => {
    const updateLike = (list) => list.map(c => {
        if (c._id === commentId) {
            const isLiked = !c.isLiked;
            return { 
                ...c, 
                isLiked, 
                likeCount: isLiked ? (c.likeCount || 0) + 1 : Math.max(0, (c.likeCount || 0) - 1) 
            };
        }
        return c;
    });

    if (parentId) {
        setReplies(prev => ({ ...prev, [parentId]: updateLike(prev[parentId] || []) }));
    } else {
        setComments(prev => updateLike(prev));
    }

    try {
        await toggleCommentLikeService(commentId); 
    } catch (error) {
        if (parentId) {
            setReplies(prev => ({ ...prev, [parentId]: updateLike(prev[parentId] || []) }));
        } else {
            setComments(prev => updateLike(prev));
        }
    }
  };

  const handleToggleReplies = async (parentId) => {
    if (expandedReplies[parentId]) {
        setExpandedReplies(prev => ({ ...prev, [parentId]: false }));
        return;
    }

    if (!replies[parentId]) {
        setLoadingReplies(prev => ({ ...prev, [parentId]: true }));
        try {
            const res = await getCommentsService({ postId, parentId });
            setReplies(prev => ({ ...prev, [parentId]: res.comments }));
        } catch (error) {
            console.error("Failed to fetch replies", error);
        } finally {
            setLoadingReplies(prev => ({ ...prev, [parentId]: false }));
        }
    }
    setExpandedReplies(prev => ({ ...prev, [parentId]: true }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 md:bg-transparent">
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
        <h3 className="font-bold text-lg">Comments</h3>
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X size={20} />
        </button>
      </div>

      <div className="hidden md:block p-4 border-b border-slate-800/50 shrink-0">
          <h3 className="font-bold text-lg">Comments</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {comments.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                No comments yet. Be the first to share your thoughts!
            </div>
        ) : (
            comments.map((comment) => (
                <CommentNode 
                    key={comment._id} 
                    comment={comment} 
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

      <div className="p-3 border-t border-slate-800 bg-slate-900 shrink-0 z-10">
        {replyingTo && (
            <div className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded-t-lg mb-1 border border-slate-700/50 text-xs">
                <span className="text-slate-400">Replying to <span className="font-bold text-blue-400">@{replyingTo?.userId?.username}</span></span>
                <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-white"><X size={14}/></button>
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 focus-within:border-blue-500 transition-colors">
            <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                disabled={isSubmitting}
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500 disabled:opacity-50"
            />
            <button 
                type="submit" 
                disabled={!commentText.trim() || isSubmitting}
                className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-full disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
        </form>
      </div>
    </div>
  );
}

export default CommentSection;