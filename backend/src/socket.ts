import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketServer;

export const initSocket = (server: HttpServer): SocketServer => {
  io = new SocketServer(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("authenticate_socket", (userId: number) => {
      socket.join(`user_${userId}`);
      console.log(`[Socket] User ${userId} is online and listening.`);
    });
  });

  return io;
};

export const getIo = (): SocketServer => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
