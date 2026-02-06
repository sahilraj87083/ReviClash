import { useRef, useState, useEffect } from "react";
import { ChatSidebar, ChatWindow } from "../components";
import { useInbox } from '../hooks/useInbox.js';
import { usePrivateChat } from "../hooks/usePrivateChat.js";

function Messages() {
  const containerRef = useRef(null);
  const [activeChat, setActiveChat] = useState(null);
  const { inbox } = useInbox();
  
  const { messages, send, isTyping } = usePrivateChat({ 
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
      // Changed to 100dvh for better mobile address bar handling
      className="h-[calc(100dvh-64px)] md:h-[calc(100vh-80px)] bg-slate-900 flex overflow-hidden"
    >
      {/* SIDEBAR LOGIC */}
      <div 
        className={`
          ${activeChat ? "hidden md:flex" : "flex"} 
          w-full md:w-auto h-full
        `}
      >
        <ChatSidebar
          inbox={inbox}
          activeChat={activeChat}
          onSelect={handleSelectChat}
        />
      </div>

      {/* CHAT WINDOW LOGIC */}
      <div 
        className={`
          ${activeChat ? "flex" : "hidden md:flex"} 
          flex-1 h-full
        `}
      >
        <ChatWindow
          activeChat={activeChat}
          messages={messages}
          send={send}
          isTyping={isTyping}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}

export default Messages;