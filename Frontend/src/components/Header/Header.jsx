import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo3.png";
import ProfileDropdown from "./HeaderDropDown";
import { useUserContext } from "../../contexts/UserContext";
import { useRef, useState } from "react";
import MobileSidebar from "./MobileSidebar";
import { 
  Bell, 
  Code2, 
  Users, 
  Trophy, 
  MessageSquare, 
  Compass, 
  Home 
} from "lucide-react"; 

function Header() {
  const { isAuthenticated, user } = useUserContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  // Helper for Desktop Links
  const NavItem = ({ to, label }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `nav-anim relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-white ${
          isActive ? "text-white" : "text-slate-400"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span className={`absolute bottom-0 left-0 h-[2px] bg-red-500 transition-all duration-300 ${isActive ? "w-full" : "w-0"}`}></span>
        </>
      )}
    </NavLink>
  );

  // Helper for Mobile Bottom Nav Links
  const MobileLink = ({ to, icon: Icon }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
          isActive ? "text-red-500 scale-110" : "text-slate-500 hover:text-slate-300"
        }`
      }
    >
      <Icon size={24} strokeWidth={1.5} />
    </NavLink>
  );

  return (
    <>
      {/* =======================
          DESKTOP HEADER
      ======================== */}
      <header
        // Added animate-slide-down directly via CSS class (defined in index.css previously)
        className="hidden md:block sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 animate-slide-down"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <NavLink to={isAuthenticated ? "/" : "/"} className="flex items-center gap-3 group animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src={logo} alt="ReviClash" className="relative h-10 w-auto object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-red-50 opacity-90 transition-colors">
              Revi<span className="text-red-500">Clash</span>
            </span>
          </NavLink>

          {/* NAVIGATION */}
          <nav className="flex items-center gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <NavItem to="/" label="Home" />
            <NavItem to="/explore" label="Explore" />
            <NavItem to="/community" label="Community" />

            {!isAuthenticated ? (
              <div className="flex items-center gap-4 ml-4">
                <NavLink to="/user/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Login
                </NavLink>
                <NavLink to="/user/register" className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-red-900/20 hover:bg-red-500 hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5">
                  Get Started
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-5 ml-2 pl-4 border-l border-white/10">
                <NavItem to="/user/contests" label="Contests" />
                <NavItem to="/user/messages" label="Messages" />
                
                {/* Notification Bell */}
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors group">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-950 animate-pulse"></span>
                </button>

                {/* Profile Dropdown */}
                <ProfileDropdown user={user} />
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* =======================
          MOBILE VIEW
      ======================== */}
      
      {/* 1. Mobile Top Bar - FLOATING & TRANSPARENT */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
        
        {/* Logo Pill (Top Left) */}
        <NavLink 
          to="/" 
          className="pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg flex items-center gap-2 transition-transform active:scale-95"
        >
            <div className="font-bold text-sm tracking-tight flex items-center gap-1 text-white">
                <Code2 size={16} className="text-red-500" />
                <span>Revi<span className="text-red-500">Clash</span></span>
            </div>
        </NavLink>
        
        {/* Profile Trigger (Top Right) */}
        {isAuthenticated && (
           <button 
             onClick={() => setIsSidebarOpen(true)} 
             className="pointer-events-auto relative p-1 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-lg active:scale-95 transition-transform"
           >
              <img
                src={user?.avatar?.url}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-slate-950"></span>
              </span>
           </button>
        )}
      </div>

      {/* 2. Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-[60px] bg-slate-950/95 backdrop-blur-lg border-t border-white/5 z-50 flex justify-around items-center px-2 pb-safe">
        
        {/* Left Links */}
        <MobileLink to="/" icon={Home} />
        <MobileLink to="/community" icon={Users} />
        
        {/* CENTER: EXPLORE FEED (Floating Button) */}
        <NavLink 
            to="/explore" 
            className={({ isActive }) => `
                relative -top-5 flex items-center justify-center w-12 h-12 rounded-full shadow-lg shadow-red-900/40 border border-red-500/20
                transition-all duration-300 ${isActive ? "bg-red-500 text-white scale-110" : "bg-slate-800 text-slate-400"}
            `}
        >
            <Compass size={24} />
        </NavLink>
        
        {/* Right Links */}
        {isAuthenticated ? (
            <>
                <MobileLink to="/user/contests" icon={Trophy} />
                <MobileLink to="/user/messages" icon={MessageSquare} />
            </>
        ) : (
            <MobileLink to="/user/login" icon={Code2} />
        )}
      </div>

      {/* 3. Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user} 
      />
    </>
  );
}

export default Header;