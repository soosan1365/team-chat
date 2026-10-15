
import type { Request, Response } from "express";
import { getRooms } from "../services/room.service.js";
import { joinRoom } from "../services/room.service.js";

export async function getRoomsController(
  req: Request,
  res: Response
) {
  console.log("Current userId:", req.userId);
  try {
    const rooms = await getRooms(req.userId);
    res.json(rooms);
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
}

export async function joinRoomController(
  req: Request<{ roomId: string }>,
  res: Response,
) {
  try {
    const userId = req.userId;
    const { roomId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    await joinRoom(userId, roomId);

    res.status(200).json({ message: "Joined room successfully" });
  } catch (error) {
    console.error("Failed to join room:", error);
    res.status(500).json({ message: "Failed to join room" });
  }
}