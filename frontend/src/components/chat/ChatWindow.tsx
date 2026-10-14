"use client";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

type ChatWindowProps = {
  selectedRoomId: string | null;
  currentUserId: string;
};

export default function ChatWindow({
  selectedRoomId,
  currentUserId,
}: ChatWindowProps) {
  if (!selectedRoomId) {
    return (
      <section className="flex h-full min-h-0 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-[#0B0D12]">
        <p className="text-sm text-gray-400">
          Select a room to start chatting
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0D12]">
      <ChatHeader roomId={selectedRoomId} />
      <MessageList roomId={selectedRoomId} userId={currentUserId} />
      <MessageInput roomId={selectedRoomId} userId={currentUserId} />
    </section>
  );
}