import { useRef, useState , useEffect} from "react";
import { Input, Button, Select, ContestRow } from "../components";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getActiveContestsService , getAllContestsService} from "../services/contest.services";
import { getMyCollections } from "../services/collection.service";
import { createContestService } from "../services/contest.services";
import { joinContestService } from "../services/contestParticipant.service";
import { useSocketContext } from "../contexts/socket.context";
import toast from "react-hot-toast";

function Contests() {
    const containerRef = useRef(null);
    const navigate = useNavigate()
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
    const [collectionOptions, setCollectionOptions] = useState([])
    const [contestCollectionId, setContestCollectionId] = useState("");
    const [contestTitle, setContestTitle] = useState("")
    const [contestQuestionCount, setContestQuestionCount] = useState(1)
    const [contestDuration , setContestDuration] = useState(90)
    const [contestVisibility, setContestVisiblity] = useState("private")

    const selectedCollection = collections.find(
      c => c._id === contestCollectionId
    );


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
          const data = await getActiveContestsService();
          setActiveContests(data.contests);

          const myCollections = await getMyCollections();
          setCollections(myCollections);

          setCollectionOptions(myCollections.map((c) => ({
              label: c.name,
              value: c._id,
          })))
          
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
        e.preventDefault()
        // console.log("here")

        const data = {
            title : contestTitle,
            questionCount : contestQuestionCount,
            durationInMin : contestDuration,
            visibility : contestVisibility,
            collectionId : contestCollectionId
        }
        const contest = await createContestService(data)
        if (contest.visibility === "private") {
          navigate(`/user/contests/private/${contest._id}`);
        } else {
          navigate(`/user/contests/public/${contest._id}`);
        }

    }

    const joinContesthandler = async (e) => {
        e.preventDefault()
        try {
          setContestCode("")
          // console.log("joined", contestCode)
          const participant = await joinContestService(contestCode)
          // console.log(participant)
          if(!participant){
            
            toast.error("You can't join private contest")
            navigate('/user/contests')
          }
          // join socket room immediately
          socket.emit("join-contest", { contestId: participant.contestId });
          navigate(`/user/contests/public/${participant.contestId}`);
        } catch (error) {
            console.log("contest is private ",error)
            toast.error("Contest Already Started")
            
        }
    }

    const handleAllContestClick = async () => {
      if (allCache.current) return allCache.current;

      const res = await getAllContestsService();
      allCache.current = res.contests;
      setAllContests(res.contests);
      return res.contests;
    };
      

    const navigateToContest = (contest) => {
      if (contest.status === "upcoming") {
          // lobby
          if (contest.visibility === "private") {
              navigate(`/user/contests/private/${contest._id}`);
          } else {
              navigate(`/user/contests/public/${contest._id}`);
          }
      }

      if (contest.status === "live") {
          // live contest
          navigate(`/contests/${contest._id}/live`);
      }

      if (contest.status === "ended") {
          // leaderboard / result
          navigate(`/contests/${contest._id}/leaderboard`);
      }
    };


    useGSAP(
      () => {
        // HERO
        gsap.from(heroRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        });

        // ACTION CARDS
        gsap.from(actionRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.2,
        });

        // NAV CARDS
        gsap.from(navRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.3,
        });
        },
      { scope: containerRef, }
    );

    // ACTIVE CONTESTS
    useGSAP(
      () => {
        if (!activeContests.length) return;
        gsap.fromTo(
            ".contest-row",
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.15,
              scrollTrigger: {
                trigger: activeRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );
      },
      { dependencies: [activeContests] }
    );


 


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <div ref={containerRef} className="max-w-6xl mx-auto space-y-10">

        {/* HERO */}
        <section ref={heroRef} className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-white">
            Compete. Practice. Improve.
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Create contests from your collections or join existing contests
            and challenge yourself.
          </p>
        </section>

        {/* ACTIONS */}
        <section  ref = {actionRef} className="grid md:grid-cols-2 gap-8">

            {/* JOIN CONTEST */}
            <form className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 space-y-6"
              onSubmit={joinContesthandler}
              ref={joinFormRef}
            >
                <h2 className="text-xl font-semibold text-white">
                  Join a Contest
                </h2>

                <Input
                  label="Contest Code"
                  placeholder="Enter contest code"
                  value={contestCode}
                  onChange={(e) => setContestCode(e.target.value)}
                  required
                />

                <Button
                  type = 'submit'
                  variant="primary"
                  className="w-full"
                >
                  Join Contest
                </Button>

                <div className="flex justify-center items-center">
                  <p className="text-xs text-slate-400 justify-center mt-[80px]">
                    You can also join using a shared contest link.
                  </p>
                </div>
            </form>

            {/* CREATE CONTEST */}
            <form className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 space-y-6"
            onSubmit={createContestHandler}
            ref={createFormRef}
            >
              <h2 className="text-xl font-semibold text-white">
                  Create a Contest
              </h2>

              <Select
                  label="Collection"
                  placeholder="Select collection"
                  value = {contestCollectionId}
                  onChange = {(e) => (setContestCollectionId(e.target.value))}
                  options={collectionOptions}
                  required
              />

              <Input
                label="Contest Title"
                name="title"
                placeholder="e.g. DSA Sprint"
                value={contestTitle}
                onChange={(e) => {setContestTitle(e.target.value)}}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Questions"
                    type="number"
                    name="questionCount"
                    min={1}
                    max={selectedCollection?.questionsCount || 5}
                    value={contestQuestionCount}
                    onChange={(e) => {setContestQuestionCount(e.target.value)}}
                  />

                  <Select
                  value = {contestDuration}
                  onChange = {(e) => (setContestDuration(e.target.value))}
                  label="Duration"
                  placeholder="Select duration"
                  options={DURATION_OPTIONS}
                  />
              </div>

              <Select
                  value = {contestVisibility}
                  onChange = {(e) => (setContestVisiblity(e.target.value))}
                  label="Visibility"
                  placeholder="Select visibility"
                  options={VISIBILITY_OPTIONS}
              />

              <Button type = 'submit'
              variant="primary" className="w-full"
              >
                  Create Contest
              </Button>
            </form>


        </section>
        
        {/* MY CONTESTS NAV */}
        <section ref={navRef} className="flex flex-col gap-2">
          <div className="flex text-center justify-center ">
              <div
                  onClick={(e) => navigate("/contests/all")}
                  className="cursor-pointer w-full bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-red-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 "
              >
                  <h3 className="text-lg font-semibold text-white">
                  All Contests
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                  Contests you have participated
                  </p>
              </div>
              
          </div>
          <div className="grid md:grid-cols-2 gap-6">
                <div
                  onClick={(e) => navigate("/contests/created")}
                  className="cursor-pointer bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-red-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                  <h3 className="text-lg font-semibold text-white">
                  Created Contests
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                  Contests you have created
                  </p>
                </div>

                <div
                    onClick={() => navigate("/contests/joined")}
                    className="cursor-pointer bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-red-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                    <h3 className="text-lg font-semibold text-white">
                    Joined Contests
                    </h3>
                    <p className="text-slate-400 text-sm mt-2">
                    Contests you have participated in
                    </p>
                </div>
          </div>
          
        

        </section>

        {/* ACTIVE CONTESTS */}
        <section ref={activeRef} className="space-y-4 active-contests">
          <h2 className="text-xl font-semibold text-white">
            Your Active Contests
          </h2>

          <div 
          className="
            bg-slate-900/60 border border-slate-700/50 rounded-2xl
            divide-y divide-slate-700/40
            max-h-[320px] overflow-y-auto
            scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800
          "
           >
            {activeContests.map((c) => (
              <ContestRow
                key={c._id}
                contest={c}
                onNavigate={navigateToContest}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}



export default Contests;
