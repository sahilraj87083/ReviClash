import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "../components";

const TABS = {
  ACTIVITY: "activity",
  COLLECTIONS: "collections",
  FOLLOWERS: "followers",
};

function MyProfile() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(TABS.ACTIVITY);

  // ---- Mock data (replace with API later)
  const loggedInUserId = "1";
  const profileUserId = "1"; // change to same as loggedInUserId to test own profile
  const isOwnProfile = loggedInUserId === profileUserId;
  const isUserLoggedIn = false

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
          <img
            src="/avatar.png"
            alt="avatar"
            className="w-28 h-28 rounded-full border-2 border-red-500 object-cover"
          />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">
              Sahil Singh
            </h1>
            <p className="text-slate-400">@sahil</p>

            <p className="text-slate-300 mt-2 max-w-lg">
              Competitive programmer · Backend Engineer
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            { isUserLoggedIn  
                && (isOwnProfile ? (
                    <>
                        <Button variant="secondary">Edit Profile</Button>
                        <Button variant="ghost">Share</Button>
                    </>
                    ) : (
                    <>
                        <Button variant="primary">Follow</Button>
                        <Button variant="secondary">Message</Button>
                    </>
                    )) 
            }
          </div>
        </section>

        {/* STATS */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat title="Contests Played" value="12" />
          <Stat title="Problems Solved" value="340" />
          <Stat title="Accuracy" value="72%" />
          <Stat title="Avg Time / Q" value="3m 20s" />
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
            {activeTab === TABS.ACTIVITY && <ActivityTab />}
            {activeTab === TABS.COLLECTIONS && <CollectionsTab />}
            {activeTab === TABS.FOLLOWERS && <FollowersTab />}
          </div>
        </section>

      </div>
    </div>
  );
}

/* ---------------- TAB CONTENT ---------------- */

function ActivityTab() {
  return (
    <div className="space-y-4">
      <ActivityRow title="DSA Sprint #12" score="420" rank="5 / 48" />
      <ActivityRow title="Graphs Weekly" score="460" rank="2 / 34" />
    </div>
  );
}

function CollectionsTab() {
  return (
    <div className="text-slate-400">
      Collections will appear here.
    </div>
  );
}

function FollowersTab() {
  return (
    <div className="text-slate-400">
      Followers list will appear here.
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function Stat({ title, value }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium transition
        ${
          active
            ? "text-white border-b-2 border-red-500"
            : "text-slate-400 hover:text-white"
        }`}
    >
      {label}
    </button>
  );
}

function ActivityRow({ title, score, rank }) {
  return (
    <div className="flex items-center justify-between bg-slate-800/40 rounded-lg p-4">
      <div>
        <p className="text-white font-medium">{title}</p>
        <p className="text-slate-400 text-sm">Rank {rank}</p>
      </div>
      <span className="text-slate-200 font-semibold">{score}</span>
    </div>
  );
}

export default MyProfile;
