import { useState, useRef } from "react";
import { Button } from "../components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {Input} from '../components'

function GroupContest() {
  const containerRef = useRef(null);

  // ---- Mock state (will come from backend / socket)
  const isHost = true;
  const contestStatus = "waiting"; // waiting | live | ended
  const chatEnabled = contestStatus !== "live";

  const participants = [
    { id: 1, name: "Sahil", host: true },
    { id: 2, name: "Aman" },
    { id: 3, name: "Riya" },
  ];

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

        {/* TOP BAR */}
        <section className="flex items-center justify-between bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
          <div>
            <h1 className="text-xl font-semibold text-white">
              DSA Sprint – Group Contest
            </h1>
            <p className="text-sm text-slate-400">
              Status: {contestStatus === "waiting" ? "Waiting Room" : contestStatus}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              contestStatus === "waiting"
                ? "bg-green-600"
                : contestStatus === "live"
                ? "bg-red-600"
                : "bg-slate-600"
            }`}
          >
            {contestStatus.toUpperCase()}
          </span>
        </section>

        {/* SYSTEM MESSAGE */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 text-sm text-slate-300">
          {contestStatus === "waiting" && (
            <>
              Waiting for host to start the contest.  
              You can chat freely before the contest begins.
            </>
          )}
          {contestStatus === "live" && (
            <>
              Contest is live.  
              Joining and chat are disabled.
            </>
          )}
        </section>

        {/* MAIN */}
        <section className="grid md:grid-cols-3 gap-6">

          {/* PARTICIPANTS */}
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Participants ({participants.length})
            </h2>

            <div className="space-y-3">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3"
                >
                  <span className="text-white">
                    {p.name}
                    {p.host && (
                      <span className="ml-2 text-xs text-red-400">(Host)</span>
                    )}
                  </span>

                  <span className="text-xs text-slate-400">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">

            {/* HOST CONTROLS */}
            {isHost && contestStatus === "waiting" && (
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Host Controls
                </h3>

                <Button variant="primary" className="w-full">
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

      </div>
    </div>
  );
}

export default GroupContest;
