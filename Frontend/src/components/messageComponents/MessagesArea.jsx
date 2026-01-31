import { useEffect, useRef } from "react";

function MessagesArea({ messages, currentUserId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nearBottom =
      container.scrollHeight -
        container.scrollTop -
        container.clientHeight <
      200;

    if (nearBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
    >
      {messages.map((msg, i) => {
        // SYSTEM MESSAGE
        if (msg.type === "system") {
          return (
            <div
              key={msg.id || i}
              className="text-center text-xs text-slate-400"
            >
              {msg.text}
            </div>
          );
        }

        // const isMe = String (msg.sender._id) === String(currentUserId);
        const isMe = msg.fromMe;
        const avatar = msg.sender?.avatar?.url;
        const name = msg.sender?.fullName || "User";

        return (
          <div
            key={msg.id || i}
            className={`flex items-end gap-2 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar for other users */}
            {!isMe && (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-xs text-white">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full" />
                ) : (
                  name[0].toUpperCase()
                )}
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words ${
                isMe
                  ? "bg-red-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-200 rounded-bl-none"
              }`}
            >
              {!isMe && (
                <p className="text-xs text-slate-400 mb-1">{name}</p>
              )}
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessagesArea;
