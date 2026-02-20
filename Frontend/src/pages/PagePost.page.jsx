// PagePost.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Globe, Repeat, Lock } from "lucide-react";
import {FeedPost} from "../components";

function PagePost() {
    const { username } = useParams();
    const [searchParams] = useSearchParams();
    const filter = searchParams.get("filter") || "general";

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const EXAMPLE_POSTS = [
        {
            _id: "post_gen_1",
            authorId: { 
            _id: "user_1", 
            username: "sahilsingh02", 
            fullName: "Sahil Singh Rajput",
            avatar: { url: "https://ui-avatars.com/api/?name=Sahil+Singh&background=0D8ABC&color=fff" } 
            },
            textContent: "Optimized DP Solution 🚀\n\n```javascript\nfunction fib(n) {\n  let a = 0, b = 1;\n  return n ? b : a;\n}\n```",
            images: [],
            likeCount: 1240,
            commentCount: 45,
            repostCount: 12,
            visibility: "general",
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
            _id: "post_gen_2",
            authorId: { 
            _id: "user_2", 
            username: "uzmakhan", 
            fullName: "Uzma Khan",
            avatar: { url: "https://ui-avatars.com/api/?name=Uzma+Khan&background=10b981&color=fff" } 
            },
            textContent: "Just hit 2000 rating on LeetCode! Consistency is key. Hard work pays off! 🔥",
            images: [
            { url: "https://picsum.photos/seed/leetcode/800/600", public_id: "img_lc_1" }
            ],
            likeCount: 856,
            commentCount: 22,
            repostCount: 5,
            visibility: "general",
            createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        },
        {
            _id: "post_friend_1",
            authorId: { 
                _id: "user_3", 
                username: "friend_dev", 
                fullName: "Friend Dev",
                avatar: { url: "https://ui-avatars.com/api/?name=Friend+Dev&background=f43f5e&color=fff" } 
            },
            textContent: "One-liner isEven magic ✨\n\n```javascript\nconst isEven = n => !(n & 1);\n```",
            images: [],
            likeCount: 50,
            commentCount: 5,
            repostCount: 2,
            visibility: "friends",
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
            _id: "post_friend_2",
            authorId: { 
                _id: "user_4", 
                username: "friend_dev2", 
                fullName: "Another Friend",
                avatar: { url: "https://ui-avatars.com/api/?name=Another+Friend&background=8b5cf6&color=fff" } 
            },
            textContent: "Setup complete for the new weekend project! Rate my setup 🖥️👇",
            images: [
                { url: "https://picsum.photos/seed/setup1/800/600", public_id: "img_setup_1" },
                { url: "https://picsum.photos/seed/setup2/800/600", public_id: "img_setup_2" },
                { url: "https://picsum.photos/seed/setup3/800/600", public_id: "img_setup_3" }
            ],
            likeCount: 120,
            commentCount: 15,
            repostCount: 4,
            visibility: "friends",
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        }
    ];



    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans pt-16 md:pt-24 pb-20">
            <div className="max-w-2xl mx-auto px-4 md:px-6">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 sticky top-16 md:top-24 z-10 bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-800">
                    <Link to={`/user/profile/${username}`} className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-300" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white capitalize">{username}'s Posts</h1>
                        <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                            {filter === 'general' && <Globe size={14} />}
                            {filter === 'repost' && <Repeat size={14} />}
                            {filter === 'private' && <Lock size={14} />}
                            Viewing {filter} activity
                        </p>
                    </div>
                </div>

                {/* Feed */}
                <div className="flex flex-col gap-6">
                    {EXAMPLE_POSTS.map((post, index) => {
                        return (
                            <div  key={post._id}>
                                <FeedPost post={post} />
                            </div>
                        );
                    })}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-8">
                        <Loader2 size={24} className="text-blue-500 animate-spin" />
                    </div>
                )}

                {/* End of Feed */}
                {!hasMore && EXAMPLE_POSTS.length > 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        You've reached the end!
                    </div>
                )}
            </div>
        </div>
    );
}

export default PagePost;