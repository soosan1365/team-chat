"use client";

import { useSocket } from "../hooks/useSocket";
import { useRoomMessages } from "../features/messages/hooks/useRoomMessages";
export default function SocketTest() {
const roomId = "cmv6nprm90000ichphuvq3t5t";

const { data: messages, isLoading, error } = useRoomMessages(roomId);

useSocket(roomId);
return (
  <div>
    <p>Socket connection test</p>

    {isLoading && <p>Loading messages...</p>}

    {error && <p>Failed to load messages.</p>}

    {messages?.map((message: { id: string; content: string }) => (
      <p key={message.id}>{message.content}</p>
    ))}

    {/* <p>Latest message: {message || "No message received yet"}</p> */}
  </div>
);
}