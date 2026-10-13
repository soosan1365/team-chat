//سرور HTTP و Socket.IO را راه‌اندازی می‌کند.
import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { createDefaultRooms } from "./modules/rooms/services/room.service.js";
import { setMessageSocket } from "./modules/messages/services/message.socket.js";
const httpServer = createServer(app);
//ساخت سرور Socket.IO و مدیریت اتصال و ورود و خروج کاربران از اتاق‌ها
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
setMessageSocket(io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
  
socket.on("join-room", (roomId: string) => {
  socket.join(roomId);
  console.log(`Socket ${socket.id} joined room ${roomId}`);
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
