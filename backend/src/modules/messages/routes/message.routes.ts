// تعیین آدرس‌های API برای دریافت و ارسال پیام
import { Router } from "express";
import { getRoomMessagesController } from "../controllers/message.controller.js";
import { createMessageController } from "../controllers/message.controller.js";
import { authenticateToken } from "../../../middlewares/auth.middleware.js";
const router = Router();

router.get("/rooms/:roomId/messages", getRoomMessagesController);
router.post(
  "/rooms/:roomId/messages",
  authenticateToken,
  createMessageController,
);

export default router;
