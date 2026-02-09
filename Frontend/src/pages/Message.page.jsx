import { useRef, useState, useEffect } from "react";
import { ChatSidebar, ChatWindow } from "../components";
import { useInbox } from '../hooks/useInbox.js';
import { usePrivateChat } from "../hooks/usePrivateChat.js";

function Messages() {
  const containerRef = useRef(null);
  const [activeChat, setActiveChat] = useState(null);
  const { inbox } = useInbox();
  
  const { messages, send, isTyping, loadMore, hasMore, isLoadingMore, clearConversation} = usePrivateChat({ 
    otherUserId: activeChat?.user?._id 
  });

  const handleSelectChat = (chat) => {
    chat.unreadCount = 0;
    setActiveChat(chat);
  };

  const handleBack = () => {
    setActiveChat(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleBack();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        relative bg-slate-950 w-full overflow-hidden
        
        /* Mobile: Fixed Header/Nav compensation */
        h-[100dvh] pt-16 pb-[60px] 
        
        /* Desktop: Sticky Header compensation */
        md:h-[calc(100vh-80px)] md:pt-0 md:pb-0
      "
    >
      {/* Background Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950"></div>
      </div>

      <div className="relative z-10 flex h-full max-w-7xl mx-auto md:px-6 md:py-6">
        
        {/* MAIN GLASS CONTAINER */}
        <div className="w-full h-full flex bg-slate-900/50 backdrop-blur-xl border-x md:border border-slate-800 md:rounded-2xl shadow-2xl overflow-hidden">
            
            {/* SIDEBAR */}
            <div 
              className={`
                ${activeChat ? "hidden md:flex" : "flex"} 
                w-full md:w-80 lg:w-96 h-full flex-col border-r border-slate-800
              `}
            >
              <ChatSidebar
                inbox={inbox}
                activeChat={activeChat}
                onSelect={handleSelectChat}
              />
            </div>

            {/* CHAT WINDOW */}
            <div 
              className={`
                ${activeChat ? "flex" : "hidden md:flex"} 
                flex-1 h-full flex-col bg-slate-950/30
              `}
            >
              <ChatWindow
                activeChat={activeChat}
                messages={messages}
                send={send}
                isTyping={isTyping}
                onBack={handleBack}
                loadMore={loadMore}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                clearConversation={clearConversation}
              />
            </div>

        </div>
      </div>
    </div>
  );
}

export default Messages;