import { createContext, useContext, useEffect, useRef } from "react";
import { io } from 'socket.io-client';
import { useUserContext } from "./UserContext"; // Import your UserContext

const SocketContext = createContext(null);

export const useSocketContext = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error("useSocketContext must be used within SocketContextProvider");
    return ctx;
};

export const SocketContextProvider = ({ children }) => {
    // 1. Get the authToken directly from your UserContext
    const { authToken } = useUserContext(); 
    const socketRef = useRef(null);

    const socketURL = import.meta.env.PROD 
      ? (import.meta.env.VITE_PROD_API || "https://reviclash.onrender.com")
      : (import.meta.env.VITE_LOCAL_API || "http://localhost:4000");

    useEffect(() => {
        // Only connect if we have a token!
        if (authToken && !socketRef.current) {
            
            socketRef.current = io(socketURL, {
                transports: ["websocket"], // Force websocket for Render stability
                withCredentials: true,     // Keep this for cookies (optional now but good to have)
                auth: {
                    token: authToken       
                }
            });

            const socket = socketRef.current;
            socket.on("connect", () => console.log("🟢 Connected:", socket.id));
            socket.on("connect_error", (err) => console.log("🔴 Connection Error:", err.message));

            return () => {
                socket.disconnect();
                socketRef.current = null;
            };
        } else if (!authToken && socketRef.current) {
            // If user logs out, kill the socket
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, [authToken]); // Re-run this when authToken changes (login/logout)

    return (
        <SocketContext.Provider value={{ socket: socketRef.current }}>
            {children}
        </SocketContext.Provider>
    );
};