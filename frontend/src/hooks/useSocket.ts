"use client";
//اتصال، عضویت در اتاق و قطع اتصال
import { useEffect } from "react";
import { socket } from "../lib/socket";

export function useSocket() {
  useEffect(() => {
    socket.connect();
    socket.emit("join-room", "cmv6nprm90000ichphuvq3t5t");
    return () => {
      socket.disconnect();
    };
  }, []);
}
