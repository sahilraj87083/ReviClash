import { useRef, useState } from "react";
import gsap from "gsap";
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Repeat, 
  MoreHorizontal, 
} from "lucide-react";

function FeedPost({ post }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
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

  return (
    <div className="h-[100dvh] w-full snap-start flex items-center justify-center p-4">
      
      {/* --- MAIN POST CARD --- */}
      <div className="relative z-10 w-full max-w-[500px]">
        
        {/* Post Container - Fixed at 50vh */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[50vh] flex flex-col">
            
            {/* 1. Header: User Info (Fixed Height) */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800/50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-red-500 to-orange-500">
                        <img src={post.user.avatar} alt={post.user.name} className="w-full h-full rounded-full border-2 border-slate-900 object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm leading-tight">{post.user.name}</h3>
                        <p className="text-xs text-slate-400">Suggested for you</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white transition">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* 2. Content Body (Fills remaining space) */}
            <div className="bg-black/20 flex-1 relative overflow-hidden flex flex-col justify-center">
                {/* Title Overlay */}
                 <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-slate-900/80 to-transparent z-10 pointer-events-none">
                    <p className="text-sm text-slate-200 font-medium">{post.title}</p>
                </div>

                {post.type === 'snippet' ? (
                    <div className="p-6 pt-12 w-full h-full flex items-center overflow-auto">
                        <pre className="font-mono text-xs md:text-sm text-blue-300 leading-relaxed">
                            <code>{post.code}</code>
                        </pre>
                    </div>
                ) : (
                    <div className="p-8 text-center flex items-center justify-center h-full">
                        <p className="text-lg md:text-xl text-slate-400 italic font-serif leading-relaxed">"{post.content}"</p>
                    </div>
                )}
            </div>

            {/* 3. Footer: Actions (Fixed Height) */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleLike} className="group flex items-center gap-1.5">
                             <div ref={heartRef}>
                                <Heart size={26} className={`transition-colors ${liked ? "fill-red-500 text-red-500" : "text-slate-300 group-hover:text-red-500"}`} />
                             </div>
                             {likesCount > 0 && <span className="text-sm font-semibold text-slate-300">{likesCount}</span>}
                        </button>
                        <button className="group flex items-center gap-1.5">
                            <MessageCircle size={26} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                            {post.comments > 0 && <span className="text-sm font-semibold text-slate-300">{post.comments}</span>}
                        </button>
                        <button className="group">
                            <Repeat size={26} className="text-slate-300 group-hover:text-green-400 transition-colors" />
                        </button>
                    </div>
                    <div>
                        <button className="group">
                             <Bookmark size={26} className="text-slate-300 group-hover:text-yellow-400 transition-colors" />
                        </button>
                    </div>
                </div>
                
                <div className="mt-2 pl-1">
                    <p className="text-[10px] text-slate-500 uppercase font-medium tracking-wide">
                        2 hours ago
                    </p>
                </div>
            </div>

        </div>
      </div>

    </div>
  );
}

export default FeedPost