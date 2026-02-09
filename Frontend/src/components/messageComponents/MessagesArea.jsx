import { useRef, useLayoutEffect, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Helper to format time
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
  // Pagination props (Optional - default to disabled)
  onLoadMore = null, 
  hasMore = false, 
  isLoadingMore = false 
}) {
  const containerRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const isFirstLoadRef = useRef(true);

  // --- 1. HANDLE SCROLL TO TOP (Pagination Trigger) ---
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    // Only trigger if:
    // 1. We are at the top (scrollTop === 0)
    // 2. We have a pagination handler (onLoadMore exists)
    // 3. There is more data (hasMore)
    // 4. We aren't already loading
    if (container.scrollTop === 0 && onLoadMore && hasMore && !isLoadingMore) {
        prevScrollHeightRef.current = container.scrollHeight;
        onLoadMore();
    }
  };

  // --- 2. SCROLL POSITION MANAGEMENT ---
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // A. INITIAL LOAD (Works for both Contest & Private)
    if (isFirstLoadRef.current && messages.length > 0) {
        container.scrollTop = container.scrollHeight;
        isFirstLoadRef.current = false;
        return;
    }

    // B. PAGINATION LOAD RESTORE (Private Chat only)
    // If we just finished loading more, restore scroll position
    if (onLoadMore && isLoadingMore === false && prevScrollHeightRef.current > 0) {
        const newScrollHeight = container.scrollHeight;
        const diff = newScrollHeight - prevScrollHeightRef.current;
        container.scrollTop = diff; // Jump to visual position
        prevScrollHeightRef.current = 0;
    } 
    
    // C. NEW MESSAGE AUTO-SCROLL (Both)
    // If not paginating, handle auto-scroll for new incoming messages
    else if (!isLoadingMore && prevScrollHeightRef.current === 0) {
        const threshold = 150;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
        const lastMsg = messages[messages.length - 1];
        
        // Scroll down if I sent it OR if user is already near bottom
        if (lastMsg?.fromMe || isNearBottom) {
             container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
        }
    }

  }, [messages, isLoadingMore, onLoadMore]);

  // Reset first load ref if chat ID changes (conceptually, if messages clear out)
  useEffect(() => {
      if (messages.length === 0) {
         isFirstLoadRef.current = true;
      }
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
    >
      {/* Loading Indicator (Only shows if paginating) */}
      {isLoadingMore && (
          <div className="flex justify-center py-2 shrink-0 animate-in fade-in slide-in-from-top-1">
              <Loader2 className="animate-spin text-slate-500" size={18} />
          </div>
      )}

      {messages.map((msg, i) => {
        // --- 1. SYSTEM MESSAGES ---
        if (msg.type === "system") {
          return (
            <div key={msg.id || i} className="flex justify-center py-2 my-2">
                <span className="bg-slate-800/80 text-slate-400 text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700/50">
                    {msg.text}
                </span>
            </div>
          );
        }

        // --- 2. USER MESSAGES ---
        const isMe = msg.fromMe;
        const prevMsg = messages[i - 1];
        
        // Sequence check logic
        const isSequence = prevMsg && prevMsg.senderId === msg.senderId && prevMsg.type !== "system";
        
        const avatar = msg.sender?.avatar?.url;
        const name = msg.sender?.fullName || "User";
        const time = formatTime(msg.createdAt);

        return (
          <div
            key={msg.id || i}
            className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${isSequence ? "mt-0.5" : "mt-4"} animate-in fade-in slide-in-from-bottom-1 duration-300`}
          >
            {/* SENDER NAME (Public Chat / Contest Only) */}
            {!isMe && chatType === "public" && !isSequence && (
               <span className="text-[10px] text-slate-400 ml-10 mb-1 font-bold">
                  {name}
               </span>
            )}

            <div className={`flex gap-2 max-w-[85%] md:max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              
              {/* AVATAR */}
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

              {/* BUBBLE */}
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
      })}
      
      <div className="h-2" /> 
    </div>
  );
}

export default MessagesArea;