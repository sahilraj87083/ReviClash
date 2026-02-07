import MessageInput from "./MessageInput";
import MessagesArea from "./MessagesArea";
import { useSocketContext } from "../../contexts/socket.context";
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";

function ChatWindow({ activeChat, messages, send, isTyping, onBack }) {
  const { socket } = useSocketContext();

  // 1. EMPTY STATE (No chat selected)
  if (!activeChat) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 bg-slate-900/50 backdrop-blur-sm">
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <span className="text-4xl grayscale">👋</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Welcome to Messages</h3>
        <p className="max-w-xs mx-auto">Select a conversation from the sidebar to start chatting.</p>
      </div>
    );
  }

  // 2. ACTIVE CHAT UI
  return (
    <div className="flex flex-col h-full w-full bg-slate-950/30">
      
      {/* --- HEADER --- */}
      <div className="flex-none flex items-center justify-between p-3 md:p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md z-10">
        
        {/* LEFT: Back Btn + Avatar + Name */}
        <div className="flex items-center gap-3 overflow-hidden mr-2">
          {/* Back Button (Mobile) */}
          <button 
            onClick={onBack}
            className="md:hidden -ml-1 p-2 text-slate-400 hover:text-white rounded-full active:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                {activeChat.user.avatar?.url ? (
                    <img 
                        src={activeChat.user.avatar.url} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold bg-slate-800">
                        {activeChat.user.fullName?.[0]?.toUpperCase()}
                    </div>
                )}
            </div>
            
            {/* Online/Typing Indicator Badge */}
            {isTyping && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full animate-bounce"></span>
            )}
          </div>

          {/* Name & Status */}
          <div className="flex flex-col overflow-hidden justify-center">
            <h2 className="text-white font-bold text-sm md:text-base truncate leading-tight">
              {activeChat?.user?.fullName}
            </h2>
            
            <div className="h-4 flex items-center">
                {isTyping ? (
                    <span className="text-xs font-medium text-green-400 animate-pulse">
                        typing...
                    </span>
                ) : (
                    <span className="text-xs text-slate-400 truncate">
                        @{activeChat?.user?.username}
                    </span>
                )}
            </div>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <button className="p-2 hover:bg-slate-800 rounded-full transition hover:text-white">
                <Phone size={18} />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-full transition hover:text-white">
                <Video size={18} />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-full transition hover:text-white">
                <MoreVertical size={18} />
            </button>
        </div>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")` }}>
          </div>
          
          <MessagesArea messages={messages} chatType="private" />
      </div>
      
      {/* --- INPUT AREA --- */}
      <div className="shrink-0 bg-slate-900 border-t border-slate-800"> 
        <MessageInput
          onTyping={() => socket.emit("private:typing", { to: activeChat.user._id })}
          onSend={(text) => send(text)}
        />
      </div>
    </div>
  );
}

export default ChatWindow;