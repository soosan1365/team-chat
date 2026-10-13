//اتصال به سرور رو برقرار می‌کنه، وارد اتاق می‌شه، پیام‌های جدید
//  رو دریافت و نگهداری می‌کنه و هنگام خروج، شنونده پیام و اتصال رو پاک می‌کنه.
"use client";

import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export function useSocket() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.connect();

    socket.emit("join-room", "cmv6nprm90000ichphuvq3t5t");

    const handleNewMessage = (newMessage: { content: string }) => {
      setMessage(newMessage.content);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.disconnect();
    };
  }, []);

  return { message };
}
