import { useRef, useState } from "react";
import { ChatSidebar , ChatWindow} from "../components";
import { useInbox } from '../hooks/useInbox.js'
import { usePrivateChat } from "../hooks/usePrivateChat.js";

function Messages() {
  const containerRef = useRef(null);
  const [activeChat, setActiveChat] = useState();
  const { inbox } = useInbox()
  const { messages, send, loadMore, hasMore, isTyping } = usePrivateChat({ otherUserId : activeChat?.user?._id})

  const handleSelectChat = (chat) => {
      // Optimistic unread clear
      chat.unreadCount = 0;
      setActiveChat(chat);
  };


  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-80px)] bg-slate-900 flex"
    >
      <ChatSidebar
        inbox = {inbox}
        activeChat={activeChat}
        onSelect={handleSelectChat}
      />

      <ChatWindow activeChat={activeChat} messages = {messages} send = {send} isTyping={isTyping} loadMore={loadMore} hasMore={hasMore}/>
    </div>
  );
}

export default Messages;


