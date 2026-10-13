"use client";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

type ChatWindowProps = {
  selectedId: string | null;
  currentUserId: string;
};

export default function ChatWindow({
  selectedId,
  currentUserId,
}: ChatWindowProps) {
  if (!selectedId) {
    return (
      <section className="flex h-full min-h-0 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-[#0B0D12]">
        <p className="text-sm text-gray-400">Select a room to start chatting</p>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0D12]">
      <ChatHeader selectedId={selectedId} />
      <MessageList roomId={selectedId} currentUserId={currentUserId} />
      <MessageInput roomId={selectedId} userId="test-user-001" />
    </section>
  );
}
