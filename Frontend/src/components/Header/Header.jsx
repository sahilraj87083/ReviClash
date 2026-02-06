import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo3.png";
import ProfileDropdown from "./HeaderDropDown";
import { useUserContext } from "../../contexts/UserContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import MobileSidebar from "./MobileSidebar";

function Header() {
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const { isAuthenticated, isAuthReady, user } = useUserContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useGSAP(
    () => {
      if (!isAuthReady) return;
      const tl = gsap.timeline();

      if (window.innerWidth > 768) {
        tl.from(headerRef.current, {
          y: -60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        })
          .from(
            logoRef.current,
            { scale: 0.85, opacity: 0, duration: 0.5, ease: "back.out(1.7)" },
            "-=0.4"
          )
          .from(
            ".nav-anim",
            {
              y: -10,
              opacity: 0,
              stagger: 0.1,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.3"
          );
      }
    },
    { dependencies: [isAuthReady, isAuthenticated], scope: headerRef }
  );

  // FIX 1: Responsive height for loading state to prevent layout jumps/white gaps
  if (!isAuthReady) {
    return <header className="h-16 md:h-20 bg-slate-900 border-b border-slate-700" />;
  }

  const mobileLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center w-full h-full text-2xl transition-colors ${
      isActive ? "text-red-500" : "text-slate-400 hover:text-slate-200"
    }`;

  return (
    <>
      {/* =======================
          DESKTOP HEADER
      ======================== */}
      <header
        ref={headerRef}
        className="hidden md:block sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <NavLink to={isAuthenticated ? "/" : "/"} className="flex items-center gap-3" ref={logoRef}>
            <img src={logo} alt="ReviClash Logo" className="h-12 w-auto object-contain" />
            <span className="text-xl font-bold tracking-wide text-slate-100">ReviClash</span>
          </NavLink>

          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/" className={({ isActive }) => `nav-anim nav-link ${isActive ? "is-active" : ""}`}>Home</NavLink>
            <NavLink to="/explore" className={({ isActive }) => `nav-anim nav-link ${isActive ? "is-active" : ""}`}>Explore</NavLink>

            {!isAuthenticated ? (
              <>
                <NavLink className={({ isActive }) => `nav-anim nav-link ${isActive ? "is-active" : ""}`} to="/user/login">Login</NavLink>
                <NavLink to="/user/register" className="nav-anim px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-500">
                  <p className="hover-underline">Sign Up</p>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink className={({ isActive }) => `nav-anim nav-link ${isActive ? "is-active" : ""}`} to="user/contests">Contests</NavLink>
                <NavLink className={({ isActive }) => `nav-anim nav-link ${isActive ? "is-active" : ""}`} to="user/messages">Messages</NavLink>
                <NavLink className={({ isActive }) => `nav-anim nav-link ${isActive ? "is-active" : ""}`} to="user/dashboard">Dashboard</NavLink>
                <ProfileDropdown user={user} />
              </>
            )}
          </nav>
        </div>
      </header>

      {/* =======================
          MOBILE VIEW
      ======================== */}
      
      {/* 1. Mobile Top Bar - FIX: z-50 and solid bg-slate-900 to prevent white gaps */}
      <div className="md:hidden sticky top-0 z-50 bg-slate-900 border-b border-slate-700 h-16 flex items-center px-4 justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="text-lg font-bold text-slate-100">ReviClash</span>
        </NavLink>
      </div>

      {/* 2. Mobile Bottom Nav - FIX: z-50 */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-slate-900 border-t border-slate-800 z-50 flex justify-between items-center px-2 pb-safe">
        <NavLink to="/" className={mobileLinkClass}><i className="ri-home-wifi-line"></i></NavLink>
        <NavLink to="/explore" className={mobileLinkClass}><i className="ri-search-ai-2-line"></i></NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/user/contests" className={mobileLinkClass}><i className="ri-code-line"></i></NavLink>
            <NavLink to="/user/messages" className={mobileLinkClass}><i className="ri-chat-1-line"></i></NavLink>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`flex flex-col items-center justify-center w-full h-full ${
                location.pathname.includes("dashboard") || location.pathname.includes("profile") 
                ? "border-t-2 border-red-500 pt-[2px]" 
                : ""
              }`}
            >
              <img
                src={user?.avatar?.url}
                alt="Profile"
                className={`w-7 h-7 rounded-full object-cover border-2 ${
                  isSidebarOpen ? "border-red-500" : "border-slate-500"
                }`}
              />
            </button>
          </>
        ) : (
           <NavLink to="/user/login" className={mobileLinkClass}><i className="ri-user-line"></i></NavLink>
        )}
      </div>

      {/* 3. Mobile Sidebar Component */}
      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user} 
      />
    </>
  );
}

export default Header;