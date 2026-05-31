import { Server } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { Server as HTTPServer } from "node:http";
import prisma from "./prisma.js";

let io: Server;

export function setupSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) {
      return next(new Error("Not Authenticated!"));
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, payload) => {
      if (err) {
        return next(new Error("Token not valid!"));
      }
      const userId = (payload as JwtPayload).id as string;
      (socket as any).userId = userId;
      next();
    });
  });

  io.on("connection", async (socket) => {
    try {
      const userId = (socket as any).userId as string;

      socket.join(userId);

      const chats = await prisma.chat.findMany({
        where: { userIDs: { has: userId } },
        select: { id: true },
      });

      chats.forEach((chat) => {
        socket.join(chat.id);
      });
    } catch (err) {
      console.log("Socket connection error:", err);
    }
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
