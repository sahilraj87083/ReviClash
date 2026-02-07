import { useState } from "react";
import { Search, MessageSquarePlus } from "lucide-react";

function ChatSidebar({ inbox, activeChat, onSelect }) {
  const [search, setSearch] = useState("");

  const filteredInbox = inbox?.filter(chat => 
    chat.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    chat.user?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-900/50">
      
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition">
                <MessageSquarePlus size={20} />
            </button>
        </div>
        
        <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
            <input 
                type="text" 
                placeholder="Search chats..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
            />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        {filteredInbox?.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
                No chats found.
            </div>
        ) : (
            filteredInbox?.map((chat) => {
                const isActive = activeChat?.user?._id === chat.user?._id;
                return (
                    <div 
                        key={chat.user?._id}
                        onClick={() => onSelect(chat)}
                        className={`
                            group flex items-center gap-3 p-4 cursor-pointer border-l-2 transition-all duration-200
                            ${isActive 
                                ? "bg-blue-500/10 border-blue-500" 
                                : "border-transparent hover:bg-slate-800/50 hover:border-slate-600"
                            }
                        `}
                    >
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                                {chat.user?.avatar?.url ? (
                                    <img src={chat.user.avatar.url} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-500 uppercase">
                                        {chat.user?.fullName?.[0]}
                                    </div>
                                )}
                            </div>
                            {/* Online Dot (Mock) */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className={`font-semibold truncate ${isActive ? "text-white" : "text-slate-200"}`}>
                                    {chat.user?.fullName}
                                </h3>
                                <span className="text-[10px] text-slate-500">12:30 PM</span>
                            </div>
                            <p className="text-sm text-slate-400 truncate group-hover:text-slate-300">
                                {chat.lastMessage || "Start a conversation"}
                            </p>
                        </div>

                        {/* Unread Badge */}
                        {chat.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-red-500/20">
                                {chat.unreadCount}
                            </div>
                        )}
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
}

export default ChatSidebar;