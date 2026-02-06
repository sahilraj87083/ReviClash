import { NavLink, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { createPortal } from "react-dom"; // IMPORT THIS
import { logoutService } from "../../services/auth.services";
import { useUserContext } from "../../contexts/UserContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function MobileSidebar({ isOpen, onClose, user }) {
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const { logout } = useUserContext();
  const navigate = useNavigate();

  // Animation for Sidebar Sliding In/Out
  useGSAP(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        display: "block",
      });
      gsap.to(sidebarRef.current, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
      });
      gsap.to(sidebarRef.current, {
        x: "100%", // Move completely off-screen to right
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logoutService();
    } finally {
      logout();
      onClose();
      navigate("/explore");
    }
  };

  // We use createPortal to render this component outside the Header
  // and directly attached to the document body.
  return createPortal(
    <>
      {/* Dark Overlay (Click to close) - Z-Index 9998 */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[9998] hidden opacity-0 md:hidden"
      ></div>

      {/* Sidebar Drawer - Z-Index 9999 (Maximum Priority) */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full w-[75%] max-w-[300px] bg-zinc-900 border-l border-slate-800 z-[9999] transform translate-x-full shadow-2xl md:hidden flex flex-col"
      >
        {/* Header of Sidebar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-zinc-950">
          <span className="text-lg font-bold text-slate-100">Menu</span>
          <button onClick={onClose} className="text-slate-400 text-2xl">
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* User Info Snippet */}
        <div className="p-6 flex flex-col items-center border-b border-slate-800 bg-zinc-900">
          <img
            src={user?.avatar?.url}
            alt="avatar"
            className="w-20 h-20 rounded-full border-2 border-red-500 mb-3"
          />
          <h3 className="text-white font-semibold text-lg">@{user?.username}</h3>
          <p className="text-slate-400 text-sm">{user?.email}</p>
        </div>

        {/* Menu Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-3">
            
            {/* 1. Dashboard */}
            <NavLink
              to="/user/dashboard"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-red-600/10 text-red-500" : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <i className="ri-dashboard-line text-xl"></i>
              <span className="font-medium">Dashboard</span>
            </NavLink>

            {/* 2. My Profile */}
            <NavLink
              to={`user/profile/${user?.username}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-red-600/10 text-red-500" : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <i className="ri-user-smile-line text-xl"></i>
              <span className="font-medium">My Profile</span>
            </NavLink>

            {/* 3. Stats */}
            <NavLink
              to="/user/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <i className="ri-bar-chart-line text-xl"></i>
              <span className="font-medium">Stats</span>
            </NavLink>

             <div className="my-2 border-t border-slate-800/50"></div>

             {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors w-full text-left"
            >
              <i className="ri-logout-box-r-line text-xl"></i>
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </>,
    document.body // This renders the component at the end of the body tag
  );
}

export default MobileSidebar;