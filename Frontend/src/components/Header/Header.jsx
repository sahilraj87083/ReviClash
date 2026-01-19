import { NavLink } from "react-router-dom";
import logo from "../../assets/logo3.png";
import ProfileDropdown from "./HeaderDropDown";
import { useUserContext } from "../../contexts/UserContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

function Header() {
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);


  const { isAuthenticated, isAuthReady } = useUserContext();
  // if (!isAuthReady) return null;
  // const isAuthenticated = true

  useGSAP(
    () => {
      if (!isAuthReady) return;

      const tl = gsap.timeline();

      tl.from(headerRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      .from(
        logoRef.current,
        {
          scale: 0.85,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      )
      .from(".nav-anim", {
          y: -10,
          opacity: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out",
        }, "-=0.3");
    },
    { dependencies: [isAuthReady, isAuthenticated], scope: headerRef }
  );

  
  if (!isAuthReady) {
    return (
      <header className="h-20 bg-slate-900 border-b border-slate-700" />
    );
  }



  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50
      bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900
      border-b border-slate-700/50 backdrop-blur"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <NavLink
          to={isAuthenticated ? "/" : "/"}
          className="flex items-center gap-3"
          ref={logoRef}
        >
          <img
            src={logo}
            alt="ReviClash Logo"
            className="h-12 w-auto object-contain"
          />
          <span className="text-xl font-bold tracking-wide text-slate-100">
            ReviClash
          </span>
        </NavLink>

        {/* NAV */}
        <nav ref={navRef} className="flex items-center gap-6 text-sm">
          <>

            <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-anim nav-link ${isActive ? "is-active" : ""}`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `nav-anim nav-link ${isActive ? "is-active" : ""}`
                }
              >
                Explore
              </NavLink>

          </>

          {!isAuthenticated ? (
            <>
              <NavLink className={({ isActive }) =>
                  `nav-anim nav-link ${isActive ? "is-active" : ""}`
                } to="/user/login">
                Login
              </NavLink>
              <NavLink
                to="/user/register"
                className="nav-anim px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-500"
              >
                <p className="hover-underline">Sign Up</p>
              </NavLink>
            </>
          ) : (
            <>

              <NavLink className={({ isActive }) =>
                  `nav-anim nav-link ${isActive ? "is-active" : ""}`
                } to="user/collections">Collections
              </NavLink>

              <NavLink className={({ isActive }) =>
                  `nav-anim nav-link ${isActive ? "is-active" : ""}`
                } to="user/contests">Contests
                </NavLink>

              <NavLink className={({ isActive }) =>
                  ` nav-anim nav-link ${isActive ? "is-active" : ""}`
                }
                to="user/messages">Messages
              </NavLink>

              <NavLink className={({ isActive }) =>
                  `nav-anim nav-link ${isActive ? "is-active" : ""}`
                } to="user/dashboard">Dashboard
              </NavLink>

              <ProfileDropdown user={{}} />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
