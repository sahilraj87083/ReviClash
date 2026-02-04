import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "../components";
import { useParams } from "react-router-dom";
import { getUserProfileService} from "../services/profile.services";
import { useUserContext } from "../contexts/UserContext";
import { ActivityTab,CollectionsTab, FollowersTab, Stat, Tab } from "../components/profilePageComponent";
import { FollowButton , ProfileActions } from '../components'
import { resendVerificationEmailService  } from "../services/auth.services";
import toast from "react-hot-toast";
import { useFollow } from "../hooks/useFollow";

const TABS = {
  ACTIVITY: "activity",
  COLLECTIONS: "collections",
  FOLLOWERS: "followers",
};

function MyProfile() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(TABS.ACTIVITY);

  const { username } = useParams();

  const { user: loggedInUser } = useUserContext();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const loggedInUserId = loggedInUser?._id;
  const profileUserId = profile?._id; 
  const isOwnProfile = loggedInUserId === profileUserId;
  const isUserLoggedIn = !!loggedInUser

  const { isFollowedBy, isFollowing, follow, unfollow, loading} = useFollow(profileUserId)

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
 

  useGSAP(
    () => {
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <div ref={containerRef} className="max-w-6xl mx-auto space-y-8">

        {/* PROFILE HEADER */}
        <section className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
          {profile?.avatar? (
              <img
                src={profile?.avatar.url}
                alt="avatar"
                className="w-28 h-28 rounded-full border-2 border-red-500 object-cover"
              />
            ) : (<div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xl font-bold text-white">
                <p className="capitalize">{profile?.fullName[0]}</p>
              </div>)}
          

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white capitalize">
              {profile?.fullName}
            </h1>
            <p className="text-slate-400">@{profile?.username}</p>

            <p className="text-slate-300 mt-2 max-w-lg">
              {profile?.bio}
            </p>
            <div className="flex gap-6 font-semibold text-white">
              <span>Followers {profile?.followersCount}</span>
              <span>Following {profile?.followingCount}</span>
            </div>
          </div>
          


          {/* PROFILE ACTIONS */}
          {/* {isUserLoggedIn && (
            <div className="flex gap-3">
              {isOwnProfile ? (
                <>
                  <Button variant="secondary">Edit Profile</Button>
                  <Button variant="ghost">Share</Button>
                </>
              ) : (
                <>
                  <FollowButton userId={profileUserId} />
                  <Button variant="secondary">Message</Button>
                </>
              )}
            </div>
          )} */}
          <ProfileActions
            unfollow={unfollow}
            follow={follow}
            loading={loading}
            isOwnProfile={isOwnProfile}
            isUserLoggedIn={isUserLoggedIn}
            isFollowedBy = {isFollowedBy}
            isFollowing = {isFollowing}
          />


        </section>
            {isOwnProfile && !loggedInUser?.emailVerified && (
            <div className="flex bg-white-400 rounded justify-end items-center gap-3">
              <p className="text-red-500 underline text-sm">Email not verified</p>
              <Button variant = 'ghost' onClick={resendEmail}>Verify → </Button>
            </div>
          )}
        {/* STATS */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat title="Contests Played" value={profile?.stats?.totalContests || 0} />
          <Stat title="Problems Solved" value={profile?.stats?.totalQuestionsSolved || 0} />
          <Stat title="Accuracy" value={`${profile?.stats?.avgAccuracy?.toFixed(1) || 0}%`} />
          <Stat
            title="Avg Time / Q"
            value={`${profile?.stats?.avgTimePerQuestion?.toFixed(1) || 0}s`}
          />
        </section>

        {/* TABS */}
        <section className="bg-slate-900/60 border border-slate-700/50 rounded-xl">
          <div className="flex border-b border-slate-700/50">
            <Tab
              label="Activity"
              active={activeTab === TABS.ACTIVITY}
              onClick={() => setActiveTab(TABS.ACTIVITY)}
            />
            <Tab
              label="Collections"
              active={activeTab === TABS.COLLECTIONS}
              onClick={() => setActiveTab(TABS.COLLECTIONS)}
            />
            <Tab
              label="Followers"
              active={activeTab === TABS.FOLLOWERS}
              onClick={() => setActiveTab(TABS.FOLLOWERS)}
            />
          </div>

          {/* TAB CONTENT */}
          <div className="p-6">
            {activeTab === TABS.ACTIVITY && profile?._id && (
                <ActivityTab userId={profile._id} />
              )}

            {activeTab === TABS.COLLECTIONS && <CollectionsTab  collections = {profile?.collections}/>}
            {activeTab === TABS.FOLLOWERS && <FollowersTab userId={profile?._id}/>}
          </div>
        </section>

      </div>
    </div>
  );
}


export default MyProfile;
