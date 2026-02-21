// FeedPost.jsx
import { useRef, useState } from "react";
import gsap from "gsap";
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Repeat, 
  MoreHorizontal,
  Globe,
  Users
} from "lucide-react";
import { toggleRepostService } from "../../services/repost.services.js";


function FeedPost({ post }) {
  // Assume post.isLiked is passed down or calculated elsewhere, defaulting to false for now
  const [liked, setLiked] = useState(false); 
  const [likesCount, setLikesCount] = useState(post?.likeCount || 0);
  const heartRef = useRef(null);

  const toggleLike = () => {
    if (!liked) {
      setLikesCount(p => p + 1);
      gsap.fromTo(heartRef.current, { scale: 0.8 }, { scale: 1.2, duration: 0.3, ease: "back.out(2.5)" });
    } else {
      setLikesCount(p => p - 1);
    }
    setLiked(!liked);
  };

  const handleRepostClick = async () => {
        await toggleRepostService(post._id)
  }

  const author = post?.authorId || {};
  const hasImages = post?.images?.length > 0;
  
  // Format Date safely
  const formattedDate = post?.createdAt 
    ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : 'Just now';

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-[600px]">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            
            {/* 1. Header: User Info */}
            <div className="flex items-center justify-between p-4 pb-3 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0 overflow-hidden border border-slate-700">
                        {author.avatar?.url ? (
                            <img src={author.avatar.url} alt={author.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold uppercase">
                                {author.fullName?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-white text-sm leading-tight hover:underline cursor-pointer">
                                {author.fullName || 'Unknown User'}
                            </h3>
                            <span className="text-slate-500 text-xs flex items-center">
                                • {formattedDate}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <span className="hover:text-slate-300 cursor-pointer">@{author.username || 'username'}</span>
                            <span>•</span>
                            {post?.visibility === 'friends' ? <Users size={12} /> : <Globe size={12} />}
                        </div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white transition p-2 hover:bg-slate-800 rounded-full">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* 2. Content Body */}
            <div className="flex-1 flex flex-col">
                
                {/* Text Content */}
                {post?.textContent && (
                    <div className="px-4 pb-3">
                        <p className="text-slate-200 text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                            {post.textContent}
                        </p>
                    </div>
                )}

                {/* Media Content (Images) */}
                {hasImages && (
                    <div className={`grid gap-0.5 border-y border-slate-800/50 bg-black/40
                        ${post.images.length === 1 ? 'grid-cols-1' : ''}
                        ${post.images.length === 2 ? 'grid-cols-2' : ''}
                        ${post.images.length >= 3 ? 'grid-cols-2' : ''}
                    `}>
                        {post.images.slice(0, 4).map((img, index) => {
                            // Layout logic for 3+ images
                            const isThreeImagesAndFirst = post.images.length === 3 && index === 0;
                            const isMoreThanFour = post.images.length > 4 && index === 3;
                            
                            return (
                                <div 
                                    key={img.public_id || index} 
                                    className={`relative overflow-hidden
                                        ${post.images.length === 1 ? 'max-h-[500px]' : 'aspect-square sm:aspect-[4/3]'}
                                        ${isThreeImagesAndFirst ? 'col-span-2 aspect-[16/9]' : ''}
                                    `}
                                >
                                    <img 
                                        src={img.url} 
                                        alt={`Post media ${index + 1}`} 
                                        className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" 
                                    />
                                    {isMoreThanFour && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                                            <span className="text-white font-bold text-xl md:text-2xl">
                                                +{post.images.length - 4}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 3. Footer: Actions */}
            <div className="p-1 px-2 sm:px-4 bg-slate-900 shrink-0 border-t border-slate-800/50">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 sm:gap-6 text-slate-400">
                        {/* Like Button */}
                        <button onClick={toggleLike} className="group flex items-center gap-2 hover:text-red-500 transition-colors p-2 -ml-2 rounded-full hover:bg-red-500/10">
                             <div ref={heartRef}>
                                <Heart size={20} className={`transition-colors ${liked ? "fill-red-500 text-red-500" : ""}`} />
                             </div>
                             <span className={`text-sm font-medium ${liked ? "text-red-500" : ""}`}>
                                {likesCount > 0 ? likesCount : 'Like'}
                             </span>
                        </button>

                        {/* Comment Button */}
                        <button className="group flex items-center gap-2 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-400/10">
                            <MessageCircle size={20} />
                            <span className="text-sm font-medium">
                                {post?.commentCount > 0 ? post.commentCount : 'Comment'}
                            </span>
                        </button>

                        {/* Repost Button */}
                        {post.visibility !== 'friends' && (
                            <button 
                            onClick={handleRepostClick}
                            className="group flex items-center gap-2 hover:text-green-400 transition-colors p-2 rounded-full hover:bg-green-400/10">
                                <Repeat size={20} />
                                <span className="text-sm font-medium">
                                    {post?.repostCount > 0 ? post.repostCount : 'Repost'}
                                </span>
                            </button>
                        )}
                    </div>
                    
                    {/* Bookmark Button */}
                    <div>
                        <button className="group hover:text-yellow-400 transition-colors p-2 rounded-full hover:bg-yellow-400/10">
                             <Bookmark size={20} className="text-slate-400 group-hover:text-yellow-400" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default FeedPost;