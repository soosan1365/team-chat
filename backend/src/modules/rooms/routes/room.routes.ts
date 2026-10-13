
import { Router } from "express";
import { getRooms } from "../services/room.service.js";
import { getRoomsController } from "../controllers/room.controller.js";
const router = Router();


router.get("/", getRoomsController);

export default router;
