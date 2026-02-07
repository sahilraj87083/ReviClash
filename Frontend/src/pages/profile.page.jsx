import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "../components";
import { useParams, useNavigate } from "react-router-dom";
import { getUserProfileService } from "../services/profile.services";
import { useUserContext } from "../contexts/UserContext";
import { ActivityTab, CollectionsTab, FollowersTab, Tab } from "../components/profilePageComponent";
import { ProfileActions } from '../components';
import { resendVerificationEmailService } from "../services/auth.services";
import toast from "react-hot-toast";
import { useFollow } from "../hooks/useFollow";
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle2,
  Image as ImageIcon,
  Type,
  ArrowRight,
  Send
} from "lucide-react";

const TABS = {
  ACTIVITY: "activity",
  COLLECTIONS: "collections",
  FOLLOWERS: "followers",
};

function MyProfile() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(TABS.ACTIVITY);

  const { username } = useParams();
  const navigate = useNavigate();

  const { user: loggedInUser } = useUserContext();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  const loggedInUserId = loggedInUser?._id;
  const profileUserId = profile?._id; 
  const isOwnProfile = loggedInUserId === profileUserId;
  const isUserLoggedIn = !!loggedInUser;

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
  
  const resendEmail = async () => {
    try {
      await resendVerificationEmailService();
      toast.success("Verification email sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    }
  };

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

        {/* --- 2. ALERT: Email Verification --- */}
        {isOwnProfile && !loggedInUser?.emailVerified && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-orange-400">
                    <AlertTriangle size={20} className="shrink-0" />
                    <p className="text-sm font-medium">Your email is not verified.</p>
                </div>
                <Button variant="ghost" onClick={resendEmail} className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 text-sm h-8 px-3">
                    Resend Email →
                </Button>
            </div>
        )}

        {/* --- 3. POST & UPDATES SECTION --- */}
        <section className="bg-slate-900 border-y md:border md:border-slate-800 md:rounded-xl overflow-hidden p-4 md:p-6 space-y-4">
            
            {/* A. Create Post (Only for Owner) */}
            {isOwnProfile && (
                <div className="flex gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0 overflow-hidden border border-slate-700 hidden sm:flex items-center justify-center">
                        {profile?.avatar?.url ? (
                            <img src={profile.avatar.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-slate-500 font-bold">{profile?.fullName?.[0]}</div>
                        )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 focus-within:border-blue-500/50 transition-colors">
                            <input 
                                placeholder="What's on your mind?"
                                className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
                            />
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors">
                                    <ImageIcon size={14} className="text-blue-400" /> Media
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors">
                                    <Type size={14} className="text-yellow-400" /> Text
                                </button>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                                <Send size={16} className="ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* B. View All Posts Action (For Everyone) */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${isOwnProfile ? 'border-t border-slate-800 pt-4' : ''}`}>
                <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-white">Community Posts</h3>
                    <p className="text-xs text-slate-400">See what {isOwnProfile ? "you have" : profile?.fullName + " has"} shared recently.</p>
                </div>
                <Button 
                    variant="secondary" 
                    // onClick={() => navigate(`/user/posts/${profile?.username}`)}
                    className="flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    All Posts <ArrowRight size={16} />
                </Button>
            </div>
        </section>

        {/* --- 4. TABS & CONTENT --- */}
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
    </div>
  );
}

export default MyProfile;