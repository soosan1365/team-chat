//مدیریت درخواست؛ اول ذخیره پیام را صدا می‌زند، بعد تابع ارسال Socket را فراخوانی می‌کند
import type { Request, Response } from "express";

import {
  getRoomMessages,
  getUnreadMessagesCount,
  createMessage,
  markRoomAsRead,
  updateMessage,
  deleteMessage,
} from "../services/message.service.js";
import { emitNewMessage } from "../services/message.socket.js";
import { isUserRoomMember } from "../../rooms/services/room.service.js";
import { prisma } from "../../../lib/prisma.js";
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
  req: Request<
    { roomId: string },
    unknown,
    { content: string; replyToId?: string | null }
  >,
  res: Response,
) {
  try {
    const { roomId } = req.params;
    const { content, replyToId } = req.body;
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
    if (replyToId != null) {
      const originalMessage = await prisma.message.findFirst({
        where: {
          id: replyToId,
          roomId,
        },
        select: { id: true },
      });

      if (!originalMessage) {
        res.status(400).json({
          message: "Original message not found in this room",
        });
        return;
      }
    }

    const message = await createMessage({
      content: content.trim(),
      userId: userId.trim(),
      roomId,
      replyToId: replyToId ?? null,
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
export async function updateMessageController(
  req: Request<
    { roomId: string; messageId: string },
    unknown,
    { content: string }
  >,
  res: Response,
) {
  try {
    const { roomId, messageId } = req.params;
    const userId = req.userId;
    const { content } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const isMember = await isUserRoomMember(userId, roomId);

    if (!isMember) {
      res.status(403).json({ message: "Access denied to this room" });
      return;
    }

    if (typeof content !== "string" || !content.trim()) {
      res.status(400).json({ message: "Content is required" });
      return;
    }

    const message = await updateMessage(
      messageId,
      userId,
      roomId,
      content.trim(),
    );

    emitNewMessage(roomId, message);
    res.json(message);
  } catch (error) {
    if (error instanceof Error &&
        error.message === "Message not found or unauthorized") {
      res.status(404).json({ message: error.message });
      return;
    }

    console.error("Failed to update message:", error);
    res.status(500).json({ message: "Failed to update message" });
  }
}
export async function deleteMessageController(
  req: Request<{ roomId: string; messageId: string }>,
  res: Response,
) {
  try {
    const { roomId, messageId } = req.params;
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

    await deleteMessage(messageId, userId, roomId);

    emitNewMessage(roomId, { id: messageId, deleted: true });
    res.status(204).end();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Message not found or unauthorized"
    ) {
      res.status(404).json({ message: error.message });
      return;
    }

    console.error("Failed to delete message:", error);
    res.status(500).json({ message: "Failed to delete message" });
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

export async function markRoomAsReadController(
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

    await markRoomAsRead(userId, roomId);
    res.status(204).end();
  } catch (error) {
    console.error("Failed to mark room as read:", error);
    res.status(500).json({ message: "Failed to mark room as read" });
  }
}
export async function getUnreadMessagesCountController(
  req: Request,
  res: Response,
) {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const count = await getUnreadMessagesCount(userId);

    res.json({ count });
  } catch (error) {
    console.error("Failed to get unread messages count:", error);
    res.status(500).json({ message: "Failed to get unread messages count" });
  }
}
