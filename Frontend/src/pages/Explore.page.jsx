import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { searchUsersService } from "../services/auth.services"; 
import { FeedPost } from "../components";
import { 
  Search, 
  X,
  Loader2,
  ArrowRight
} from "lucide-react";

// --- MOCK FEED DATA ---
const GENERAL_POSTS = [
  {
    id: 1,
    user: { name: "sahilsingh", avatar: "https://ui-avatars.com/api/?name=Sahil+Singh&background=0D8ABC&color=fff" },
    type: "snippet",
    title: "Optimized DP Solution 🚀",
    code: `function fib(n) {\n  let a = 0, b = 1;\n  return n ? b : a;\n}`,
    likes: 1240,
    comments: 45,
    isLiked: true,
  },
  {
    id: 2,
    user: { name: "uzmakhan", avatar: "https://ui-avatars.com/api/?name=Uzma+Khan&background=10b981&color=fff" },
    type: "image",
    content: "Just hit 2000 rating on LeetCode! Consistency is key.",
    likes: 856,
    comments: 22,
    isLiked: false,
  }
];

const FRIENDS_POSTS = [
    {
        id: 3,
        user: { name: "friend_dev", avatar: "https://ui-avatars.com/api/?name=Friend+Dev&background=f43f5e&color=fff" },
        type: "snippet",
        title: "One-liner isEven",
        code: `const isEven = n => !(n & 1);`,
        likes: 50,
        comments: 5,
        isLiked: false,
    },
    {
        id: 4,
        user: { name: "friend_dev2", avatar: "https://ui-avatars.com/api/?name=Friend+Dev&background=f43f5e&color=fff" },
        type: "snippet",
        title: "One-liner isOdd",
        code: `const isOdd = n => (n & 1);`,
        likes: 50,
        comments: 5,
        isLiked: true,
    }
];

