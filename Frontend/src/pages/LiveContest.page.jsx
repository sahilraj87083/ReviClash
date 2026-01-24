import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "../components";
import { useSocketContext } from "../contexts/socket.context";
import { useParams , useNavigate} from "react-router-dom";
import { getContestByIdService } from "../services/contest.services";
import { enterLiveContestService } from "../services/contestParticipant.service";
import toast from "react-hot-toast";


function LiveContest() {
  const containerRef = useRef(null);
  const {contestId} = useParams()

  const navigate = useNavigate()
  const { socket } = useSocketContext()

  const [contest, setContest] = useState()
  const [contestQuestions, setContestQuestions] = useState()
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [endsAt, setEndsAt] = useState(null);
  const [startedAt, setStartedAt] = useState(null)


  // contest state
  const contestStatus = contest?.status; // live | ended
  const isGroupContest = contest?.visibility === "shared";
  const chatEnabled = isGroupContest && contestStatus === "live";

  // timer 
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isDanger = timeLeft < 300;



  const fetchContest = async () => {
      const contest = await getContestByIdService(contestId);
      setContest(contest);
      setContestQuestions(contest.questions);
  };

  // Fetch contest once
  useEffect( ()=>{
      fetchContest();
  }, [contestId])

  // socket event
  useEffect(() => {
    socket.emit("join-contest-live", { contestId });

    return () => {
      socket.emit("leave-contest-live", { contestId });
    };
  }, [contestId]);

  
  // logs user into contest : timer starts
  useEffect(() => {
    if (!contest) return;
    if (contest.status !== "live") return;

    const enterContest = async () => {
        const data = await enterLiveContestService(contestId);
        setEndsAt(data.endsAt);
        setStartedAt(data.startedAt)
    }

    enterContest()
  }, [contest?.status]);

  
  // timer logic
  useEffect(() => {
    if (!contest?.startsAt) return;

    const endTime = new Date(endsAt).getTime();

    const update = () => {
      const remaining = Math.max( 0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    update(); // immediate
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  useEffect( () => {
    if(endsAt !== 0) return

    toast.success("Contest Submitted")
    navigate('user/dashboard')

  }, [endsAt])


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


  return (
    <div className="h-[90vh] bg-slate-900 text-white flex flex-col">

      {/* TOP BAR */}
      <header className="flex items-center justify-between px-6 h-16 border-b border-slate-700">
        <div>
            <div className="flex items-center gap-3">
                <h1 className="font-semibold text-lg">
                {contest?.title}
                </h1>

                <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400">
                {isGroupContest ? "Group Contest" : "Solo Contest"}
                </span>
            </div>

            <p className="text-xs text-slate-400">
                Live Contest
            </p>
        </div>


        <div
          className={`px-4 py-2 rounded-md font-mono text-lg ${
            isDanger ? "bg-red-600" : "bg-slate-800"
          }`}
        >
          {minutes} MIN : {seconds.toString().padStart(2, "0")} SEC
        </div>
      </header>

      {/* MAIN */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">

        {/* QUESTION NAV */}
        <aside className="w-64 border-r border-slate-700 p-4 space-y-3 overflow-y-auto">
          <p className="text-sm text-slate-400 mb-2">Questions</p>

          {contestQuestions?.map((q, idx) => {
            return (
              <button
              key={q._id}
              onClick={() => setActiveQuestion(idx)}
              className={`w-full text-left px-4 py-3 rounded-md transition
                ${
                  idx === activeQuestion
                    ? "bg-slate-700"
                    : "hover:bg-slate-800"
                }
              `}
            >
              <div className="flex justify-between items-center">
                <span>{idx + 1}. {q.title}</span>
                <DifficultyDot status={q.difficulty} />
              </div>
            </button>
            )
          })}
        </aside>

        {/* QUESTION AREA */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">

          <div>
            <h2 className="text-xl font-semibold">
              {contestQuestions && contestQuestions[activeQuestion].title}
              
            </h2>

            <div className="flex items-center gap-3 mt-1 text-sm">
              <span className="px-2 py-0.5 rounded bg-slate-800">
                {contestQuestions && contestQuestions[activeQuestion].platform}
              </span>
              <span className="text-slate-400">
                { contestQuestions && contestQuestions[activeQuestion].difficulty}
              </span>
            </div>
          </div>

          {/* SOLVE LINK */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">
                Solve on original platform
              </p>
              <p className="text-xs text-slate-400">Opens in new tab</p>
            </div>

            <a
              href={contestQuestions? contestQuestions[activeQuestion].problemUrlOriginal : ""}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition font-medium"
            >
              Open Problem ↗
            </a>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <Button variant="secondary">Mark Attempted</Button>
            <Button variant="primary">Mark Solved</Button>
          </div>
        </main>

        
        {/* CHAT PANEL */}
        {
          isGroupContest && (
            <aside className="w-80 border-l border-slate-700 flex flex-col h-full">

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-700 font-medium">
            Chat
        </div>

        {/* Messages (scrollable, constrained) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-slate-400">
            {chatEnabled
            ? "Chat messages will appear here"
            : "Chat is disabled during contest"}
        </div>

        {/* Input Area (ALWAYS visible, never below screen) */}
        {chatEnabled && (
            <div className="px-3 py-3 border-t border-slate-700 bg-slate-900">
                
            <div className="flex items-center gap-2">
                <input
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700
                            focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <Button
                className="p-2 rounded-md bg-red-600 hover:bg-red-500 transition
                            flex items-center justify-center"
                >
                <i className="ri-send-ins-fill"></i>
                </Button>
            </div>
            </div>
        )}
        </aside>
          )
        }



      </div>

      {/* BOTTOM BAR */}
      <form className="h-16 px-6 border-t border-slate-700 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Progress auto-saved · Auto-submit on time end
        </p>

        <Button variant="danger" type = "submit">
          Submit Contest
        </Button>
      </form>
    </div>
  );
}

/* ---------- Helpers ---------- */

function DifficultyDot({ status }) {
  const colors = {
    easy: "bg-green-500",
    medium: "bg-yellow-400",
    hard: "bg-red-600",
  };

  return (
    <span className={`w-3 h-3 rounded-full ${colors[status]}`} />
  );
}

export default LiveContest;
