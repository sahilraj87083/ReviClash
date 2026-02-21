import { useState } from "react";
import { Send, Heart, Reply, MoreHorizontal, X } from "lucide-react";

// Mock Data for UI demonstration
const MOCK_COMMENTS = [
  {
    _id: "c1",
    user: { username: "johndoe", fullName: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff" },
    content: "This is a brilliantly optimized solution! Thanks for sharing.",
    likeCount: 12,
    isLiked: false,
    createdAt: "2h",
    replyCount: 1
  },
  {
    _id: "c2",
    user: { username: "uzmakhan", fullName: "Uzma Khan", avatar: "https://ui-avatars.com/api/?name=Uzma+Khan&background=10b981&color=fff" },
    content: "Could you explain the bitmasking part in more detail?",
    likeCount: 5,
    isLiked: true,
    createdAt: "5h",
    replyCount: 0
  }
];

const CommentSection = ({ postId, onClose }) => {
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // Stores comment object if replying

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    console.log("Posting comment to postId:", postId, "Content:", commentText, "ParentId:", replyingTo?._id);
    
    // Reset state after "posting"
    setCommentText("");
    setReplyingTo(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 md:bg-transparent">
      {/* Mobile Header (Only visible on mobile) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800">
        <h3 className="font-bold text-lg">Comments</h3>
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X size={20} />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block p-4 border-b border-slate-800/50">
          <h3 className="font-bold text-lg">Comments</h3>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
        {MOCK_COMMENTS.map((comment) => (
            <div key={comment._id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0 overflow-hidden">
                    <img src={comment.user.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{comment.user.username}</span>
                        <span className="text-xs text-slate-500">{comment.createdAt}</span>
                    </div>
                    <p className="text-sm text-slate-300 mt-0.5">{comment.content}</p>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500">
                        <button className={`flex items-center gap-1 hover:text-red-500 transition-colors ${comment.isLiked ? 'text-red-500' : ''}`}>
                            <Heart size={14} className={comment.isLiked ? 'fill-red-500' : ''} /> {comment.likeCount > 0 && comment.likeCount}
                        </button>
                        <button onClick={() => setReplyingTo(comment)} className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                            <Reply size={14} /> Reply
                        </button>
                        <button className="hover:text-slate-300 transition-colors">
                            <MoreHorizontal size={14} />
                        </button>
                    </div>

                    {/* View Replies Toggle */}
                    {comment.replyCount > 0 && (
                        <button className="text-xs text-blue-400 mt-2 font-medium flex items-center gap-2">
                            <div className="w-6 h-[1px] bg-slate-700"></div>
                            View {comment.replyCount} replies
                        </button>
                    )}
                </div>
            </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-800 bg-slate-900 shrink-0">
        {replyingTo && (
            <div className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded-t-lg mb-1 border border-slate-700/50 text-xs">
                <span className="text-slate-400">Replying to <span className="font-bold text-blue-400">@{replyingTo.user.username}</span></span>
                <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-white"><X size={14}/></button>
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 focus-within:border-blue-500 transition-colors">
            <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
            />
            <button 
                type="submit" 
                disabled={!commentText.trim()}
                className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-full disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
                <Send size={18} />
            </button>
        </form>
      </div>
    </div>
  );
}

export default CommentSection