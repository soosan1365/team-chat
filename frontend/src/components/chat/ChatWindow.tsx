"use client";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useRooms } from "@/src/hooks/useRooms";
import { useEffect } from "react";
import { useMarkRoomAsRead } from "@/src/hooks/useMarkRoomAsRead";
type ChatWindowProps = {
  selectedRoomId: string | null;
  currentUserId: string;
};

export default function ChatWindow({
  selectedRoomId,
  currentUserId,
}: ChatWindowProps) {
  const { data: rooms } = useRooms();
  const markRoomAsRead = useMarkRoomAsRead();

  const currentRoom = rooms?.find((room) => room.id === selectedRoomId);
  const isMember = currentRoom?.isMember ?? false;
  useEffect(() => {
    if (selectedRoomId && isMember) {
      markRoomAsRead.mutate(selectedRoomId);
    }
  }, [selectedRoomId, isMember]);
  if (!selectedRoomId) {
    return (
      <section className="flex h-full min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-[#293B55] bg-[#0B1424] px-4 sm:rounded-2xl sm:px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#203A5B]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-sky-300"
            >
              <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-100 sm:text-lg">
            Ready to connect?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Select a room from the sidebar to start chatting with your team.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#293B55] bg-[#0B1424] sm:rounded-2xl">
      <ChatHeader roomId={selectedRoomId} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <MessageList roomId={selectedRoomId} userId={currentUserId} />

        <MessageInput roomId={selectedRoomId} isMember={isMember} />
      </div>
    </section>
  );
}
