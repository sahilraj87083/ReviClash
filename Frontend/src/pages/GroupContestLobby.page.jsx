import { useState, useRef, useEffect} from "react";
import { Button, Input, PublicMetaCards } from "../components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useParams, useNavigate } from "react-router-dom";
import { getContestByIdService, startContestService } from "../services/contest.services";
import { getAllParticipantsService, leaveContestService } from "../services/contestParticipant.service";
import { useUserContext } from "../contexts/UserContext";
import { useSocketContext } from "../contexts/socket.context";

function GroupContestLobby() {
  const containerRef = useRef(null);

  const [contest, setContest] = useState()
  const [participants, setParticipants] = useState()
  const [contestQuestions, setContestQuestions] = useState()

  const navigate = useNavigate()

  const { user } = useUserContext()
  const { socket } = useSocketContext()

  // ---- Mock state (replace with backend/socket later)
  const isHost = user?._id === contest?.owner?._id;
  // contest?.status; // upcoming | live | ended
  const chatEnabled = contest?.status !== "live";

  const { contestId } = useParams()


  const fetchContest = async () => {
    const contest = await getContestByIdService(contestId);
    setContest(contest);
    setContestQuestions(contest.questions);
  };

  // Fetch contest once
  useEffect(()=>{
      fetchContest();
  }, [contestId])


  // Poll participants every X seconds
  useEffect(() => {
      let interval ;

      const fetchParticipants = async () => {
          const data = await getAllParticipantsService(contestId);
          // console.log(data)
          setParticipants(data)
      }
      fetchParticipants()

      interval = setInterval(fetchParticipants, 5000); // 5s polling

      return () => clearInterval(interval); // cleanup
  }, [contestId])

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.emit("join-contest", { contestId });

  //   return () => {
  //     socket.emit("leave-contest", { contestId });
  //   };
  // }, [socket, contestId]);

  useEffect(() => {
      if (!socket) return;

      socket.emit("join-contest-lobby", { contestId });

      return () => {
        socket.emit("leave-contest-lobby", { contestId });
      };
  }, [contestId, socket]);

  const leaveContest = async () => {
      await leaveContestService(contest._id);
      socket.emit("leave-contest", { contestId: contest._id });
      navigate("/user/contests");
  }

  const startContestHandler = async () => {
      await startContestService(contest._id)
  }

  useEffect(() => {
    if (!socket) return;

    const handleStart = ({ contestId }) => {
      navigate(`/contests/${contestId}/live`);
    };

    socket.on("contest-started", handleStart);

    return () => {
      socket.off("contest-started", handleStart);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <div ref={containerRef} className="max-w-6xl mx-auto space-y-6">

        {/* ---------------- TOP BAR ---------------- */}
        <section className="flex items-center justify-between bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {contest?.title}
            </h1>
            <p className="text-sm text-slate-400">
              Status: {contest?.status === "upcoming" ? "Waiting Room" : contest?.status}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              contest?.status === "upcoming"
                ? "bg-green-600"
                : contest?.status === "live"
                ? "bg-red-600"
                : "bg-slate-600"
            }`}
          >
            {contest?.status.toUpperCase()}
          </span>
        </section>

        {/* ---------------- CONTEST META ---------------- */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PublicMetaCards label="Contest Code" value={contest?.contestCode} copy />
          <PublicMetaCards label="Questions" value={`${contest?.questions.length}`} />
          <PublicMetaCards label="Duration" value={`${contest?.durationInMin} MIN`} />
        </section>


        {/* ---------------- SYSTEM MESSAGE ---------------- */}
        <section className="bg-slate-800/60 border text-center border-slate-700 rounded-lg p-4 text-sm text-slate-300">
          {contest?.status === "upcoming" && (
            <>
              Waiting for host to start the contest. You can chat freely before
              the contest begins.
            </>
          )}
          {contest?.status === "live" && (
            <>
              Contest is live. Joining is disabled.
            </>
          )}
        </section>

        {/* ---------------- MAIN GRID ---------------- */}
        <section className="grid md:grid-cols-3 gap-6">

          {/* PARTICIPANTS */}
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Participants ({participants?.length})
            </h2>

            <div className="space-y-3">
              {participants?.map((p) => {
                const isHostUser = p.user._id === contest?.owner?._id;

                return (
                  (
                    <div
                      key={p._id}
                      className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3"
                    >
                      <span className="text-white">
                        {p.user.fullName}
                        {isHostUser && (
                          <span className="ml-2 text-xs text-red-400">(Host)</span>
                        )}
                      </span>

                      <div >
                        <span className="text-xs text-slate-400 mr-3">
                          {p.joinedAt ? "Ready" : "Joined"}
                        </span>
                        {!isHost && !isHostUser && (
                          <Button variant="danger" onClick={leaveContest}>
                            <i className="ri-logout-box-r-line"></i>
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                )
              }
            )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">

            {/* HOST CONTROLS */}
            {isHost && contest?.status === "upcoming" && (
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Host Controls
                </h3>

                <Button variant="primary" className="w-full"
                onClick = {startContestHandler}
                >
                  Start Contest
                </Button>

                <p className="text-xs text-slate-400 mt-3">
                  Once started, no new users can join.
                </p>
              </div>
            )}

            {/* CHAT */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 flex flex-col h-64">
              <h3 className="text-lg font-semibold text-white mb-2">
                Chat
              </h3>

              <div className="flex-1 text-slate-400 text-sm flex items-center justify-center">
                {chatEnabled
                  ? "Chat messages appear here"
                  : "Chat disabled during contest"}
              </div>

              {chatEnabled && (
                <div className="px-3 py-3 border-t border-slate-700 bg-slate-900">
                    <div className="flex items-center gap-2">
                        <input
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700
                                    focus:outline-none focus:ring-2 focus:ring-red-500"
                        />

                        <button
                        className="p-2 rounded-md bg-red-600 hover:bg-red-500 transition
                                    flex items-center justify-center"
                        >
                        <i className="ri-send-plane-2-fill text-white text-lg" />
                        </button>
                    </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ---------------- QUESTION PREVIEW ---------------- */}
        <section className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Questions in this contest
          </h2>

          <div className="space-y-3">
            {contestQuestions?.map((q, i) => (
              <div
                key={q._id}
                className="flex items-center justify-between bg-slate-800/60 px-4 py-3 rounded-lg"
              >
                <span className="text-white">
                  {i + 1}. {q.title}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
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
    </div>
  );
}

export default GroupContestLobby;
