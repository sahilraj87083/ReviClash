import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socket.auth.js";
import { registerSocketHandlers } from "./registerSocketHandlers.js";

let io;

/**
 * Initialize socket server
 */

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",           // Local Dev
                "https://revi-clash.vercel.app",   // Production Vercel
                process.env.FRONTEND_URL           // Fallback from Env Var
            ],
            credentials: true,
            methods: ["GET", "POST"],
            allowedHeaders: ["Cookie", "Authorization"],
        },
        // Force Websockets to avoid Render "Sticky Session" issues
        transports: ['websocket', 'polling']
    });
    io.use(socketAuthMiddleware); 

    registerSocketHandlers(io)
};

/**
 * Emit event to all users in contest
 */
const emitToContest = (contestId, event, data) => {
    if (!io) {
        console.log("Socket.io not initialized");
        return;
    }

    io.to(contestId.toString()).emit(event, data);
};

/**
 * Emit event to specific socket
 */
const emitToSocket = (socketId, event, data) => {
    if (!io) {
        console.log("Socket.io not initialized");
        return;
    }

    io.to(socketId).emit(event, data);
};

export {
  initializeSocket,
  emitToContest,
  emitToSocket,
  io
};
