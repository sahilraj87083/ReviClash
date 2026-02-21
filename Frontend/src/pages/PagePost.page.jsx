// src/pages/PagePost.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Globe, Repeat, Lock, ListFilter } from "lucide-react";
import { FeedPost } from "../components";
import { getAllPostsService } from "../services/post.services";
import { getAllRepostedPostsService } from "../services/repost.services.js";

const SERVICE_MAP = {
    general: (params) => getAllPostsService({ ...params, visibility: "general" }),
    friends: (params) => getAllPostsService({ ...params, visibility: "friends" }),
    repost: (params) => getAllRepostedPostsService(params),
    All: (params) => getAllPostsService(params),
};

function PagePost() {
    const { username } = useParams();
    const [searchParams] = useSearchParams();
    const filter = searchParams.get("filter") || "general";

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState(null);
    
    const observer = useRef();

    const fetchPosts = async (isReset = false) => {
        if (loading || (!hasMore && !isReset)) return;
        setLoading(true);
        
        try {
            const currentCursor = isReset ? null : cursor;
            
            const fetchService = SERVICE_MAP[filter] || SERVICE_MAP.All;
            
            const response = await fetchService({
                cursor: currentCursor,
                limit: 10,
                username: username
            });

            const newPosts = response.posts || [];
            
            setPosts(prev => {
                if (isReset) return newPosts;
                
                const existingIds = new Set(prev.map(p => p._id));
                const filteredNewPosts = newPosts.filter(p => !existingIds.has(p._id));
                return [...prev, ...filteredNewPosts];
            });
            
            setCursor(response.nextCursor);
            setHasMore(response.hasMore);

        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setHasMore(true);
        setCursor(null);
        fetchPosts(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username, filter]);

    const lastPostElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchPosts(false);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, cursor]); 

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans pt-16 md:pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
                
                <div className="flex items-center gap-4 mb-8 sticky top-16 md:top-24 z-10 bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-800">
                    <Link to={`/user/profile/${username}`} className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-300" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white capitalize">{username}'s Posts</h1>
                        <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1 capitalize">
                            {filter === 'general' && <Globe size={14} />}
                            {filter === 'repost' && <Repeat size={14} />}
                            {filter === 'private' && <Lock size={14} />}
                            {filter === 'All' && <ListFilter size={14} />}
                            Viewing {filter} activity
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {posts.map((post, index) => {
                        const isLastElement = posts.length === index + 1;
                        return (
                            <div 
                                ref={isLastElement ? lastPostElementRef : null} 
                                key={post._id}
                            >
                                <FeedPost post={post} />
                            </div>
                        );
                    })}
                </div>

                {loading && (
                    <div className="flex justify-center py-8">
                        <Loader2 size={24} className="text-blue-500 animate-spin" />
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center py-16 text-slate-500 bg-slate-900/20 rounded-xl border border-dashed border-slate-800">
                        <p>No posts found.</p>
                    </div>
                )}

                {!hasMore && posts.length > 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        You've reached the end!
                    </div>
                )}
            </div>
        </div>
    );
}

export default PagePost;