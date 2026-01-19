import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { logoutService } from "../../services/auth.services";
import { useUserContext } from "../../contexts/UserContext";

function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);


  const { logout } = useUserContext();

  const logOutHandler = async () => {
    try {
      await logoutService(); // backend clears cookies
    } finally {
      logout();              // frontend clears state
      setOpen(false);
    }
  };


  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative nav-anim" ref={dropdownRef}>
      {/* Avatar */}
      <img
        src={user.avatar}
        alt="avatar"
        className="w-8 h-8 rounded-full cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-40 bg-zinc-900 border border-gray-800 rounded-md shadow-lg">
          <NavLink
            to={`user/profile/${user.username}`}
            className="block px-4 py-2 text-gray-300 hover:bg-zinc-800 font-semibold"
            onClick={() => setOpen(false)}
          >
            My Profile
          </NavLink>

          <NavLink
            to="/stats"
            className="block px-4 py-2 text-gray-300 hover:bg-zinc-800 font-semibold"
            onClick={() => setOpen(false)}
          >
            Stats
          </NavLink>

          <button
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-zinc-800 font-semibold"
            onClick={logOutHandler}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
