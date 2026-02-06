import { useState, useRef, useEffect } from "react";
import { Button, PublicMetaCards } from "../components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useParams, useNavigate } from "react-router-dom";
import { getContestByIdService, startContestService } from "../services/contest.services";
import { getAllParticipantsService, leaveContestService } from "../services/contestParticipant.service";
import { useUserContext } from "../contexts/UserContext";
import { useSocketContext } from "../contexts/socket.context";
import toast from 'react-hot-toast';
import { useContestChat } from "../hooks/useContestChat";
import MessagesArea from '../components/messageComponents/MessagesArea';
import MessageInput from '../components/messageComponents/MessageInput';

function GroupContestLobby() {
  const containerRef = useRef(null);
  const chatModalRef = useRef(null);

  const [contest, setContest] = useState();
  const [participants, setParticipants] = useState();
  const [contestQuestions, setContestQuestions] = useState();
  
  const [isChatOpen, setIsChatOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useUserContext();
  const { socket } = useSocketContext();

  const isHost = user?._id === contest?.owner?._id;
  const chatEnabled = contest?.status !== "live";

  const { contestId } = useParams();

  const { messages, send } = useContestChat({
    contestId,
    phase: "lobby",
  });

  const fetchContest = async () => {
    try {
      const contest = await getContestByIdService(contestId);
      setContest(contest);
      setContestQuestions(contest.questions);

      if (contest.status === 'live') navigate(`/contests/${contestId}/live`);
      if (contest?.status === 'ended') navigate('/user/contests');

    } catch (error) {
      toast.error("Contest not found");
      navigate('/user/contests');
    }
  };

  useEffect(() => {
    fetchContest();
  }, [contestId]);

  useEffect(() => {
    let interval;
    const fetchParticipants = async () => {
      const data = await getAllParticipantsService(contestId);
      setParticipants(data);
    };
    fetchParticipants();
    interval = setInterval(fetchParticipants, 5000);
    return () => clearInterval(interval);
  }, [contestId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("contest:lobby:join", { contestId });
    return () => {
      socket.emit("contest:lobby:leave", { contestId });
    };
  }, [contestId, socket]);

  const leaveContest = async () => {
    await leaveContestService(contest._id);
    socket.emit("contest:lobby:leave", { contestId: contest._id });
    navigate("/user/contests");
  };

  const startContestHandler = async () => {
    await startContestService(contest._id);
    socket.emit("contest:system", {
      contestId,
      message: "Contest started",
      phase: "lobby",
    });
  };

  useEffect(() => {
    if (!socket) return;
    const handleStart = ({ contestId }) => {
      navigate(`/contests/${contestId}/live`);
    };
    socket.on("contest:started", handleStart);
    return () => {
      socket.off("contest:started", handleStart);
    };
  }, [socket, navigate]);

  useGSAP(() => {
    gsap.from(containerRef.current.children, {
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  useGSAP(() => {
    if (isChatOpen && chatModalRef.current) {
      gsap.fromTo(chatModalRef.current,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.3, ease: "power3.out" }
      );
    }
  }, [isChatOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 md:px-6 py-6 md:py-10 pb-24 md:pb-10">
      <div ref={containerRef} className="max-w-6xl mx-auto space-y-4 md:space-y-6">

        {/* ---------------- TOP BAR ---------------- */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 md:p-5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white capitalize">
              {contest?.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Status: <span className="text-slate-300 font-medium">{contest?.status === "upcoming" ? "Waiting Room" : contest?.status}</span>
            </p>
          </div>

          <span
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold tracking-wide shadow-lg ${
              contest?.status === "upcoming"
                ? "bg-green-600 shadow-green-900/20"
                : contest?.status === "live"
                ? "bg-red-600 shadow-red-900/20 animate-pulse"
                : "bg-slate-600"
            }`}
          >
            {contest?.status.toUpperCase()}
          </span>
        </section>

        {/* ---------------- CONTEST META ---------------- */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <PublicMetaCards label="Contest Code" value={contest?.contestCode} copy />
          <PublicMetaCards label="Questions" value={`${contest?.questions.length}`} />
          <PublicMetaCards label="Duration" value={`${contest?.durationInMin} MIN`} />
        </section>

        {/* ---------------- HOST CONTROLS  ---------------- */}
        <section className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-sm text-slate-300 text-center">
          {isHost && contest?.status === "upcoming" ? (
            <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6  mx-auto w-full">
              <h3 className="text-lg font-semibold text-white mb-2">Host Controls</h3>
              <p className="text-xs text-slate-400 mb-4">Once started, no new users can join.</p>
              <Button variant="primary" onClick={startContestHandler} className="w-full sm:w-auto">
                Start Contest Now
              </Button>
            </div>
          ) : contest?.status === "upcoming" ? (
            <div className="flex items-center justify-center gap-2 py-2">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
                Waiting for host to start...
            </div>
          ) : (
            "Contest is live. Joining is disabled."
          )}
        </section>

        {/* ---------------- MAIN GRID ---------------- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          {/* PARTICIPANTS LIST */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 md:p-6 flex flex-col h-[500px] md:h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Participants <span className="text-slate-500 ml-1 text-sm">({participants?.length})</span>
              </h2>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {participants?.map((p) => {
                const isUserItself = p.user._id === user?._id;
                const isUserHost = p.user._id === contest?.owner?._id;

                return (
                  <div
                    key={p._id}
                    className="flex items-center justify-between bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800/60 rounded-lg px-4 py-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                          {p.user.fullName[0]}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">
                            {p.user.fullName}
                            {isUserItself && <span className="ml-2 text-xs text-sky-400">(You)</span>}
                          </span>
                          {isUserHost && <span className="text-[10px] text-red-400 font-semibold">HOST</span>}
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                        {p.joinedAt ? "Ready" : "Joined"}
                      </span>
                      {!isHost && isUserItself && (
                        <button 
                          onClick={leaveContest}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Leave Contest"
                        >
                          <i className="ri-logout-box-r-line text-lg"></i>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESKTOP CHAT */}
          <div className="hidden lg:flex flex-col space-y-6">
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex flex-col h-full max-h-[600px]">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <i className="ri-chat-1-line text-slate-400"></i> Lobby Chat
              </h3>
              
              <div className="flex-1 overflow-hidden bg-slate-900/50 rounded-lg border border-slate-800">
                <MessagesArea messages={messages} currentUserId={user._id} />
              </div>
              
              {chatEnabled && (
                <div className="mt-3">
                   <MessageInput onSend={(msg) => send(msg)} />
                </div>
              )}
            </div>
          </div>

        </section>

        {/* ---------------- QUESTION PREVIEW ---------------- */}
        <section className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 md:p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Questions Preview
          </h2>

          <div className="space-y-2">
            {contestQuestions?.map((q, i) => (
              <div
                key={q._id}
                className="flex items-center justify-between bg-slate-800/40 border border-slate-700/30 px-4 py-3 rounded-lg"
              >
                <span className="text-slate-200 text-sm font-medium truncate pr-4">
                  {i + 1}. {q.title}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    q.difficulty === "easy"
                      ? "bg-green-500/10 text-green-400"
                      : q.difficulty === "medium"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {q.difficulty}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---------------- MOBILE FLOATING CHAT ---------------- */}
      
      <button
        onClick={() => setIsChatOpen(true)}
        className="lg:hidden fixed bottom-16 right-4 w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-2xl shadow-red-900/50 z-40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
         <i className="ri-chat-3-fill text-2xl"></i>
      </button>

      {/* FIX: z-[100] is higher than Header's z-50.
         This guarantees the Chat Modal covers the Bottom Nav Bar.
      */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col h-[100dvh] bg-slate-900" ref={chatModalRef}>
          
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900 shrink-0">
             <div className="flex items-center gap-3">
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                   <i className="ri-arrow-left-line text-2xl"></i>
                </button>
                <h2 className="text-lg font-semibold text-white">Lobby Chat</h2>
             </div>
             <span className="text-xs text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Live
             </span>
          </div>

          <div className="flex-1 overflow-hidden relative">
             <MessagesArea messages={messages} currentUserId={user._id} />
          </div>

          {chatEnabled && (
            <div className="shrink-0 p-2 bg-slate-900 border-t border-slate-800">
               <MessageInput onSend={(msg) => send(msg)} />
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default GroupContestLobby;