import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Button,
  StatCard,
  ActionCard,
  RecentRow
} from "../components";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const containerRef = useRef(null);
  const navigate = useNavigate()

  useGSAP(() => {
    gsap.from(containerRef.current.children, {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  const user = {
    name: "Sahil",
    bio: "DSA enthusiast • Building consistency daily 🚀",
    cover:
      "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000",
  };

  const HandleCollectionClick = () => {
    navigate('/user/collections')
  }
  const HandleQuestionClick = () => {
    navigate('/user/questions')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div ref={containerRef} className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* HERO / PROFILE SECTION */}
        <section className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-700">

          {/* Cover Image */}
          <div
            className="h-40 w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1517433456452-f9633a875f6f)",
            }}
          />

          {/* Content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-6 py-5">

            {/* Left: Profile */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xl font-bold text-white">
                S
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Sahil Singh
                </h1>
                <p className="text-slate-400 text-sm">
                  AI & Backend Developer · DSA Enthusiast
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Welcome back! Ready to clash your skills today ⚔️
                </p>
              </div>
            </div>

            {/* Right: Quick Links */}
            <div className="flex gap-3">
              <Button variant="secondary" onClick = {HandleQuestionClick}>
                My Questions
              </Button>
              <Button variant="secondary" onClick = {HandleCollectionClick}>
                My Collections
              </Button>
            </div>
          </div>
        </section>


        {/* STATS */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Contests Played" value="12" />
          <StatCard title="Problems Solved" value="340" />
          <StatCard title="Accuracy" value="72%" />
          <StatCard title="Avg Time / Q" value="3m 20s" />
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard
              title="Create Collection"
              desc="Organize problems from different platforms."
              action="Create"
            />
            <ActionCard
              title="Host a Contest"
              desc="Generate a contest from your collection."
              action="Host"
            />
            <ActionCard
              title="Join Contest"
              desc="Enter a contest using code or link."
              action="Join"
            />
          </div>
        </section>

        {/* RECENT CONTESTS */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Contests
          </h2>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden">
            <RecentRow title="DSA Sprint #12" score="420" rank="5 / 48" />
            <RecentRow title="Binary Search Battle" score="380" rank="9 / 61" />
            <RecentRow title="Graphs Weekly" score="460" rank="2 / 34" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
