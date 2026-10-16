//مدیریت درخواست؛ اول ذخیره پیام را صدا می‌زند، بعد تابع ارسال Socket را فراخوانی می‌کند
import type { Request, Response } from "express";
import { getRoomMessages } from "../services/message.service.js";
import { createMessage } from "../services/message.service.js";
import { emitNewMessage } from "../services/message.socket.js";
import { isUserRoomMember } from "../../rooms/services/room.service.js";
import path from "node:path";
export async function getRoomMessagesController(
  req: Request<{ roomId: string }>,
  res: Response,
) {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const isMember = await isUserRoomMember(userId, roomId);

    if (!isMember) {
      res.status(403).json({
        message: "Access denied to this room",
      });
      return;
    }

    const messages = await getRoomMessages(roomId);
    res.json(messages);
  } catch (error) {
    console.error("Failed to fetch room messages:", error);

    res.status(500).json({
      message: "Failed to fetch room messages",
    });
  }
}

export async function createMessageController(
  req: Request<{ roomId: string }, unknown, { content: string }>,
  res: Response,
) {
  try {
    const { roomId } = req.params;
    const { content } = req.body;
    const userId = req.userId;
    const isMember = await isUserRoomMember(userId ?? "", roomId);

    if (!isMember) {
      res.status(403).json({
        message: "Access denied to this room",
      });
      return;
    }
    if (
      typeof content !== "string" ||
      !content.trim() ||
      typeof userId !== "string" ||
      !userId.trim()
    ) {
      res.status(400).json({
        message: "content and userId are required",
      });
      return;
    }

    const message = await createMessage({
      content: content.trim(),
      userId: userId.trim(),
      roomId,
    });
    //تابعی که رویداد Socket.IO را ارسال می‌کند.
    emitNewMessage(roomId, message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Failed to create message:", error);

    res.status(500).json({
      message: "Failed to create message",
    });
  }
}
export async function createAudioMessageController(
  req: Request<{ roomId: string }>,
  res: Response,
) {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const isMember = await isUserRoomMember(userId, roomId);

    if (!isMember) {
      res.status(403).json({ message: "Access denied to this room" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "Audio file is required" });
      return;
    }

    const audioUrl = `/uploads/audio/${path.basename(req.file.filename)}`;

    const message = await createMessage({
      content: audioUrl,
      userId,
      roomId,
      type: "audio",
      audioUrl,
    });

    emitNewMessage(roomId, message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Failed to create audio message:", error);
    res.status(500).json({ message: "Failed to create audio message" });
  }
}
export async function createAttachmentMessageController(
  req: Request<{ roomId: string }>,
  res: Response,
) {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const isMember = await isUserRoomMember(userId, roomId);

    if (!isMember) {
      res.status(403).json({ message: "Access denied to this room" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "Attachment file is required" });
      return;
    }

    const fileUrl = `/uploads/attachments/${path.basename(req.file.filename)}`;

    const message = await createMessage({
      content: Buffer.from(req.file.originalname, "latin1").toString("utf8"),
      userId,
      roomId,
      type: "file",
      fileUrl,
      fileName: Buffer.from(req.file.originalname, "latin1").toString("utf8"),
    });

    emitNewMessage(roomId, message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Failed to create attachment message:", error);
    res.status(500).json({ message: "Failed to create attachment message" });
  }
}
