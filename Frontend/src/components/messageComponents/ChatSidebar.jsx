import { useMemo, useState, useRef } from "react";
import { Input } from "../";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function ChatSidebar({ inbox = [], activeChat, onSelect }) {
  const [searchChat, setSearchChat] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // GSAP: Expand Search Bar Animation (Right to Left)
  useGSAP(() => {
    if (isSearchOpen) {
      gsap.fromTo(searchContainerRef.current, 
        { width: "40px", opacity: 0 }, 
        { width: "100%", opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      // Auto-focus the input when opened
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleCloseSearch = () => {
    setSearchChat(""); // Clear text
    setIsSearchOpen(false);
  };

  // Filter inbox logic
  const filteredInbox = useMemo(() => {
    if (!searchChat.trim()) return inbox;
    return inbox.filter((chat) =>
      chat.user.fullName.toLowerCase().includes(searchChat.toLowerCase())
    );
  }, [searchChat, inbox]);

  return (
    <aside className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900 h-full">
      
      {/* HEADER: Dynamic (Title OR Search Bar) */}
      <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between shrink-0 overflow-hidden relative">
        
        {!isSearchOpen ? (
          /* DEFAULT STATE: Title + Search Icon */
          <>
            <h2 className="text-white font-bold text-lg">Chats</h2>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <i className="ri-search-line text-lg"></i>
            </button>
          </>
        ) : (
          /* SEARCH STATE: Back Arrow + Full Width Input */
          <div ref={searchContainerRef} className="flex items-center gap-2 w-full">
            <button onClick={handleCloseSearch} className="text-slate-400 hover:text-white shrink-0">
               <i className="ri-arrow-left-line text-xl"></i>
            </button>
            
            <div className="flex-1">
               <Input
                 ref={searchInputRef}
                 value={searchChat}
                 onChange={(e) => setSearchChat(e.target.value)}
                 placeholder="Search..."
                 // Small compact input style
                 className="w-full h-9 px-3 py-1 text-sm rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
               />
            </div>
          </div>
        )}
      </div>

      {/* CHAT LIST (No Animations) */}
      <div className="flex-1 overflow-y-auto">
        {filteredInbox.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-6">
            {isSearchOpen ? "No user found" : "No chats yet"}
          </div>
        )}

        {filteredInbox.map((chat) => {
          const isActive = activeChat?.user?._id === chat.user._id;

          return (
            <button
              key={chat.user._id}
              onClick={() => onSelect(chat)}
              className={`w-full flex gap-3 px-4 py-3 text-left border-b border-slate-800 transition
                ${isActive ? "bg-slate-800" : "hover:bg-slate-800/60"}`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold overflow-hidden">
                {chat.user.avatar ? (
                  <img src={chat.user.avatar.url} alt={chat.user.fullName} className="w-full h-full object-cover"/>
                ) : (
                  chat.user.fullName[0]
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium truncate">
                    {chat.user.fullName}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-red-600 text-xs px-2 py-0.5 rounded-full text-white">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate mt-1">
                  {chat.lastMessage || "Start a conversation"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default ChatSidebar;