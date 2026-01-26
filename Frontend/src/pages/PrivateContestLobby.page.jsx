import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Copy } from "lucide-react";
import { MetaCard, DifficultyBadge,Button } from "../components";
import { useState, useEffect } from "react";
import { getContestByIdService, startContestService } from "../services/contest.services";

function PrivateContestLobby() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [contest, setContest] = useState()

  const fetchContest = async () => {
    try {
        const contest = await getContestByIdService(contestId);
        console.log(contest)
        setContest(contest);
        
        if(contest.status === 'live'){
          navigate(`/contests/${contestId}/live`)
        }
        if(contest?.status === 'ended'){
            navigate('/user/contests')
        }
    } catch (error) {
        toast.error("Contest not found")
        navigate('/user/contests')
    }
  }

  useEffect(() => {
    (async () => {
      await fetchContest()
    })();
  }, [contestId]);


  useGSAP(() => {
    gsap.from(containerRef.current.children, {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.7,
      ease: "power3.out",
    });
  });

  const startContestHandler = async () => {
      await startContestService(contestId)
      navigate(`/contests/${contestId}/live`)
  }

  const copyCode = () => {
      navigator.clipboard.writeText(contest.contestCode);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white px-6 py-14"
    >
      <div className="max-w-4xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{contest?.title}</h1>
          <div className="flex gap-4 justify-between items-center">
            
            <div className="flex justify-center items-center gap-3">
                <span className="px-3 py-2 bg-slate-800 rounded-md font-mono text-lg tracking-widest">
                Code : {contest?.contestCode}
                </span>

                <button
                  onClick={copyCode}
                  className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 transition"
                  title="Copy contest code"
                  >
                  <Copy size={20} />
                </button>
            </div>

            {/* START BUTTON */}
            <div className="text-center">
            <Button
                onClick={startContestHandler}
                size = "md"
            >
                Start Contest
            </Button>
            </div>

          </div>

          <div>
            <p className="text-slate-400 text-sm">
                All the best For you Contest
            </p>
          </div>
        </div>

        {/* META */}
        <div className="grid grid-cols-2 gap-6 text-center">
          <MetaCard label="Questions" value={contest?.questions.length} />
          <MetaCard label="Duration" value={`${contest?.durationInMin} min`} />
        </div>

        {/* QUESTIONS PREVIEW */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Questions in this contest
          </h2>

          <div className="space-y-3">
            {contest?.questions.map((q, i) => (
              <div
                key={q._id}
                className="flex items-center justify-between text-sm bg-slate-800/60 px-4 py-3 rounded-md"
              >
                <span>
                  {i + 1}. {q.title}
                </span>
                <DifficultyBadge level={q.difficulty} />
              </div>
            ))}
          </div>
        </div>

        {/* WARNING */}
        <div className="border text-center border-red-500/30 bg-red-500/5 rounded-xl p-5 text-sm text-red-400">
          ⏱ Timer will start as soon as you click <b>Start Contest</b>.  
          You cannot pause or restart the contest.
        </div>

        

      </div>
    </div>
  );
}

export default PrivateContestLobby;