function Explore() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchOverlayRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
        if (!isSearchOpen) return;

        // 1. Check if click is inside the Search Input (Header)
        const clickedSearchBar = searchContainerRef.current && searchContainerRef.current.contains(event.target);
        
        // 2. Check if click is inside the ACTUAL Results List (Inner Box)
        // Note: We will move the ref to the inner div below
        const clickedResults = searchOverlayRef.current && searchOverlayRef.current.contains(event.target);

        // 3. If click is OUTSIDE both, Close.
        if (!clickedSearchBar && !clickedResults) {
            closeSearch();
        }
    };

    // Add listener for both Mouse (Desktop) and Touch (Mobile)
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      
      const query = searchQuery.trim();

      if (!query || query.length < 2) {
        setFilteredUsers([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const users = await searchUsersService(query);
        setFilteredUsers(users);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // --- ANIMATIONS ---
  useGSAP(() => {
    const tl = gsap.timeline();
    
    if (isSearchOpen) {
      // Expand Search Bar
      tl.to(searchContainerRef.current, {
        width: "100%", 
        maxWidth: "320px", 
        backgroundColor: "rgba(15, 23, 42, 1)", 
        borderColor: "rgba(59, 130, 246, 0.5)",
        duration: 0.4, 
        ease: "back.out(1.2)",
      });
      // Show Overlay
      tl.to(searchOverlayRef.current, { 
        autoAlpha: 1, 
        y: 0,
        duration: 0.3, 
        ease: "power2.out" 
      }, "-=0.2");
      
      searchInputRef.current?.focus();
    } else {
      // Hide Overlay
      tl.to(searchOverlayRef.current, { 
        autoAlpha: 0, 
        y: 10,
        duration: 0.2, 
        ease: "power2.in" 
      });
      // Collapse Search Bar
      tl.to(searchContainerRef.current, { 
        width: "44px", 
        backgroundColor: "rgba(15, 23, 42, 0.6)", 
        borderColor: "rgba(255, 255, 255, 0.1)", 
        duration: 0.3, 
        ease: "power2.in", 
      }, "-=0.1");
    }
  }, [isSearchOpen]);


  const closeSearch = (e) => {

      if(e) e.stopPropagation();
      
      console.log("Closing search...");
      setIsSearchOpen(false);
      setSearchQuery("");
      setFilteredUsers([]);
  };

  const posts = activeTab === "general" ? GENERAL_POSTS : FRIENDS_POSTS;

  return (
    <div className="h-[100dvh] bg-slate-950 text-white overflow-hidden relative font-sans">
      
      {/* HEADER AREA */}
      <header className="absolute top-16 md:top-4 left-0 right-0 h-14 z-40 px-4 md:px-8 flex items-center justify-between pointer-events-none">
        
        {/* LEFT: SEARCH BAR (Pointer Events Auto) */}
        <div className="pointer-events-auto flex items-center justify-start h-full flex-1 z-50">
            <div 
                ref={searchContainerRef} 
                className="h-11 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-full flex items-center overflow-hidden shadow-lg transition-all origin-left"
                style={{ width: '44px' }} 
            >
                {isSearchOpen ? (
                    <div className="flex items-center w-full px-3 gap-2">
                         <Search size={18} className="text-blue-400 shrink-0" />
                         <input
                            ref={searchInputRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users..."
                            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500 min-w-0"
                        />
                        
                        <button 
                            onClick={() => closeSearch()} 
                            className="shrink-0 p-2 hover:bg-slate-800 rounded-full transition-colors relative z-50 cursor-pointer"
                        >
                            <X size={16} className="text-slate-400 hover:text-white" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsSearchOpen(true)} 
                        className="w-11 h-11 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                    >
                        <Search size={20} />
                    </button>
                )}
            </div>
        </div>

        {/* CENTER: FEED TOGGLE */}
        <div 
            className={`pointer-events-auto z-50 absolute left-1/2 -translate-x-1/2 flex items-center bg-black/40 backdrop-blur-xl rounded-full p-1 border border-white/10 shadow-2xl transition-all duration-300 
            ${isSearchOpen ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"}`}
        >
            <button 
                onClick={() => setActiveTab("general")} 
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "general" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
                General
            </button>
            <button 
                onClick={() => setActiveTab("friends")} 
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "friends" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
                Friends
            </button>
        </div>

        {/* RIGHT: SPACER */}
        <div className="flex-1"></div>
      </header>

      {/* --- SEARCH RESULTS OVERLAY --- */}
      <div 
         ref={searchOverlayRef} 
         className="absolute top-28 md:top-20 left-0 right-0 bottom-0 bg-slate-950/95 backdrop-blur-xl z-30 invisible opacity-0 flex flex-col border-t border-slate-800/50"
      >
          <div className="max-w-2xl mx-auto w-full h-full p-4 overflow-y-auto pb-20">
             
             {isSearching && (
                 <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                     <Loader2 size={24} className="animate-spin text-blue-500 mb-3"/>
                     <p className="text-xs font-medium animate-pulse">Searching database...</p>
                 </div>
             )}

             {!searchQuery && !isSearching && (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-600 space-y-4">
                     <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center border border-slate-800">
                        <Search size={32} className="opacity-50"/>
                     </div>
                     <p className="text-sm">Type to find developers</p>
                 </div>
             )}

             {!isSearching && searchQuery && searchQuery.length < 2 && (
                 <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                     <p className="text-xs">Type at least 2 characters...</p>
                 </div>
             )}

             {!isSearching && searchQuery && filteredUsers.length > 0 && (
                 <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Users Found</p>
                     
                     {filteredUsers.map((user) => (
                         <Link 
                            key={user._id} 
                            to={`/user/profile/${user.username}`}
                            onClick={closeSearch} 
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900/80 transition-all group border border-transparent hover:border-slate-800 active:scale-[0.99]"
                         >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                                     {user.avatar?.url ? (
                                        <img src={user.avatar.url} alt={user.username} className="w-full h-full object-cover" />
                                     ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-sm bg-slate-900">
                                            {user.fullName?.[0]?.toUpperCase()}
                                        </div>
                                     )}
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">
                                        {user.username}
                                    </h4>
                                    <p className="text-slate-400 text-xs">{user.fullName}</p>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-slate-600 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                         </Link>
                     ))}
                 </div>
             )}

             {!isSearching && searchQuery.length >= 3 && filteredUsers.length === 0 && (
                 <div className="text-center py-12">
                     <p className="text-slate-400 text-sm">No users found matching "<span className="text-white font-semibold">{searchQuery}</span>"</p>
                 </div>
             )}
          </div>
      </div>

      {/* --- MAIN FEED --- */}
      <div className="h-full pt-32 md:pt-24 overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
        {posts.length > 0 ? (
             posts.map((post) => (
                <FeedPost key={post.id} post={post} />
              ))
        ) : (
            <div className="h-[50vh] flex items-center justify-center text-slate-500">
                <p>No posts in this feed yet.</p>
            </div>
        )}
        <div className="h-24 snap-end"></div>
      </div>

    </div>
  );
}


export default Explore;