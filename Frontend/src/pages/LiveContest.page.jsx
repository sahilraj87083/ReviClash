import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "../components";
import { useSocketContext } from "../contexts/socket.context";
import { useParams, useNavigate } from "react-router-dom";
import { getContestByIdService } from "../services/contest.services";
import { enterLiveContestService, submitContestService } from "../services/contestParticipant.service";
import toast from "react-hot-toast";
import { useContestChat } from "../hooks/useContestChat";
import MessagesArea from '../components/messageComponents/MessagesArea';
import MessageInput from '../components/messageComponents/MessageInput';
import { useUserContext } from "../contexts/UserContext";
import { 
  Menu, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  MessageSquare 
} from "lucide-react";

function LiveContest() {
  const containerRef = useRef(null);
  const enteredRef = useRef(false);
  const joinedRef = useRef(false);
  const hydratedRef = useRef(false);
  const chatWindowRef = useRef(null); 

  const { contestId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocketContext();
  const { user } = useUserContext();

  const [contest, setContest] = useState();
  const [contestQuestions, setContestQuestions] = useState();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [endsAt, setEndsAt] = useState(null);
  const [startedAt, setStartedAt] = useState(null);

  // UI STATES
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isQuestionNavOpen, setIsQuestionNavOpen] = useState(false);

  const { messages, send } = useContestChat({ contestId, phase: 'live' });

  // contest state
  const contestStatus = contest?.status;
  const isGroupContest = contest?.visibility === "shared";
  const chatEnabled = isGroupContest && contestStatus === "live";

  // timer 
  const safeTime = timeLeft ?? 0;
  const minutes = Math.floor(safeTime / 60);
  const seconds = safeTime % 60;
  const isDanger = timeLeft < 300;

  const [attempts, setAttempts] = useState({});

  const markAttempt = (status) => {
    const q = contestQuestions[activeQuestion];
    if (!q) return;

    const timeSpent = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);

    setAttempts(prev => ({
      ...prev,
      [q._id]: {
        questionId: q._id,
        status,
        timeSpent: timeSpent,
      }
    }));
  };

  const submitContest = async (e) => {
    if (e) e.preventDefault(); 
    const payload = {
      attempts: Object.values(attempts)
    };

    try {
      await submitContestService(contestId, payload);
      toast.success("Contest Submitted");
      navigate(`/contests/${contestId}/leaderboard`);
      localStorage.removeItem(`contest:${contestId}:attempts`);
    } catch (error) {
      toast.error("Try again");
    }
  };

  const fetchContest = async () => {
    try {
      const contest = await getContestByIdService(contestId);
      if (contest.status === 'ended') {
        toast.error('Contest Already Submitted');
        navigate('/user/dashboard');
      }
      if (contest.status === 'upcoming') {
        const mode = contest.visibility === "shared" ? 'public' : 'private';
        toast.error('contest has not started yet');
        navigate(`/user/contests/${mode}/${contestId}`);
      }
      setContest(contest);
      setContestQuestions(contest.questions);
    } catch (error) {
      toast.error("No Contest Found");
      navigate('/user/contests');
    }
  };

  useEffect(() => {
    fetchContest();
  }, [contestId]);

  useEffect(() => {
    if (!socket || !contestId) return;
    if (joinedRef.current) return;

    joinedRef.current = true;
    socket.emit("contest:live:join", { contestId });

    return () => {
      socket.emit("contest:live:leave", { contestId });
    };
  }, [contestId]);

  useEffect(() => {
    const cached = localStorage.getItem(`contest:${contestId}:attempts`);
    if (cached) {
      setAttempts(JSON.parse(cached));
    }
  }, [contestId]);

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    localStorage.setItem(
      `contest:${contestId}:attempts`,
      JSON.stringify(attempts)
    );
  }, [contestId, attempts]);


  useEffect(() => {
    if (!contest) return;
    if (contest.status !== "live") return;
    if (enteredRef.current) return;

    enteredRef.current = true;

    (async () => {
      try {
        const data = await enterLiveContestService(contestId);
        if (data.subsubmissionStatus === 'submitted') {
          toast.error("Contest Already Submitted");
          navigate('/user/dashboard');
        }
        setEndsAt(data.endsAt);
        setStartedAt(data.startedAt);
      } catch (err) {
        toast.error("Failed to start contest");
        navigate('/user/contests');
      }
    })();
  }, [contest?.status]);


  useEffect(() => {
    if (!contest?.startsAt) return;

    const endTime = new Date(endsAt).getTime();

    const update = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    update(); 
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  useEffect(() => {
    if (timeLeft === 0 && contest?.status === "live") {
      submitContestService(contestId, { attempts: Object.values(attempts) })
        .finally(() => {
          localStorage.removeItem(`contest:${contestId}:attempts`);
          toast.success("Contest auto-submitted");
          navigate("/user/dashboard");
        });
    }
  }, [timeLeft]);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  useGSAP(() => {
    if (isChatOpen) {
      gsap.fromTo(chatWindowRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.2)" }
      );
    }
  }, [isChatOpen]);

  return (
    // FIX 1: Corrected typo 'ovehiddenrflow-' -> 'overflow-hidden'
    // FIX 2: Added 'z-40' to ensure it sits above the footer/other content
    <div className="fixed inset-0 pt-16 md:pt-20 bg-slate-900 text-white flex flex-col overflow-hidden z-40">

      {/* --- TOP BAR --- */}
      <header className="relative flex items-center justify-between px-4 md:px-6 h-16 border-b border-slate-700 bg-slate-900/95 backdrop-blur z-30 shrink-0 shadow-sm">
        
        {/* LEFT: Menu (Mobile) & Title */}
        <div className="flex items-center gap-3 z-10">
          <button 
            onClick={() => setIsQuestionNavOpen(!isQuestionNavOpen)}
            className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            {isQuestionNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex flex-col">
            <h1 className="font-semibold text-sm md:text-lg truncate max-w-[150px] md:max-w-xs flex items-center gap-2">
              {contest?.title}
            </h1>
            <span className="text-[10px] md:text-xs text-slate-400 flex items-center gap-1">
              {isGroupContest ? "Group Battle" : "Solo Sprint"}
            </span>
          </div>
        </div>

        {/* CENTER: Timer (Absolute Center) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-mono text-sm md:text-lg font-bold shadow-lg border border-white/5 ${
              isDanger 
              ? "bg-red-500/10 text-red-500 border-red-500/50 animate-pulse" 
              : "bg-slate-800 text-white"
            }`}
          >
            <Clock size={16} className={isDanger ? "animate-spin" : ""} />
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        </div>

        {/* RIGHT: Submit Button */}
        <div className="z-10">
          <Button 
            variant="danger" 
            onClick={submitContest}
            disabled={timeLeft === 0}
            className="text-xs md:text-sm px-4 py-2 shadow-lg shadow-red-900/20"
          >
            Submit
          </Button>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden relative">

        {/* QUESTION NAV (Responsive Drawer) */}
        {/* Overlay for mobile */}
        {isQuestionNavOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity"
            onClick={() => setIsQuestionNavOpen(false)}
          />
        )}
        
        <aside className={`
          absolute inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-700 
          transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          md:relative md:transform-none md:flex flex-col
          ${isQuestionNavOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
             <h3 className="font-semibold text-white">Problem List</h3>
             <p className="text-xs text-slate-400 mt-1">{contestQuestions?.length} Problems</p>
          </div>

          <div className="p-3 space-y-2 overflow-y-auto flex-1">
            {contestQuestions?.map((q, idx) => (
              <button
                key={q._id}
                onClick={() => {
                  setActiveQuestion(idx);
                  setIsQuestionNavOpen(false); 
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all border
                  ${
                    idx === activeQuestion
                      ? "bg-slate-800 border-slate-600 text-white shadow-md"
                      : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate text-sm font-medium pr-2">Q{idx + 1}. {q.title}</span>
                  <DifficultyDot status={q.difficulty} />
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ACTIVE QUESTION AREA */}
        <main className="flex-1 flex flex-col relative bg-slate-950/50">
          
          {contestQuestions && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              
              {/* Question Header */}
              <div className="border-b border-slate-800 pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    {contestQuestions[activeQuestion].title}
                  </h2>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold capitalize border border-slate-700">
                        {contestQuestions[activeQuestion].platform}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border 
                        ${contestQuestions[activeQuestion].difficulty === 'easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          contestQuestions[activeQuestion].difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`
                    }>
                        {contestQuestions[activeQuestion].difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left space-y-1">
                  <p className="text-base font-medium text-white flex items-center justify-center sm:justify-start gap-2">
                     <ExternalLink size={18} className="text-blue-500" /> Solve on {contestQuestions[activeQuestion].platform}
                  </p>
                  <p className="text-sm text-slate-400">
                    Read the problem statement and submit your code on the external platform.
                  </p>
                </div>

                <a
                  href={contestQuestions[activeQuestion].problemUrlOriginal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-900/20 whitespace-nowrap"
                >
                  Open Problem
                </a>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-4">
                 <p className="text-sm text-slate-400 mb-4 font-medium flex items-center gap-2">
                    <AlertCircle size={16} /> Update your progress:
                 </p>
                 <div className="flex flex-wrap gap-4">
                  <Button 
                    className="border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300" 
                    onClick={() => markAttempt("unsolved")}
                  >
                    Attempted
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-500 border-green-600 shadow-lg shadow-green-900/20" 
                    onClick={() => markAttempt("solved")}
                  >
                    <CheckCircle2 size={18} className="mr-2" /> Mark Solved
                  </Button>
                </div>
              </div>
              
              {/* Padding for bottom scrolling */}
              <div className="h-20 md:h-0"></div>
            </div>
          )}

          {/* Footer Info */}
          <div className="h-10 bg-slate-900 border-t border-slate-800 flex items-center justify-center text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">
            Auto-saving progress • Good Luck!
          </div>
        </main>
      </div>

      {/* --- FLOATING CHAT SYSTEM (Group Contest Only) --- */}
      {isGroupContest && (
        <>
          {/* Chat Window */}
          {isChatOpen && (
            <div 
              ref={chatWindowRef}
              className="fixed bottom-24 right-4 w-[90vw] md:w-96 h-[50vh] md:h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden"
            >
              <div className="h-12 bg-slate-800/80 backdrop-blur px-4 flex items-center justify-between border-b border-slate-700 shrink-0">
                <span className="font-bold text-white flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-500" /> Live Chat
                </span>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-700 text-slate-400 transition"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 bg-slate-950/50 overflow-hidden flex flex-col">
                <MessagesArea messages={messages} currentUserId={user._id} />
              </div>

              {chatEnabled && (
                <div className="p-2 bg-slate-900 border-t border-slate-800 shrink-0">
                  <MessageInput onSend={(msg) => send(msg)} />
                </div>
              )}
            </div>
          )}

          {/* Floating Toggle Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`
              fixed bottom-16 right-3 w-14 h-14 rounded-full shadow-2xl z-50 flex items-center justify-center transition-all duration-300
              ${isChatOpen ? "bg-slate-700 rotate-90" : "bg-blue-600 hover:bg-blue-500 hover:scale-105"}
            `}
          >
            {isChatOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <MessageSquare size={24} className="text-white fill-current" />
            )}
          </button>
        </>
      )}

    </div>
  );
}

/* ---------- Helpers ---------- */

function DifficultyDot({ status }) {
  const colors = {
    easy: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    medium: "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]",
    hard: "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]",
  };

  return (
    <span className={`w-2.5 h-2.5 rounded-full ${colors[status]}`} />
  );
}

export default LiveContest;