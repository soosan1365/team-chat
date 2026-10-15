import { Router } from "express";
import { getRoomsController } from "../controllers/room.controller.js";
import { joinRoomController } from "../controllers/room.controller.js";
import { authenticateToken, optionalAuthenticateToken } from "../../../middlewares/auth.middleware.js";
const router = Router();

router.get("/", optionalAuthenticateToken,getRoomsController);
router.post("/:roomId/join", authenticateToken, joinRoomController);
export default router;
