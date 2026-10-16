//سرور HTTP و Socket.IO را راه‌اندازی می‌کند.
import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { createDefaultRooms } from "./modules/rooms/services/room.service.js";
import { setMessageSocket } from "./modules/messages/services/message.socket.js";
import jwt from "jsonwebtoken";
import { isUserRoomMember } from "./modules/rooms/services/room.service.js";
import cookie from "cookie";
const httpServer = createServer(app);
//ساخت سرور Socket.IO و مدیریت اتصال و ورود و خروج کاربران از اتاق‌ها

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
setMessageSocket(io);
io.use((socket, next) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new Error("Authentication is not configured"));
  }

const cookies = cookie.parse(
  socket.handshake.headers.cookie ?? "",
);
const token = cookies.accessToken;


  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload === "string" ||
      typeof payload.userId !== "string"
    ) {
      return next(new Error("Invalid token"));
    }

    socket.data.userId = payload.userId;
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
  
socket.on("join-room", async (roomId: string) => {
  if (typeof roomId !== "string" || !roomId.trim()) {
    return;
  }

  try {
    const userId = socket.data.userId as string;

    const isMember = await isUserRoomMember(userId, roomId);

    if (!isMember) {
      socket.emit("room-error", "You are not a member of this room");
      return;
    }

    await socket.join(roomId);
console.log("Socket joined room:", roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  } catch (error) {
    console.error("Failed to join room:", error);
    socket.emit("room-error", "Could not join room");
  }
});
socket.on("leave-room", (roomId: string) => {
  socket.leave(roomId);
  console.log(`Socket ${socket.id} left room ${roomId}`);
});

});

async function startServer() {
  try {
    await createDefaultRooms();

    httpServer.listen(4000, () => {
      console.log("Server running on http://localhost:4000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void startServer();
