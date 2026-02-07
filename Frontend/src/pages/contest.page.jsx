import { useRef, useState, useEffect } from "react";
import { Input, Button, Select, ContestRow } from "../components";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getActiveContestsService, getAllContestsService } from "../services/contest.services";
import { getMyCollections } from "../services/collection.service";
import { createContestService } from "../services/contest.services";
import { joinContestService } from "../services/contestParticipant.service";
import { useSocketContext } from "../contexts/socket.context";
import toast from "react-hot-toast";
import { 
    Trophy, 
    Plus, 
    Zap, 
    LayoutList, 
    ArrowRight,
    AlertCircle // Added for warning icon
} from "lucide-react";

function Contests() {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const createFormRef = useRef(null);
    const joinFormRef = useRef(null);
    const heroRef = useRef(null);
    const actionRef = useRef(null);
    const navRef = useRef(null);
    const activeRef = useRef(null);
    const allCache = useRef(null);

    const { socket } = useSocketContext();

    // join contest by code 
    const [contestCode, setContestCode] = useState("");

    // create contest 
    const [collections, setCollections] = useState([]);
    const [collectionOptions, setCollectionOptions] = useState([]);
    const [contestCollectionId, setContestCollectionId] = useState("");
    const [contestTitle, setContestTitle] = useState("");
    const [contestQuestionCount, setContestQuestionCount] = useState(1);
    const [contestDuration, setContestDuration] = useState(90);
    const [contestVisibility, setContestVisiblity] = useState("private");

    // Find the currently selected collection object to access its details
    const selectedCollection = collections.find(c => c._id === contestCollectionId);

    const [activeContests, setActiveContests] = useState([]);
    const [allContests, setAllContests] = useState([]);
    
    const location = useLocation();
    const tab = new URLSearchParams(location.search).get("tab");

    useEffect(() => {
      if (!tab) return;
      const map = {
        create: createFormRef,
        join: joinFormRef
      };
      map[tab]?.current?.scrollIntoView({ behavior: "smooth" });
    }, [tab]);

    useEffect(() => {
      (async () => {
          try {
            const [contestData, collectionsData] = await Promise.all([
                getActiveContestsService(),
                getMyCollections()
            ]);

            setActiveContests(contestData.contests || []); 
            setCollections(collectionsData);
            setCollectionOptions(collectionsData.map((c) => ({
                label: `${c.name} (${c.questionsCount || 0} qs)`, // Show count in dropdown for clarity
                value: c._id,
            })));
          } catch (error) {
            console.error("Failed to load data", error);
          }
      })();
    }, []);

    const DURATION_OPTIONS = [
        { label: "30 Minutes", value: 30 },
        { label: "60 Minutes", value: 60 },
        { label: "90 Minutes", value: 90 },
        { label: "120 Minutes", value: 120 },
    ];

    const VISIBILITY_OPTIONS = [
        { label: "Private (Invite only)", value: "private" },
        { label: "Shared (With code)", value: "shared" },
        { label: "Public (Discoverable)", value: "public" },
    ];

    const createContestHandler = async (e) => {
        e.preventDefault();

        // --- VALIDATION CHECKS START ---
        if (!selectedCollection) {
            toast.error("Please select a collection first.");
            return;
        }

        if (selectedCollection.questionsCount === 0) {
            toast.error("This collection is empty! Add questions to it before creating a contest.");
            return; // STOP EXECUTION HERE
        }

        if (contestQuestionCount > selectedCollection.questionsCount) {
             toast.error(`You only have ${selectedCollection.questionsCount} questions in this collection.`);
             return;
        }
        // --- VALIDATION CHECKS END ---

        const data = {
            title: contestTitle,
            questionCount: contestQuestionCount,
            durationInMin: contestDuration,
            visibility: contestVisibility,
            collectionId: contestCollectionId
        };
        
        try {
            const contest = await createContestService(data);
            if (contest.visibility === "private") {
              navigate(`/user/contests/private/${contest._id}`);
            } else {
              navigate(`/user/contests/public/${contest._id}`);
            }
        } catch (error) {
            console.error(error);
            // toast.error is handled in service usually, but good to have fallback
        }
    };

    const joinContesthandler = async (e) => {
        e.preventDefault();
        try {
          setContestCode("");
          const participant = await joinContestService(contestCode);
          if(!participant){
            toast.error("You can't join private contest");
            navigate('/user/contests');
            return;
          }
          socket.emit("join-contest", { contestId: participant.contestId });
          navigate(`/user/contests/public/${participant.contestId}`);
        } catch (error) {
            console.log("contest is private ",error);
            toast.error("Contest Already Started or Invalid Code");
        }
    };

    const navigateToContest = (contest) => {
      if (contest.status === "upcoming") {
          if (contest.visibility === "private") {
              navigate(`/user/contests/private/${contest._id}`);
          } else {
              navigate(`/user/contests/public/${contest._id}`);
          }
      }
      if (contest.status === "live") {
          navigate(`/contests/${contest._id}/live`);
      }
      if (contest.status === "ended") {
          navigate(`/contests/${contest._id}/leaderboard`);
      }
    };

    useGSAP(() => {
        gsap.from(heroRef.current.children, {
          y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        });
        gsap.from(actionRef.current.children, {
          y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2,
        });
        gsap.from(navRef.current.children, {
          y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.4,
        });
    }, { scope: containerRef });

  return (
    <div className="min-h-screen bg-slate-950 px-4 pt-20 md:pt-24 pb-20 relative selection:bg-red-500/30">
        
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

      <div ref={containerRef} className="relative z-10 max-w-6xl mx-auto space-y-12">

        {/* HERO SECTION */}
        <section ref={heroRef} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-medium text-red-400 mb-2">
             <Trophy size={14} /> Contest Arena
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Compete. Practice. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Improve.</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Join ongoing battles or create your own custom contests to challenge friends and climb the leaderboard.
          </p>
        </section>

        {/* ACTION GRID */}
        <section ref={actionRef} className="grid md:grid-cols-2 gap-8">

            {/* JOIN CONTEST CARD */}
            <div ref={joinFormRef} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors shadow-2xl shadow-black/20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-500">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Join a Contest</h2>
                        <p className="text-sm text-slate-500">Enter a code to enter a private lobby.</p>
                    </div>
                </div>

                <form onSubmit={joinContesthandler} className="space-y-6">
                    <Input
                        label="Contest Code"
                        placeholder="e.g. 7890-XYZ"
                        value={contestCode}
                        onChange={(e) => setContestCode(e.target.value)}
                        required
                        className="bg-slate-950 border-slate-800 focus:border-blue-500"
                    />

                    <Button type='submit' variant="primary" className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                        Enter Arena
                    </Button>
                    
                    <div className="text-center">
                         <p className="text-xs text-slate-500">
                            Looking for public contests? <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => navigate('/explore')}>Browse here.</span>
                         </p>
                    </div>
                </form>
            </div>

            {/* CREATE CONTEST CARD */}
            <div ref={createFormRef} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors shadow-2xl shadow-black/20 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 blur-[80px] rounded-full"></div>

                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2.5 bg-red-500/10 rounded-lg text-red-500">
                        <Plus size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Create Contest</h2>
                        <p className="text-sm text-slate-500">Host a battle with your own rules.</p>
                    </div>
                </div>

                <form onSubmit={createContestHandler} className="space-y-5 relative z-10">
                    <Input
                        label="Contest Title"
                        placeholder="e.g. Weekend Graph Bash"
                        value={contestTitle}
                        onChange={(e) => setContestTitle(e.target.value)}
                        required
                        className="bg-slate-950 border-slate-800"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <Select
                            label="Collection"
                            value={contestCollectionId}
                            onChange={(e) => setContestCollectionId(e.target.value)}
                            options={collectionOptions}
                            placeholder="Select..."
                            required
                        />
                         <Select
                            label="Visibility"
                            value={contestVisibility}
                            onChange={(e) => setContestVisiblity(e.target.value)}
                            options={VISIBILITY_OPTIONS}
                        />
                    </div>

                    {/* Show warning if empty collection selected */}
                    {selectedCollection && selectedCollection.questionsCount === 0 && (
                         <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                             <AlertCircle size={16} className="mt-0.5 shrink-0" />
                             <p>This collection is empty. Please add questions to it before creating a contest.</p>
                         </div>
                    )}

                    <div className="grid grid-cols-2 gap-5">
                        <Input
                            label="Questions"
                            type="number"
                            min={1}
                            // Important: If empty, max is 0. If undefined, max is 5 (fallback)
                            max={selectedCollection ? selectedCollection.questionsCount : 5}
                            value={contestQuestionCount}
                            onChange={(e) => setContestQuestionCount(e.target.value)}
                            className="bg-slate-950 border-slate-800"
                            disabled={selectedCollection?.questionsCount === 0} // Disable if empty
                        />
                        <Select
                            label="Duration"
                            value={contestDuration}
                            onChange={(e) => setContestDuration(e.target.value)}
                            options={DURATION_OPTIONS}
                        />
                    </div>

                    <Button 
                        type='submit' 
                        variant="primary" 
                        // Disable button if empty collection
                        disabled={selectedCollection?.questionsCount === 0}
                        className={`w-full h-12 text-base font-semibold shadow-lg shadow-red-900/20 ${selectedCollection?.questionsCount === 0 ? 'bg-slate-700 cursor-not-allowed opacity-50' : 'bg-red-600 hover:bg-red-500'}`}
                    >
                        Launch Contest
                    </Button>
                </form>
            </div>
        </section>
        
        {/* DASHBOARD NAVIGATION */}
        <section ref={navRef} className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <LayoutList size={20} className="text-slate-400" /> Your Dashboard
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div onClick={() => navigate("/contests/all")} 
                     className="group cursor-pointer bg-slate-900 border border-slate-800 p-6 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-between">
                    <div>
                        <h4 className="text-white font-semibold">All History</h4>
                        <p className="text-xs text-slate-400 mt-1">View past performance</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>

                <div onClick={() => navigate("/contests/created")} 
                     className="group cursor-pointer bg-slate-900 border border-slate-800 p-6 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-between">
                    <div>
                        <h4 className="text-white font-semibold">Created</h4>
                        <p className="text-xs text-slate-400 mt-1">Manage your lobbies</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>

                <div onClick={() => navigate("/contests/joined")} 
                     className="group cursor-pointer bg-slate-900 border border-slate-800 p-6 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-between">
                    <div>
                        <h4 className="text-white font-semibold">Joined</h4>
                        <p className="text-xs text-slate-400 mt-1">Track participated events</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </section>

        {/* ACTIVE CONTESTS LIST */}
        <section ref={activeRef} className="space-y-6 pt-6 border-t border-slate-800/50">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Live & Upcoming
                </h2>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden min-h-[150px]">
                {activeContests.length > 0 ? (
                    <div className="divide-y divide-slate-800/50">
                        {activeContests.map((c) => (
                            <ContestRow key={c._id} contest={c} onNavigate={navigateToContest} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2">
                        <Trophy size={40} strokeWidth={1} className="opacity-50" />
                        <p className="text-sm">No active contests found.</p>
                        <p className="text-xs text-slate-600">Create one to get started!</p>
                    </div>
                )}
            </div>
        </section>

      </div>
    </div>
  );
}

export default Contests;