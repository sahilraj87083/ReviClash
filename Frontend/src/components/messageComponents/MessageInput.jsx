import { useState } from "react";
import { Smile, Paperclip, Send, Mic } from "lucide-react";

function MessageInput({ onSend, onTyping }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 md:p-4 bg-slate-900 border-t border-slate-800">
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
        
        {/* ATTACHMENTS (Hidden on small mobile if needed, but keeping for now) */}
        <button className="p-2 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-slate-800">
            <Paperclip size={20} />
        </button>

        {/* MAIN INPUT */}
        <div className="flex-1 flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-full px-4 py-2 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
          <input
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-slate-500 min-w-0"
            autoComplete="off"
          />
          <button className="text-slate-500 hover:text-white transition-colors">
             <Smile size={20} />
          </button>
        </div>

        {/* SEND BUTTON */}
        <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className={`
                p-3 rounded-full transition-all shadow-lg active:scale-95 flex items-center justify-center
                ${message.trim() 
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20" 
                    : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                }
            `}
        >
            {message.trim() ? <Send size={18} className="ml-0.5" /> : <Mic size={20} />}
        </button>

      </div>
    </div>
  );
}

export default MessageInput;