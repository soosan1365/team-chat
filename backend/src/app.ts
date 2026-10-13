//تنظیمات Express و مسیرهای HTTP را نگه می‌دارد.
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import roomRoutes from "./modules/rooms/routes/room.routes.js";
import messageRoutes from "./modules/messages/routes/message.routes.js";
const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/api/rooms", roomRoutes);
app.use("/api", messageRoutes);

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
