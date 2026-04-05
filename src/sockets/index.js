import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import AuthenticationError from "../errors/AuthenticationError.js";

let io;

// Map to store userId and their active socket IDs (optional if using rooms)
const userSockets = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    allowEIO3: true,
    transports: ["polling", "websocket"],
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new AuthenticationError("No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new AuthenticationError("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `>>> User connected: ${socket.userId} (SocketID: ${socket.id})`
    );

    userSockets.set(socket.userId, socket.id);
    socket.join(socket.userId); // Join private room based on userId

    socket.on("disconnect", () => {
      console.log(`>>> User disconnected: ${socket.userId}`);
      userSockets.delete(socket.userId);
    });
  });

  return io;
};

export const getIO = () => io;

/**
 * Emit event to a specific user via their private room
 */
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};
