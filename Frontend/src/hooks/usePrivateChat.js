import { useState, useEffect, useCallback, useRef } from "react";
import { useSocketContext } from '../contexts/socket.context.jsx'
import { getPrivateMessagesService, clearConversationService } from "../services/privateMessage.services.js";
import { useUserContext } from "../contexts/UserContext";
import toast from "react-hot-toast";

export const usePrivateChat = ({ otherUserId }) => {
    const { socket } = useSocketContext()
    const [messages, setMessages] = useState([])
    const { user } = useUserContext();
    const [isTyping, setIsTyping] = useState(false);

    // [State for pagination]
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const seenRef = useRef(false);

    useEffect(() => {
        if (!socket || !otherUserId || messages.length === 0) return;
        if (seenRef.current) return;

        const unreadIds = messages
            .filter(m => !m.fromMe && m.status !== "read")
            .map(m => m.id);

        if (unreadIds.length > 0) {
            socket.emit("private:seen", {
                messageIds: unreadIds,
                otherUserId
            });
        }

        seenRef.current = true;
    }, [messages, otherUserId, socket]);


    const normalizePrivateMessage = useCallback(
        (msg) => ({
            id: msg._id,
            text: msg.message,
            sender: msg.senderId,
            senderId: msg.senderId?._id || msg.senderId,
            fromMe: String(msg.senderId?._id || msg.senderId) === String(user?._id),
            status: msg.status,
            type: "text",
            createdAt: msg.createdAt,
        }),
        [user?._id]
    );

    const fetchMessages = async (currentCursor = null) => {
        if (currentCursor) setIsLoadingMore(true);
            
        try {
            const res = await getPrivateMessagesService(otherUserId, currentCursor);

            if(res && res.messages.length > 0){
                const normalized = res.messages.map(normalizePrivateMessage);

                setMessages(prev => {
                    if (currentCursor) {
                        // Prepend older messages
                        return [...normalized, ...prev];
                    }
                    return normalized; // Initial load
                });

                setCursor(res.nextCursor);
                setHasMore(!!res.nextCursor);
            } else{
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load messages", error);
        } finally {
            if (currentCursor) setIsLoadingMore(false);
        }
    }

    // [loadMore function exposed to UI]
    const loadMore = useCallback(() => {
        if (!isLoadingMore && hasMore && cursor) {
            fetchMessages(cursor);
        }
    }, [cursor, hasMore, isLoadingMore, otherUserId]);

    // [clearConversation function]
    const clearConversation = async () => {
        try {
            await clearConversationService(otherUserId);
            setMessages([]);
            setCursor(null);
            setHasMore(false);
            toast.success("Conversation cleared");
        } catch (error) {
            toast.error("Failed to clear conversation");
        }
    };


    useEffect(() => {
        if (!otherUserId) return;

        seenRef.current = false;


        setMessages([]);
        setCursor(null);
        setHasMore(true);

        // const fetchAllMessages = async () => {
        //     const res = await getPrivateMessagesService(otherUserId);
        //     if (res && res.length > 0) {
        //         const normalized = res.map(normalizePrivateMessage);
        //         setMessages(normalized);
        //     }
        // };

        // fetchAllMessages();
        fetchMessages();

        const activeRoom = otherUserId
            ? `private:${[user._id, otherUserId].sort().join(":")}`
            : null;


        socket.emit('private:join' , { otherUserId });
        const typingHandler = (fromUserId) => {
        if (String(fromUserId) !== String(otherUserId)) return;
            setIsTyping(true);

            // auto clear after 1.5s
            setTimeout(() => setIsTyping(false), 1500);
        };

        socket.on("private:typing", typingHandler);


        const handler = (msg) => {
            if (msg.conversationId !== activeRoom) return;

            const normalized = normalizePrivateMessage(msg);

            setMessages(prev => {
                //  DEDUPE BY MESSAGE ID
                if (prev.some(m => m.id === normalized.id)) {
                    return prev;
                }
                return [...prev, normalized];
            });
        };


        socket.on('private:receive', handler)

        return () => {
            socket.off("private:receive", handler);
            socket.off("private:typing", typingHandler);
            socket.emit("private:leave", { otherUserId });
        };


    }, [otherUserId])

    const send = ( message ) => {
        if (!message?.trim()) return;
        socket.emit("private:send", { to: otherUserId, message });
    }

    return { messages, send,  isTyping, loadMore, hasMore, isLoadingMore, clearConversation };
}