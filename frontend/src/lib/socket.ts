
import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", {
  autoConnect: false,
  auth: (callback) => {
    const token = localStorage.getItem("auth-token");

    callback({ token });
  },
});
