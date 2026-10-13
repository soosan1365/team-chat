
import { io } from "socket.io-client";

const roomId = "cmv6nprm90000ichphuvq3t5t";

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join-room", roomId);
});

socket.on("new-message", (message) => {
  console.log("New message received:", message);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});
