//به اتاق وصل می‌شه و پیام‌های جدید رو با Socket.IO دریافت می‌کنه.
"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../lib/socket";

type Message = {
  id: string;
  content?: string;
  userId?: string;
  roomId?: string;
  createdAt?: string;
  user?: {
    id: string;
    name: string | null;
  };
  deleted?: boolean;
};

export function useSocket(roomId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleConnect = () => {
      socket.emit("join-room", roomId);
    };

 const handleNewMessage = (event: Message | { id: string; deleted: true }) => {
  queryClient.setQueryData<Message[]>(
    ["messages", roomId],
    (oldMessages = []) => {
      if ("deleted" in event && event.deleted) {
        return oldMessages.filter((message) => message.id !== event.id);
      }

      const exists = oldMessages.some(
        (message) => message.id === event.id,
      );

      if (exists) {
        return oldMessages.map((message) =>
          message.id === event.id ? event : message,
        );
      }

      return [...oldMessages, event];
    },
  );
};

    socket.on("connect", handleConnect);
    socket.on("new-message", handleNewMessage);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new-message", handleNewMessage);
      socket.disconnect();
    };
  }, [roomId, queryClient]);
}
