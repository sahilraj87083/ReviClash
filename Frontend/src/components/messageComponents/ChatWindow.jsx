import MessageInput from "./MessageInput";
import MessagesArea from "./MessagesArea";
import { useSocketContext } from "../../contexts/socket.context";

function ChatWindow({ activeChat, messages, send, isTyping, onBack }) {
  const { socket } = useSocketContext();

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 h-full">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    // CONTAINER:
    // Mobile: 'fixed inset-0 z-50' covers the entire screen (hiding bottom nav)
    // Mobile: 'h-[100dvh]' ensures input doesn't hide behind browser UI
    // Desktop: 'md:static' resets it to normal layout
    <section 
      className="fixed inset-0 z-50 bg-slate-900 flex flex-col h-[100dvh] md:static md:h-full md:z-auto md:w-full"
    >
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900 shrink-0 h-16">
        <button 
          onClick={onBack}
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
        >
          <i className="ri-arrow-left-line text-xl"></i>
        </button>

        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs overflow-hidden">
             {activeChat.user.avatar ? (
                <img src={activeChat.user.avatar.url} alt="avatar" className="w-full h-full object-cover"/>
             ) : (
                activeChat.user.fullName[0]
             )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <h2 className="text-white font-semibold text-lg truncate leading-tight">
            {activeChat?.user?.fullName}
          </h2>
          
          {isTyping && (
            <span className="text-xs italic font-semibold text-green-500 animate-pulse truncate">
              typing…
            </span>
          )}
        </div>
      </div>

      {/* Messages Area - flex-1 ensures it takes all available space */}
      <MessagesArea messages={messages} chatType="private" />
      
      {/* Input Area - shrink-0 ensures it never gets squashed */}
      <div className="shrink-0"> 
        <MessageInput
          onTyping={() =>
            socket.emit("private:typing", { to: activeChat.user._id })
          }
          onSend={(text) => send(text)}
        />
      </div>
    </section>
  );
}

export default ChatWindow;