"use client";

import { useRooms } from "@/src/hooks/rooms/useRooms";

type ChatHeaderProps = {
  roomId: string;
};

export default function ChatHeader({ roomId }: ChatHeaderProps) {
  const { data: rooms } = useRooms();
  const room = rooms?.find((item) => item.id === roomId);

  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#01050c] px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-white">
            {room?.name ?? "Loading room..."}
          </h2>
          <p className="text-xs text-gray-400">Team room</p>
        </div>
      </div>
    </header>
  );
}
