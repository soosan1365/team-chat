//نگهداری اتصال Socket.IO و تعریف تابع ارسال پیام به اعضای اتاق
import type { Server } from "socket.io";

let io: Server | null = null;

export function setMessageSocket(server: Server) {
  io = server;
}

export function emitNewMessage(roomId: string, message: unknown) {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  io.to(roomId).emit("new-message", message);
}
