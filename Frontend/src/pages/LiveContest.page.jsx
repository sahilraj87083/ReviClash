import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button, Input } from "../components";



function LiveContest() {
  const containerRef = useRef(null);

  const TOTAL_TIME = 60 * 60; // seconds
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [activeQuestion, setActiveQuestion] = useState(0);

  // contest state
  const contestStatus = "live"; // live | ended
  const chatEnabled = contestStatus === "live";
    //   const isGroupContest = contest.visibility !== "private";
    const isGroupContest = false;

  const questions = [
    {
      id: 1,
      title: "Two Sum",
      platform: "LeetCode",
      difficulty: "Easy",
      url: "https://leetcode.com/problems/two-sum/",
      status: "unsolved",
    },
    {
      id: 2,
      title: "Binary Search",
      platform: "LeetCode",
      difficulty: "Easy",
      url: "https://leetcode.com/problems/binary-search/",
      status: "solved",
    },
    {
      id: 3,
      title: "Valid Parentheses",
      platform: "LeetCode",
      difficulty: "Medium",
      url: "https://leetcode.com/problems/valid-parentheses/",
      status: "attempted",
    },
  ];

  // timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isDanger = timeLeft < 300;

  return (
    <div className="h-[90vh] bg-slate-900 text-white flex flex-col">

      {/* TOP BAR */}
      <header className="flex items-center justify-between px-6 h-16 border-b border-slate-700">
        <div>
            <div className="flex items-center gap-3">
                <h1 className="font-semibold text-lg">
                DSA Sprint
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
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </header>

      {/* MAIN */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">

        {/* QUESTION NAV */}
        <aside className="w-64 border-r border-slate-700 p-4 space-y-3 overflow-y-auto">
          <p className="text-sm text-slate-400 mb-2">Questions</p>

          {questions.map((q, idx) => (
            <button
              key={q.id}
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
                <StatusDot status={q.status} />
              </div>
            </button>
          ))}
        </aside>

        {/* QUESTION AREA */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">

          <div>
            <h2 className="text-xl font-semibold">
              {questions[activeQuestion].title}
            </h2>

            <div className="flex items-center gap-3 mt-1 text-sm">
              <span className="px-2 py-0.5 rounded bg-slate-800">
                {questions[activeQuestion].platform}
              </span>
              <span className="text-slate-400">
                {questions[activeQuestion].difficulty}
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
              href={questions[activeQuestion].url}
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
                <i class="ri-send-ins-fill"></i>
                </Button>
            </div>
            </div>
        )}
        </aside>



      </div>

      {/* BOTTOM BAR */}
      <footer className="h-16 px-6 border-t border-slate-700 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Progress auto-saved · Auto-submit on time end
        </p>

        <Button variant="danger">
          Submit Contest
        </Button>
      </footer>
    </div>
  );
}

/* ---------- Helpers ---------- */

function StatusDot({ status }) {
  const colors = {
    solved: "bg-green-500",
    attempted: "bg-yellow-400",
    unsolved: "bg-slate-500",
  };

  return (
    <span className={`w-3 h-3 rounded-full ${colors[status]}`} />
  );
}

export default LiveContest;
