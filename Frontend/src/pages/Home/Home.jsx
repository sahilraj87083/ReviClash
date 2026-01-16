import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const root = useRef(null);
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const ctaButton = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);

  useGSAP(
    () => {
      // HERO animation
      gsap.from(heroRef.current.children, {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: "power3.out",
      });

      // CTA animation
      gsap.from(ctaRef.current.children, {
        scale: 0.9,
        opacity: 0,
        stagger: 0.15,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.6,
      });

      // FEATURES (scroll)
      gsap.from(featuresRef.current.children, {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.25,
        duration: 0.7,
        ease: "power2.out",
      });

      // STEPS (scroll)
      gsap.from(stepsRef.current.children, {
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 85%",
        },
        scale: 0.85,
        opacity: 0,
        stagger: 0.2,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { scope: root } // 👈 THIS IS IMPORTANT
  );
  



  return (
    <main
      ref={root}
      className="bg-gradient-to-b from-slate-900 via-slate-900 to-black text-white"
    >
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-28 text-center">
        <div ref={heroRef}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">
              Practice.
            </span>{" "}
            Compete. Improve.
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
            ReviClash lets you collect coding problems, create real contests,
            and track performance like a pro.
          </p>
        </div>

        <div ref={ctaRef} className="flex justify-center gap-5">
          <a
            ref={ctaButton}
            href="/register"
            className="relative px-8 py-3 rounded-md font-semibold text-white
            bg-gradient-to-r from-red-600 to-pink-600
            shadow-lg shadow-red-500/30
            transition-transform duration-300
            hover:-translate-y-0.5"
          >
            Get Started
            <span
              className="absolute inset-0 rounded-md opacity-0 hover:opacity-100
              ring-2 ring-red-400/40 transition"
            />
          </a>

          <a
            href="/explore"
            className="px-7 py-3 border border-slate-600 rounded-md hover:border-white"
          >
            Explore Contests
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-slate-800 py-24">
        <div
          ref={featuresRef}
          className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10"
        >
          <Feature title="Smart Practice" desc="Save problems from platforms." />
          <Feature title="Real Contests" desc="Timed contests with friends." />
          <Feature title="Deep Analytics" desc="Track speed & accuracy." />
        </div>
      </section>

      {/* STEPS */}
      <section className="border-t border-slate-800 py-24 text-center">
        <h2 className="text-3xl font-bold mb-12">How it works</h2>
        <div
          ref={stepsRef}
          className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10"
        >
          <Step number="1" text="Save coding problems" />
          <Step number="2" text="Create or join contests" />
          <Step number="3" text="Analyze performance" />
        </div>
      </section>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-full bg-red-600/10 text-red-500 text-2xl font-bold flex items-center justify-center mb-4">
        {number}
      </div>
      <p className="text-slate-300">{text}</p>
    </div>
  );
}

export default Home;
