
import type { Request, Response } from "express";
import { getRooms } from "../services/room.service.js";

export async function getRoomsController(
  _req: Request,
  res: Response,
) {
  try {
    const rooms = await getRooms();
    res.json(rooms);
  } catch (error) {
    console.error("Failed to fetch rooms:", error);

    res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
}
