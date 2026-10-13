"use client";

import { useSocket } from "../hooks/useSocket";

export default function SocketTest() {
  const { message } = useSocket();

  return (
    <div>
      <p>Socket connection test</p>
      <p>Latest message: {message || "No message received yet"}</p>
    </div>
  );
}