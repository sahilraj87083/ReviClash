import { useRef, useState } from "react";
import { Input, Button, Select } from "../components";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Contests() {
    const containerRef = useRef(null);
    const navigate = useNavigate()


    const QUESTION_COUNT_OPTIONS = [
        { label: "5 Questions", value: 5 },
        { label: "10 Questions", value: 10 },
        { label: "15 Questions", value: 15 },
    ];

    const DURATION_OPTIONS = [
        { label: "30 Minutes", value: 30 },
        { label: "60 Minutes", value: 60 },
        { label: "90 Minutes", value: 90 },
    ];

    const VISIBILITY_OPTIONS = [
        { label: "Private", value: "private" },
        { label: "Shared", value: "shared" },
        { label: "Public", value: "public" },
    ];


    const [contestCode, setContestCode] = useState("");

    useGSAP(
        () => {
        gsap.from(containerRef.current.children, {
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
        });
        },
        { scope: containerRef }
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <div ref={containerRef} className="max-w-6xl mx-auto space-y-10">

        {/* HERO */}
        <section className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-white">
            Compete. Practice. Improve.
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Create contests from your collections or join existing contests
            and challenge yourself.
          </p>
        </section>

        {/* ACTIONS */}
        <section className="grid md:grid-cols-2 gap-8">

          {/* JOIN CONTEST */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white">
                Join a Contest
                </h2>

                <Input
                label="Contest Code"
                placeholder="Enter contest code"
                value={contestCode}
                onChange={(e) => setContestCode(e.target.value)}
                />

                <Button
                variant="primary"
                className="w-full"
                onClick={() => console.log("Join contest", contestCode)}
                >
                Join Contest
                </Button>

                <p className="text-xs text-slate-400">
                You can also join using a shared contest link.
                </p>
            </div>

            {/* CREATE CONTEST */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white">
                Create a Contest
            </h2>

            <Select
                label="Collection"
                placeholder="Select collection"
                options={[
                { label: "DSA Core", value: "1" },
                { label: "Binary Search", value: "2" },
                ]}
            />

            <div className="grid grid-cols-2 gap-4">
                <Select
                label="Questions"
                placeholder="Select count"
                options={QUESTION_COUNT_OPTIONS}
                />

                <Select
                label="Duration"
                placeholder="Select duration"
                options={DURATION_OPTIONS}
                />
            </div>

            <Select
                label="Visibility"
                placeholder="Select visibility"
                options={VISIBILITY_OPTIONS}
            />

            <Button variant="primary" className="w-full">
                Create Contest
            </Button>
            </div>


        </section>
        
        {/* MY CONTESTS NAV */}
        <section className="grid md:grid-cols-2 gap-6">
        <div
            onClick={(e) => navigate("/created-contests")}
            className="cursor-pointer bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-red-500 transition"
        >
            <h3 className="text-lg font-semibold text-white">
            My Contests
            </h3>
            <p className="text-slate-400 text-sm mt-2">
            Contests you have created
            </p>
        </div>

        <div
            onClick={() => navigate("/joined-contests")}
            className="cursor-pointer bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-red-500 transition"
        >
            <h3 className="text-lg font-semibold text-white">
            Joined Contests
            </h3>
            <p className="text-slate-400 text-sm mt-2">
            Contests you have participated in
            </p>
        </div>
        </section>

        {/* ACTIVE CONTESTS */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Your Active Contests
          </h2>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl divide-y divide-slate-700/40">
            <ContestRow
              title="DSA Sprint #14"
              status="Live"
              action="Resume"
            />
            <ContestRow
              title="Graphs Weekly"
              status="Upcoming"
              action="View"
            />
          </div>
        </section>

      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function SelectRow({ label, children }) {
  return (
    <div>
      <label className="text-sm text-slate-400">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ContestRow({ title, status, action }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="text-white font-medium">{title}</p>
        <p className="text-slate-400 text-sm">{status}</p>
      </div>
      <Button size="sm" variant="secondary">
        {action}
      </Button>
    </div>
  );
}

export default Contests;
