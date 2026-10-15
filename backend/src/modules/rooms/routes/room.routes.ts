import { Router } from "express";

import {
  getRoomsController,
  joinRoomController,
  leaveRoomController,
} from "../controllers/room.controller.js";
import {
  authenticateToken,
  optionalAuthenticateToken,
} from "../../../middlewares/auth.middleware.js";
const router = Router();

router.get("/", optionalAuthenticateToken, getRoomsController);
router.post("/:roomId/join", authenticateToken, joinRoomController);
router.delete("/:roomId/leave", authenticateToken, leaveRoomController);
export default router;
