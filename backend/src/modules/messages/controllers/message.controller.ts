
import type { Request, Response } from "express";
import { getRoomMessages } from "../services/message.service.js";
import { createMessage } from "../services/message.service.js";
import { emitNewMessage } from "../services/message.socket.js";
export async function getRoomMessagesController(
  req: Request<{ roomId: string }>,
  res: Response,
) {
  try {
    const { roomId } = req.params;
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
    { content: string; userId: string }
  >,
  res: Response,
) {
  try {
    const { roomId } = req.params;
    const { content, userId } = req.body;

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
emitNewMessage(roomId, message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Failed to create message:", error);

    res.status(500).json({
      message: "Failed to create message",
    });
  }
}
