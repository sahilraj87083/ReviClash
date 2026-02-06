import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Copy } from "lucide-react";
import { MetaCard, DifficultyBadge, Button } from "../components";
import { getContestByIdService, startContestService } from "../services/contest.services";
import toast from "react-hot-toast";

function PrivateContestLobby() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [contest, setContest] = useState();

  const fetchContest = async () => {
    try {
        const contest = await getContestByIdService(contestId);
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
      if (contest?.contestCode) {
        navigator.clipboard.writeText(contest.contestCode);
        toast.success("Code copied!");
      }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white px-4 py-8 md:px-6 md:py-14"
    >
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">

        {/* HEADER SECTION */}
        <div className="text-center space-y-6">
            
            {/* Title */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold capitalize leading-tight">
                    {contest?.title}
                </h1>
                <p className="text-slate-400 text-sm mt-2">
                    All the best for your contest
                </p>
            </div>

            {/* Controls Container (Responsive Stack) */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-800/40 p-4 md:p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                
                {/* Code Box */}
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    <span className="text-slate-400 text-sm md:hidden">Contest Code</span>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                        <span className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg font-mono text-lg tracking-widest text-slate-200">
                           {contest?.contestCode}
                        </span>
                        <button
                        onClick={copyCode}
                        className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition active:scale-95"
                        title="Copy contest code"
                        >
                        <Copy size={20} />
                        </button>
                    </div>
                </div>

                {/* Start Button */}
                <div className="w-full md:w-auto">
                    <Button
                        onClick={startContestHandler}
                        size="md"
                        className="w-full md:w-auto shadow-lg shadow-blue-900/20"
                    >
                        Start Contest
                    </Button>
                </div>
            </div>
        </div>

        {/* META CARDS */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 text-center">
          <MetaCard label="Questions" value={contest?.questions.length} />
          <MetaCard label="Duration" value={`${contest?.durationInMin} min`} />
        </div>

        {/* QUESTIONS PREVIEW */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">
            Questions Preview
          </h2>

          <div className="space-y-3">
            {contest?.questions.map((q, i) => (
              <div
                key={q._id}
                className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-sm bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/30 px-4 py-3 rounded-lg transition-colors"
              >
                <span className="font-medium text-slate-300 truncate pr-2 w-full sm:w-auto">
                  {i + 1}. {q.title}
                </span>
                <DifficultyBadge level={q.difficulty} />
              </div>
            ))}
          </div>
        </div>

        {/* WARNING */}
        <div className="border text-center border-red-500/30 bg-red-500/10 rounded-xl p-5 text-sm text-red-300 leading-relaxed">
          <span className="block mb-1 text-red-400 font-semibold text-lg">⚠️ Important</span>
          Timer will start as soon as you click <b>Start Contest</b>.  
          You cannot pause or restart the contest once begun.
        </div>

      </div>
    </div>
  );
}

export default PrivateContestLobby;