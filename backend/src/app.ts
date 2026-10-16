//تنظیمات Express و مسیرهای HTTP را نگه می‌دارد.
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import roomRoutes from "./modules/rooms/routes/room.routes.js";
import messageRoutes from "./modules/messages/routes/message.routes.js";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import path from "node:path";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://team-chat-jz7u.vercel.app",
    "https://team-chat-jz7u-git-main-soosan1365s-projects.vercel.app",
"https://team-chat-jz7u-5qwm5yoc6-soosan1365s-projects.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/rooms", roomRoutes);
app.use("/api", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.resolve("uploads")));
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

export default app;
