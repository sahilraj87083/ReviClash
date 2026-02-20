import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "../components";
import { useParams } from "react-router-dom";
import { getUserProfileService } from "../services/profile.services";
import { useUserContext } from "../contexts/UserContext";
import { ActivityTab, CollectionsTab, FollowersTab, Tab , CreatePostModal} from "../components/profilePageComponent";
import { ProfileActions } from '../components';
import { useFollow } from "../hooks/useFollow";
import { Link } from "react-router-dom";

import { 
  Calendar,
  CheckCircle2,
  Image as ImageIcon,
  Type,
  ArrowRight,
  Send,
  Plus,
  Globe,
  Repeat,
  Lock
} from "lucide-react";

const TABS = {
  ACTIVITY: "activity",
  COLLECTIONS: "collections",
  FOLLOWERS: "followers",
};

function MyProfile() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(TABS.ACTIVITY);
  const [postFilter, setPostFilter] = useState("general");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { username } = useParams();

  const { user: loggedInUser } = useUserContext();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  const loggedInUserId = loggedInUser?._id;
  const profileUserId = profile?._id; 
  const isOwnProfile = loggedInUserId === profileUserId;
  const isUserLoggedIn = !!loggedInUser;

  const latestPosts = {
    general: { id: "p1", content: "Just deployed my new MERN stack project! 🚀", createdAt: "2 hours ago" },
    repost: { id: "p2", content: "This is a great article on React performance.", createdAt: "1 day ago" },
    private: null 
};

  const { isFollowedBy, isFollowing, follow, unfollow, loading } = useFollow(profileUserId);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfileService(username);
        setProfile(data);
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [username]);
  

  useGSAP(() => {
    if (!loadingProfile) {
        gsap.from(containerRef.current?.children || [], {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        });
    }
  }, [loadingProfile]);

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 selection:bg-red-500/30">
        
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div ref={containerRef} className="relative z-10 max-w-6xl mx-auto md:px-6 pt-16 md:pt-24 space-y-2">

        {/* --- 1. PROFILE CARD --- */}
        <section className="bg-slate-900 border-b md:border border-slate-800 md:rounded-2xl overflow-hidden shadow-2xl relative group">
            
            {/* Cover Image */}
            <div className="h-32 md:h-48 w-full bg-slate-800 relative overflow-hidden">
                {profile?.coverImage?.url ? (
                    <img 
                        src={profile.coverImage.url} 
                        alt="Cover" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-900"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
            </div>

            {/* Profile Info Content */}
            <div className="px-4 md:px-6 pb-6 relative">
                
                {/* Top Row: Avatar & Actions */}
                <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 md:-mt-10 mb-4 gap-4">
                    
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-lg">
                            {profile?.avatar?.url ? (
                                <img src={profile.avatar.url} alt={profile.username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-500 uppercase">
                                    {profile?.fullName?.[0]}
                                </div>
                            )}
                        </div>
                        {profile?.isVerified && (
                            <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full border-4 border-slate-900" title="Verified">
                                <CheckCircle2 size={14} />
                            </div>
                        )}
                    </div>

                    {/* Spacer for Desktop Alignment */}
                    <div className="flex-1 text-center md:text-left pt-2 md:pt-0">
                        <h1 className="text-2xl font-bold text-white leading-tight">
                            {profile?.fullName}
                        </h1>
                        <p className="text-slate-400 font-medium">@{profile?.username}</p>
                    </div>

                    {/* Actions Button */}
                    <div className="shrink-0 mb-2 md:mb-4">
                        <ProfileActions
                            unfollow={unfollow}
                            follow={follow}
                            loading={loading}
                            isOwnProfile={isOwnProfile}
                            isUserLoggedIn={isUserLoggedIn}
                            isFollowedBy={isFollowedBy}
                            isFollowing={isFollowing}
                        />
                    </div>
                </div>

                {/* Bio & Meta */}
                <div className="md:pl-[150px] space-y-4 text-center md:text-left">
                    {profile?.bio && (
                        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed mx-auto md:mx-0">
                            {profile.bio}
                        </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} /> 
                            <span>Joined {new Date(profile?.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex gap-4 pl-4 border-l border-slate-700">
                            <button onClick={() => setActiveTab(TABS.FOLLOWERS)} className="hover:text-white transition">
                                <span className="font-bold text-white mr-1">{profile?.followersCount || 0}</span> Followers
                            </button>
                            <span className="hover:text-white transition">
                                <span className="font-bold text-white mr-1">{profile?.followingCount || 0}</span> Following
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        

        {/* --- 2. POST & UPDATES SECTION --- */}
        <section className="bg-slate-900 border-y md:border md:border-slate-800 md:rounded-xl overflow-hidden p-4 md:p-6 space-y-6 shadow-sm">
            
            {/* Section 1: Upload (Only for Owner) */}
            {isOwnProfile && (
                <div className="flex gap-3 sm:gap-4 pb-6 border-b border-slate-800/60">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 shrink-0 overflow-hidden border border-slate-700">
                        {profile?.avatar?.url ? (
                            <img src={profile.avatar.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                {profile?.fullName?.[0]}
                            </div>
                        )}
                    </div>
                    
                    {/* Trigger Box */}
                    <div className="flex-1 flex flex-col gap-3">
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-full text-left bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl px-5 py-3.5 text-slate-400 text-sm md:text-base transition-colors shadow-inner"
                        >
                            What's on your mind, {profile?.fullName?.split(' ')[0]}?
                        </button>
                        
                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 px-1">
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-800 text-blue-400 text-sm font-medium transition-colors"
                            >
                                <ImageIcon size={18} /> <span className="hidden sm:inline">Media</span>
                            </button>
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-800 text-green-400 text-sm font-medium transition-colors"
                            >
                                <Type size={18} /> <span className="hidden sm:inline">Article</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 2: Posts Display Options */}
            <div className="flex flex-col space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-white tracking-tight">Activity Feed</h3>
                    <Button 
                        variant="secondary" 
                        className="flex items-center gap-2 w-full sm:w-auto justify-center rounded-full text-sm py-2"
                    >
                        View All <ArrowRight size={16} />
                    </Button>
                </div>

                {/* Post Filters / Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800/50">
                    <button 
                        onClick={() => setPostFilter('general')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${postFilter === 'general' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'}`}
                    >
                        <Globe size={16} /> General
                    </button>
                    <button 
                        onClick={() => setPostFilter('repost')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${postFilter === 'repost' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'}`}
                    >
                        <Repeat size={16} /> Reposts
                    </button>
                    {(isOwnProfile || (isFollowedBy && isFollowing)) && (
                        <button 
                            onClick={() => setPostFilter('private')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${postFilter === 'private' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'}`}
                        >
                            <Lock size={16} /> Private
                        </button>
                    )}
                </div>

                {/* Filtered Content Display Area (Placeholder) */}
                <div className="mt-6">
                    {latestPosts[postFilter] ? (
                        <Link 
                            to={`/user/${profile?.username}/posts?filter=${postFilter}`}
                            className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    Latest {postFilter}
                                </span>
                                <span className="text-xs text-slate-500">{latestPosts[postFilter].createdAt}</span>
                            </div>
                            
                            <p className="text-slate-300 text-sm md:text-base mb-6 line-clamp-3">
                                {latestPosts[postFilter].content}
                            </p>

                            <div className="w-full py-2.5 rounded-lg bg-slate-950/50 group-hover:bg-slate-800/50 flex items-center justify-center text-blue-400 text-sm font-medium transition-colors">
                                View all {postFilter} posts <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ) : (
                        <div className="py-16 text-center bg-slate-900/20 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                {postFilter === 'general' && <Globe size={24} />}
                                {postFilter === 'repost' && <Repeat size={24} />}
                                {postFilter === 'private' && <Lock size={24} />}
                            </div>
                            <p className="text-slate-400 text-sm font-medium">
                                {postFilter === 'general' && "No general posts to show right now."}
                                {postFilter === 'repost' && "No reposts to show right now."}
                                {postFilter === 'private' && "Your private posts will appear here."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
        </section>

        {/* --- 3. TABS & CONTENT --- */}
        <section className="bg-slate-900 border-y md:border md:border-slate-800 md:rounded-xl min-h-[500px]">
          
          {/* Navigation - Sticky */}
          <div className="flex border-b border-slate-800 sticky top-16 md:top-0 bg-slate-900/95 backdrop-blur z-20">
            <div className="flex w-full px-0 md:px-4">
                <div className="flex-1 flex justify-center">
                    <Tab
                        label="Activity"
                        active={activeTab === TABS.ACTIVITY}
                        onClick={() => setActiveTab(TABS.ACTIVITY)}
                    />
                </div>
                <div className="flex-1 flex justify-center">
                    <Tab
                        label="Collections"
                        count={profile?.collections?.length} 
                        active={activeTab === TABS.COLLECTIONS}
                        onClick={() => setActiveTab(TABS.COLLECTIONS)}
                    />
                </div>
                <div className="flex-1 flex justify-center">
                    <Tab
                        label="Followers"
                        count={profile?.followersCount}
                        active={activeTab === TABS.FOLLOWERS}
                        onClick={() => setActiveTab(TABS.FOLLOWERS)}
                    />
                </div>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="p-4 md:p-6 bg-slate-900/50">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === TABS.ACTIVITY && profile?._id && (
                    <ActivityTab userId={profile._id} />
                )}

                {activeTab === TABS.COLLECTIONS && (
                    <CollectionsTab collections={profile?.collections} />
                )}
                
                {activeTab === TABS.FOLLOWERS && (
                    <FollowersTab userId={profile?._id} />
                )}
            </div>
          </div>
        </section>

      </div>
      {/* Render the Modal at the bottom of the component */}
      <CreatePostModal 
          open={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          user={profile} 
      />
    </div>
  );
}

export default MyProfile;