import { useRef, useLayoutEffect, useEffect } from "react";
import { Loader2 } from "lucide-react";

// --- HELPERS ---

// 1. Check if two dates are the same day
const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// 2. Format Date Label (Today, Yesterday, or Jul 12, 2025)
const getRelativeDateLabel = (dateObj) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(dateObj, today)) return "Today";
  if (isSameDay(dateObj, yesterday)) return "Yesterday";
  
  return dateObj.toLocaleDateString([], { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

// 3. Format Time (Existing helper)
const formatTime = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};


function MessagesArea({ 
  messages, 
  chatType = "public", 
  onLoadMore = null, 
  hasMore = false, 
  isLoadingMore = false 
}) {
  const containerRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const isFirstLoadRef = useRef(true);

  // --- SCROLL HANDLERS (Unchanged) ---
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && onLoadMore && hasMore && !isLoadingMore) {
        prevScrollHeightRef.current = container.scrollHeight;
        onLoadMore();
    }
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isFirstLoadRef.current && messages.length > 0) {
        container.scrollTop = container.scrollHeight;
        isFirstLoadRef.current = false;
        return;
    }

    if (onLoadMore && isLoadingMore === false && prevScrollHeightRef.current > 0) {
        const newScrollHeight = container.scrollHeight;
        const diff = newScrollHeight - prevScrollHeightRef.current;
        container.scrollTop = diff;
        prevScrollHeightRef.current = 0;
    } 
    else if (!isLoadingMore && prevScrollHeightRef.current === 0) {
        const threshold = 150;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
        const lastMsg = messages[messages.length - 1];
        
        if (lastMsg?.fromMe || isNearBottom) {
             container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
        }
    }
  }, [messages, isLoadingMore, onLoadMore]);

  useEffect(() => {
      if (messages.length === 0) {
         isFirstLoadRef.current = true;
      }
  }, [messages.length]);


  // --- RENDER ---
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
    >
      {/* Loading Indicator */}
      {isLoadingMore && (
          <div className="flex justify-center py-2 shrink-0 animate-in fade-in slide-in-from-top-1">
              <Loader2 className="animate-spin text-slate-500" size={18} />
          </div>
      )}

      {messages.map((msg, i) => {
        // --- DATE SEPARATOR LOGIC ---
        const currentDate = new Date(msg.createdAt);
        const prevDate = i > 0 ? new Date(messages[i - 1].createdAt) : null;
        
        // Show separator if it's the first message OR date changed from previous message
        const showDateSeparator = i === 0 || !isSameDay(currentDate, prevDate);


        return (
          <div key={msg.id || i} className="flex flex-col">
            
            {/* 1. DATE SEPARATOR */}
            {showDateSeparator && (
                <div className="flex justify-center my-4 sticky top-0 z-10">
                    <span className="bg-slate-900/60 backdrop-blur-sm text-slate-400 text-[11px] font-bold px-3 py-1 rounded-full border border-slate-800 shadow-sm">
                        {getRelativeDateLabel(currentDate)}
                    </span>
                </div>
            )}

            {/* 2. SYSTEM MESSAGES */}
            {msg.type === "system" ? (
                <div className="flex justify-center py-2 my-2">
                    <span className="bg-slate-800/80 text-slate-400 text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700/50">
                        {msg.text}
                    </span>
                </div>
            ) : (
                // 3. USER MESSAGES
                (() => {
                    const isMe = msg.fromMe;
                    const prevMsg = messages[i - 1];
                    const isSequence = prevMsg && prevMsg.senderId === msg.senderId && prevMsg.type !== "system" && !showDateSeparator; // Reset sequence if date changed
                    
                    const avatar = msg.sender?.avatar?.url;
                    const name = msg.sender?.fullName || "User";
                    const time = formatTime(msg.createdAt);

                    return (
                        <div
                            className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${isSequence ? "mt-0.5" : "mt-4"} animate-in fade-in slide-in-from-bottom-1 duration-300`}
                        >
                            {/* Sender Name (Public Only) */}
                            {!isMe && chatType === "public" && !isSequence && (
                                <span className="text-[10px] text-slate-400 ml-10 mb-1 font-bold">
                                    {name}
                                </span>
                            )}

                            <div className={`flex gap-2 max-w-[85%] md:max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                {/* Avatar */}
                                {!isMe ? (
                                    <div className="w-8 h-8 shrink-0 flex items-end">
                                        {!isSequence ? (
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-700">
                                                {avatar ? (
                                                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                                                ) : (
                                                    name[0]?.toUpperCase()
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-8" /> 
                                        )}
                                    </div>
                                ) : null}

                                {/* Bubble */}
                                <div
                                    className={`group relative px-4 py-2.5 text-sm shadow-sm break-words
                                        ${isMe 
                                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                                            : "bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm border border-slate-700"
                                        }
                                    `}
                                >
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    <div className={`text-[9px] mt-1 text-right opacity-60 font-medium ${isMe ? "text-blue-100" : "text-slate-400"}`}>
                                        {time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()
            )}
          </div>
        );
      })}
      
      <div className="h-2" /> 
    </div>
  );
}

export default MessagesArea;