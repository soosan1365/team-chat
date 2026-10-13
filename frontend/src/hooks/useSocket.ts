//اتصال به سرور رو برقرار می‌کنه، وارد اتاق می‌شه، پیام‌های جدید
//  رو دریافت و نگهداری می‌کنه و هنگام خروج، شنونده پیام و اتصال رو پاک می‌کنه.

"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../lib/socket";

type Message = {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
  };
};

export function useSocket(roomId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleConnect = () => {
      socket.emit("join-room", roomId);
    };

    const handleNewMessage = (newMessage: Message) => {
      queryClient.setQueryData<Message[]>(
        ["messages", roomId],
        (oldMessages = []) => {
          if (oldMessages.some((message) => message.id === newMessage.id)) {
            return oldMessages;
          }

          return [...oldMessages, newMessage];
        }
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
