import { getRooms, isUserRoomMember } from "../services/room.service.js";
import { joinRoom } from "../services/room.service.js";
import { leaveRoom } from "../services/room.service.js";
export async function getRoomsController(req, res) {
    console.log("Current userId:", req.userId);
    try {
        const rooms = await getRooms(req.userId);
        res.json(rooms);
    }
    catch (error) {
        console.error("Failed to fetch rooms:", error);
        res.status(500).json({
            message: "Failed to fetch rooms",
        });
    }
}
export async function joinRoomController(req, res) {
    try {
        const userId = req.userId;
        const { roomId } = req.params;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        await joinRoom(userId, roomId);
        res.status(200).json({ message: "Joined room successfully" });
    }
    catch (error) {
        console.error("Failed to join room:", error);
        res.status(500).json({ message: "Failed to join room" });
    }
}
export async function leaveRoomController(req, res) {
    try {
        const userId = req.userId;
        const { roomId } = req.params;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const isMember = await isUserRoomMember(userId, roomId);
        if (!isMember) {
            res.status(404).json({ message: "You are not a member of this room" });
            return;
        }
        await leaveRoom(userId, roomId);
        res.status(200).json({ message: "Left room successfully" });
    }
    catch (error) {
        console.error("Failed to leave room:", error);
        res.status(500).json({ message: "Failed to leave room" });
    }
}
//# sourceMappingURL=room.controller.js.map