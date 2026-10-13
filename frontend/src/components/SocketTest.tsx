"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { socket } from "../lib/socket";

export default function SocketTest() {
  useSocket();

  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleNewMessage = (newMessage: { content: string }) => {
      setMessage(newMessage.content);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, []);

  return (
    <div>
      <p>Socket connection test</p>
      <p>Latest message: {message || "No message received yet"}</p>
    </div>
  );
}
