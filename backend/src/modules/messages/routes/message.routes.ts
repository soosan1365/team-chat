// تعیین آدرس‌های API برای دریافت و ارسال پیام
import { Router } from "express";
import { getRoomMessagesController } from "../controllers/message.controller.js";
import { createMessageController } from "../controllers/message.controller.js";
import { authenticateToken } from "../../../middlewares/auth.middleware.js";
import { uploadAudio } from "../../../middlewares/upload.middleware.js";
import { createAudioMessageController } from "../controllers/message.controller.js";

const router = Router();

router.get(
  "/rooms/:roomId/messages",
  authenticateToken,
  getRoomMessagesController,
);
router.post(
  "/rooms/:roomId/messages",
  authenticateToken,
  createMessageController,
);
router.post(
  "/rooms/:roomId/audio",
  authenticateToken,
  uploadAudio.single("audio"),
  createAudioMessageController,
);

export default router;
