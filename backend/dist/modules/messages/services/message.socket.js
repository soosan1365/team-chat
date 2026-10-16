let io = null;
export function setMessageSocket(server) {
    io = server;
}
export function emitNewMessage(roomId, message) {
    if (!io) {
        throw new Error("Socket.IO is not initialized");
    }
    io.to(roomId).emit("new-message", message);
}
//# sourceMappingURL=message.socket.js.map