import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Input } from "../components";

function Messages() {
  const containerRef = useRef(null);
  const [activeChat, setActiveChat] = useState(null);

  useGSAP(() => {
    gsap.from(".chat-animate", {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-80px)] bg-slate-900 flex"
    >
      <ChatSidebar
        activeChat={activeChat}
        onSelect={setActiveChat}
      />

      <ChatWindow activeChat={activeChat} />
    </div>
  );
}

export default Messages;

function ChatSidebar({ activeChat, onSelect }) {
  const chats = [
    { id: 1, name: "Sahil", last: "Bro contest was fire 🔥" },
    { id: 2, name: "DSA Sprint #12", last: "Contest starts in 5 mins" },
    { id: 3, name: "Rahul", last: "Let's practice DP today" },
  ];

  return (
    <aside className="w-80 border-r border-slate-800 flex flex-col">
      {/* Search */}
      <div className="p-4">
        <Input
          placeholder="Search chats..."
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none"
        />
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelect(chat)}
            className={`chat-animate w-full text-left px-4 py-3 border-b border-slate-800
              ${
                activeChat?.id === chat.id
                  ? "bg-slate-800"
                  : "hover:bg-slate-800/60"
              }
            `}
          >
            <p className="text-white font-medium">
              {chat.name}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {chat.last}
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
}
function ChatWindow({ activeChat }) {
  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-white font-semibold">
          {activeChat.name}
        </h2>

        {/* Optional actions */}
        <span className="text-xs text-slate-400">
          Online
        </span>
      </div>

      {/* Messages */}
      <MessagesArea />

      {/* Input */}
      <MessageInput />
    </section>
  );
}
function MessagesArea() {
  const messages = [
    { fromMe: false, text: "Hey ready for contest?" },
    { fromMe: true, text: "Yes! Let's go 🚀" },
    { fromMe: false, text: "Join link sent" },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-md px-4 py-2 rounded-lg text-sm
            ${
              msg.fromMe
                ? "ml-auto bg-red-600 text-white"
                : "bg-slate-800 text-slate-200"
            }
          `}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}

function MessageInput() {
  const [message, setMessage] = useState("");

  return (
    <div className="p-4 border-t border-slate-800 bg-slate-900">
      <div className="flex items-center gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="
            flex-1 px-4 py-2 rounded
            bg-slate-800 text-white
            border border-slate-700
            focus:outline-none focus:border-red-500
          "
        />

        <button
          type="button"
          onClick={() => {
            if (!message.trim()) return;
            console.log("send:", message);
            setMessage("");
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}


