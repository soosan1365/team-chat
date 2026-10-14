
import { Router } from "express";
import { getRoomsController } from "../controllers/room.controller.js";
import { joinRoomController } from "../controllers/room.controller.js";
import { authenticateToken } from "../../../middlewares/auth.middleware.js";
const router = Router();


router.get("/", authenticateToken, getRoomsController);
router.post("/:roomId/join", authenticateToken, joinRoomController);
export default router;
