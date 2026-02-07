import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BarChart3, 
  ArrowRight, 
  Code2, 
  MessageSquare,
  Zap,
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  MoreHorizontal
} from "lucide-react";

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

function Home() {
  const containerRef = useRef(null);
  const heroTextRef = useRef(null);
  const uiPreviewRef = useRef(null);
  const feedPreviewRef = useRef(null);
  const navigate = useNavigate();

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Hero Text Reveal
    tl.from(heroTextRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power4.out",
    });

    // 2. 3D Card Float Up
    tl.from(uiPreviewRef.current, {
      y: 100,
      opacity: 0,
      rotateX: 20,
      duration: 1.2,
      ease: "power3.out",
    }, "-=0.5");

    // 3. Floating Animation for the Card
    gsap.to(uiPreviewRef.current, {
      y: -15,
      rotateX: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 4. Scroll Animations for Sections
    const sections = gsap.utils.toArray('.reveal-on-scroll');
    sections.forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    });

  }, { scope: containerRef });

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-slate-950 text-white selection:bg-red-500/30 overflow-x-hidden"
    >
      {/* --- BACKGROUND GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-red-500 opacity-20 blur-[100px]"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <div ref={heroTextRef} className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            v1.0 is Live · Join the Beta
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            The Social Network for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-pink-500">
              Competitive Coders
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Practice problems, create private lobbies, battle friends in real-time, 
            and showcase your rank to the world.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl transition-transform active:scale-95 flex items-center gap-2"
            >
              Start Competing
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="px-8 py-4 bg-slate-900 border border-slate-700 text-white font-semibold rounded-xl hover:bg-slate-800 transition active:scale-95"
            >
              Explore Community
            </button>
          </div>
        </div>

        {/* --- 3D UI PREVIEW --- */}
        <div 
          ref={uiPreviewRef}
          className="mt-20 relative w-full max-w-5xl perspective-1000"
        >
          <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl shadow-red-900/20 transform rotate-x-12">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-700/50 pb-3">
               <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
               </div>
               <div className="ml-4 h-6 w-64 bg-slate-800/50 rounded-md"></div>
            </div>
            
            {/* Dashboard Mock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-64 overflow-hidden">
               <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                  <div className="h-4 w-20 bg-slate-700 rounded mb-4"></div>
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-600"></div>
                       <div className="flex-1 h-3 bg-slate-700 rounded"></div>
                    </div>
                  ))}
               </div>
               <div className="md:col-span-2 bg-slate-800/80 rounded-xl p-4 border border-slate-600/30 relative">
                  <div className="flex justify-between items-center mb-4">
                     <div className="h-6 w-32 bg-red-500/20 rounded text-red-400 text-xs font-bold flex items-center px-2">LIVE CONTEST</div>
                  </div>
                  <div className="mt-6 h-32 bg-slate-950 rounded-lg border border-slate-700 p-3 font-mono text-xs text-slate-400">
                     <span className="text-pink-400">const</span> <span className="text-blue-400">winner</span> = <span className="text-yellow-400">await</span> compete();
                     <br/>
                     console.<span className="text-blue-300">log</span>(<span className="text-green-400">"Rank #1"</span>);
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMING SOON: SOCIAL FEED PREVIEW --- */}
      <section className="py-24 px-6 border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          
          {/* Text Side */}
          <div className="flex-1 space-y-6 reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Connect with Elites.<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-600">
                Compete like a Pro.
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              We are building the first social media for developers. 
              Follow your friends, react to their contest victories, 
              repost smart solutions, and build your coding legacy.
            </p>
            <div className="flex gap-4">
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                    Coming Soon
                </span>
            </div>
          </div>

          {/* Visual Side (Mock Feed) */}
          <div className="flex-1 w-full max-w-md reveal-on-scroll" ref={feedPreviewRef}>
            {/* Mock Post Card */}
            {/* --- POST 1: SAHIL SINGH --- */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                            <img src="https://ui-avatars.com/api/?name=Sahil+Singh&background=0D8ABC&color=fff" alt="User" className="rounded-full bg-slate-800 p-0.5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-white">sahilsingh</h4>
                            <p className="text-xs text-slate-400">Gainesville, FL</p>
                        </div>
                    </div>
                    <MoreHorizontal className="text-slate-400" size={20} />
                </div>

                {/* Content (Image/Code) */}
                <div className="bg-slate-950 p-6 font-mono text-xs md:text-sm text-slate-300 border-b border-slate-800 relative">
                   <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-2 py-1 rounded text-[10px] font-bold">
                      SOLVED • HARD
                   </div>
                   <p className="mb-2 text-slate-500">// Problem: Median of Two Sorted Arrays</p>
                   <p><span className="text-purple-400">function</span> <span className="text-blue-400">solve</span>(nums1, nums2) &#123;</p>
                   <p className="pl-4 text-green-400">return [...nums1, ...nums2].sort();</p>
                   <p>&#125;</p>
                   <div className="mt-8 text-center text-slate-500 italic text-xs">
                      (Code snippet visualization)
                   </div>
                </div>

                {/* Actions */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Heart className="text-red-500 fill-red-500" size={24} />
                            <MessageCircle className="text-white hover:text-slate-300 transition" size={24} />
                            <Repeat className="text-white hover:text-slate-300 transition" size={24} />
                        </div>
                        <Bookmark className="text-white hover:text-slate-300 transition" size={24} />
                    </div>
                    
                    <p className="font-bold text-sm mb-1">1,024 likes</p>
                    <p className="text-sm text-slate-300">
                        <span className="font-bold mr-2">sahilsingh_dev</span>
                        Just crushed the weekly contest! Rank #3 globally. The DP problem was insane 🤯 #coding #reviclash #leetcode
                    </p>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-wide">2 HOURS AGO</p>
                </div>

            </div>
            {/* --- POST 2: UZMA KHAN --- */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl mt-6 transform scale-95 opacity-80 hover:scale-100 hover:opacity-100 transition-all duration-500">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-teal-500 p-[2px]">
                            <img src="https://ui-avatars.com/api/?name=Uzma+Khan&background=10b981&color=fff" alt="User" className="rounded-full bg-slate-800 p-0.5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-white">uzmakhan</h4>
                            <p className="text-xs text-slate-400">Bangalore, India</p>
                        </div>
                    </div>
                    <MoreHorizontal className="text-slate-400" size={20} />
                </div>

                {/* Content (Image/Code) */}
                <div className="bg-slate-950 p-6 font-mono text-xs md:text-sm text-slate-300 border-b border-slate-800 relative">
                  <div className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-[10px] font-bold">
                      SOLVED • MEDIUM
                  </div>
                  <p className="mb-2 text-slate-500">// Problem: Longest Palindromic Substring</p>
                  <p><span className="text-purple-400">const</span> <span className="text-blue-400">isPalindrome</span> = (s) =&gt; &#123;</p>
                  <p className="pl-4 text-green-400">return s === s.split('').reverse().join('');</p>
                  <p>&#125;</p>
                  <div className="mt-8 text-center text-slate-500 italic text-xs">
                      (Code snippet visualization)
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Heart className="text-white hover:text-red-500 transition" size={24} />
                            <MessageCircle className="text-white hover:text-slate-300 transition" size={24} />
                            <Repeat className="text-white hover:text-slate-300 transition" size={24} />
                        </div>
                        <Bookmark className="text-white hover:text-slate-300 transition" size={24} />
                    </div>
                    
                    <p className="font-bold text-sm mb-1">856 likes</p>
                    <p className="text-sm text-slate-300">
                        <span className="font-bold mr-2">uzmakhan</span>
                        Finally optimized this O(n^2) solution! The sliding window approach is so elegant. 🚀 #algorithms #javascript
                    </p>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-wide">5 HOURS AGO</p>
                </div>

            </div>
            
          </div>

        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="reveal-on-scroll md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 group">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="text-red-500" size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Group Battles</h3>
            <p className="text-slate-400 text-lg">
              Create a lobby, share the link, and compete with friends in real-time. 
              See who solves the problem first with live scoreboards.
            </p>
          </div>

          <div className="reveal-on-scroll bg-slate-900 border border-slate-800 rounded-3xl p-8 group">
             <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
               <Code2 className="text-blue-500" size={24} />
             </div>
             <h3 className="text-xl font-bold mb-2">Code Collections</h3>
             <p className="text-slate-400">Save your favorite problems and organize them.</p>
          </div>

          <div className="reveal-on-scroll bg-slate-900 border border-slate-800 rounded-3xl p-8 group">
             <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <BarChart3 className="text-green-500" size={24} />
             </div>
             <h3 className="text-xl font-bold mb-2">Deep Analytics</h3>
             <p className="text-slate-400">Visualize your growth, speed, and consistency.</p>
          </div>

          <div className="reveal-on-scroll md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <MessageSquare className="text-purple-500" size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Chat & Connect</h3>
            <p className="text-slate-400 text-lg">
               Don't code alone. Chat with opponents during contests, discuss solutions, 
               and follow top performers.
            </p>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="max-w-4xl mx-auto text-center px-6 reveal-on-scroll">
          <Zap className="mx-auto text-yellow-500 mb-6" size={48} />
          <h2 className="text-4xl font-bold mb-6">Ready to climb the ranks?</h2>
          <button 
            onClick={() => navigate("/user/register")}
            className="px-10 py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-full text-white font-bold text-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 transition-all"
          >
            Create Free Account
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;