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

function LiveContest() {
  const containerRef = useRef(null);
  const enteredRef = useRef(false);
  const joinedRef = useRef(false);
  const hydratedRef = useRef(false);
  const chatWindowRef = useRef(null); // Ref for chat animation

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

  // UI STATES for Responsiveness
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
    if (e) e.preventDefault(); // Handle both button click and form submit
    const payload = {
      attempts: Object.values(attempts)
    };

    try {
      await submitContestService(contestId, payload);
      toast.success("Contest Submitted");
      navigate('/user/dashboard');
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

  // Fetch contest once
  useEffect(() => {
    fetchContest();
  }, [contestId]);

  // socket event
  useEffect(() => {
    if (!socket || !contestId) return;
    if (joinedRef.current) return;

    joinedRef.current = true;
    socket.emit("contest:live:join", { contestId });

    return () => {
      socket.emit("contest:live:leave", { contestId });
    };
  }, [contestId]);

  // mount attempts from local storage on refresh
  useEffect(() => {
    const cached = localStorage.getItem(`contest:${contestId}:attempts`);
    if (cached) {
      setAttempts(JSON.parse(cached));
    }
  }, [contestId]);

  // local storage backup for attempts
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


  // logs user into contest : timer starts
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


  // timer logic
  useEffect(() => {
    if (!contest?.startsAt) return;

    const endTime = new Date(endsAt).getTime();

    const update = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    update(); // immediate
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

  // Initial Animation
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

  // Chat Window Animation
  useGSAP(() => {
    if (isChatOpen) {
      gsap.fromTo(chatWindowRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.2)" }
      );
    }
  }, [isChatOpen]);

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">

      {/* --- TOP BAR (Redesigned) --- */}
      <header className="relative flex items-center justify-between px-4 md:px-6 h-16 border-b border-slate-700 bg-slate-900 z-30 shrink-0">
        
        {/* LEFT: Menu (Mobile) & Title */}
        <div className="flex items-center gap-3 z-10">
          <button 
            onClick={() => setIsQuestionNavOpen(!isQuestionNavOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            <i className={isQuestionNavOpen ? "ri-close-line text-xl" : "ri-menu-2-line text-xl"}></i>
          </button>

          <div className="flex flex-col">
            <h1 className="font-semibold text-sm md:text-lg truncate max-w-[150px] md:max-w-xs">
              {contest?.title}
            </h1>
            <span className="text-[10px] md:text-xs text-slate-400">
              {isGroupContest ? "Group Contest" : "Solo Contest"}
            </span>
          </div>
        </div>

        {/* CENTER: Timer (Absolute Center) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div
            className={`px-3 py-1 md:px-4 md:py-2 rounded-md font-mono text-sm md:text-lg font-bold shadow-lg ${
              isDanger ? "bg-red-600 animate-pulse" : "bg-slate-800"
            }`}
          >
            {minutes} MIN :{seconds.toString().padStart(2, "0")} SEC
          </div>
        </div>

        {/* RIGHT: Submit Button */}
        <div className="z-10">
          <Button 
            variant="danger" 
            onClick={submitContest}
            disabled={timeLeft === 0}
            className="text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2"
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
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsQuestionNavOpen(false)}
          />
        )}
        
        <aside className={`
          absolute inset-y-0 left-0 z-20 w-64 bg-slate-900 border-r border-slate-700 
          transform transition-transform duration-300 ease-in-out
          md:relative md:transform-none md:flex flex-col
          ${isQuestionNavOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="p-4 space-y-3 overflow-y-auto h-full">
            <p className="text-sm text-slate-400 mb-2 font-medium">Questions List</p>

            {contestQuestions?.map((q, idx) => (
              <button
                key={q._id}
                onClick={() => {
                  setActiveQuestion(idx);
                  setIsQuestionNavOpen(false); // Close drawer on mobile selection
                }}
                className={`w-full text-left px-4 py-3 rounded-md transition border border-transparent
                  ${
                    idx === activeQuestion
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate text-sm font-medium">Q{idx + 1}. {q.title}</span>
                  <DifficultyDot status={q.difficulty} />
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ACTIVE QUESTION AREA */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 bg-slate-900/50">
          
          {contestQuestions && (
            <>
              {/* Question Header */}
              <div className="border-b border-slate-700/50 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {contestQuestions[activeQuestion].title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 mt-3 text-sm">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium capitalize">
                    {contestQuestions[activeQuestion].platform}
                  </span>
                  <span className={`px-2.5 py-1 rounded font-medium capitalize 
                    ${contestQuestions[activeQuestion].difficulty === 'easy' ? 'bg-green-500/10 text-green-500' : 
                      contestQuestions[activeQuestion].difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`
                  }>
                    {contestQuestions[activeQuestion].difficulty}
                  </span>
                </div>
              </div>

              {/* Action Box */}
              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-slate-200">
                    Solve this problem on the original platform
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Click the button to open the problem in a new tab
                  </p>
                </div>

                <a
                  href={contestQuestions[activeQuestion].problemUrlOriginal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition flex items-center gap-2 shadow-lg shadow-red-900/20"
                >
                  Solve Problem <i className="ri-external-link-line"></i>
                </a>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-2">
                 <p className="text-sm text-slate-400 mb-3">Update your status:</p>
                 <div className="flex flex-wrap gap-3">
                  <Button 
                    className="border border-slate-600 bg-transparent hover:bg-slate-800 text-slate-300" 
                    onClick={() => markAttempt("unsolved")}
                  >
                    <i className="ri-time-line mr-2"></i> Mark Attempted
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => markAttempt("solved")}
                  >
                    <i className="ri-check-line mr-2"></i> Mark Solved
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Footer Info inside scroll area */}
          <div className="mt-10 pt-6 border-t border-slate-800 text-center md:text-left text-xs text-slate-500">
            Progress is auto-saved locally · System auto-submits when timer ends
          </div>
        </main>
      </div>

      {/* --- FLOATING CHAT SYSTEM (Group Contest Only) --- */}
      {isGroupContest && (
        <>
          {/* 1. Floating Chat Window */}
{isChatOpen && (
  <div 
    ref={chatWindowRef}
    className="fixed bottom-20 right-4 w-[90vw] md:w-96 h-[60vh] md:h-[500px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
  >
    {/* Header */}
    <div className="h-12 bg-slate-800 px-4 flex items-center justify-between border-b border-slate-700 shrink-0">
      <span className="font-semibold text-white flex items-center gap-2">
        <i className="ri-chat-3-line text-red-500"></i> Live Chat
      </span>
      <button 
        onClick={() => setIsChatOpen(false)}
        className="text-slate-400 hover:text-white"
      >
        <i className="ri-close-line text-xl"></i>
      </button>
    </div>
    
    {/* Messages Area Wrapper */}
    {/* FIX IS HERE: Added 'flex flex-col' so the inner component can scroll */}
    <div className="flex-1 bg-slate-900/95 overflow-hidden flex flex-col">
      <MessagesArea messages={messages} currentUserId={user._id} />
    </div>

    {/* Input */}
    {chatEnabled && (
      <div className="bg-slate-900 p-2 border-t border-slate-800 shrink-0">
        <MessageInput onSend={(msg) => send(msg)} />
      </div>
    )}
  </div>
)}

          {/* 2. Floating Action Button (Toggle) */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`
              fixed bottom-16 right-4 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300
              ${isChatOpen ? "bg-slate-700 rotate-90" : "bg-red-600 hover:bg-red-500"}
            `}
          >
            {isChatOpen ? (
              <i className="ri-close-line text-2xl text-white"></i>
            ) : (
              <div className="relative">
                <i className="ri-message-3-line text-2xl text-white"></i>
                {/* Optional: Add unread badge here if needed */}
              </div>
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