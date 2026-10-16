// تعیین آدرس‌های API برای دریافت و ارسال پیام
import { Router } from "express";
import { getRoomMessagesController, getUnreadMessagesCountController, markRoomAsReadController } from "../controllers/message.controller.js";
import { createMessageController } from "../controllers/message.controller.js";
import { authenticateToken } from "../../../middlewares/auth.middleware.js";
import { uploadAudio } from "../../../middlewares/upload.middleware.js";
import { createAudioMessageController } from "../controllers/message.controller.js";
import { uploadAttachment } from "../../../middlewares/upload.middleware.js";
import { createAttachmentMessageController } from "../controllers/message.controller.js";

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
router.post(
  "/rooms/:roomId/attachments",
  authenticateToken,
  uploadAttachment.single("file"),
  createAttachmentMessageController,
);
router.patch(
  "/rooms/:roomId/read",
  authenticateToken,
  markRoomAsReadController,
);
router.get(
  "/messages/unread-count",
  authenticateToken,
  getUnreadMessagesCountController,
);
export default router;
