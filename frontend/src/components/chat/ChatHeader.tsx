"use client";

import { Phone, Video, MoreVertical, Search } from "lucide-react";
import { UsersRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRooms } from "@/src/hooks/useRooms";

type ChatHeaderProps = {
  roomId: string;
};

export default function ChatHeader({ roomId }: ChatHeaderProps) {
  const { data: rooms } = useRooms();
  const room = rooms?.find((item) => item.id === roomId);

  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#111318] px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-11 w-11">
          <AvatarFallback className="bg-indigo-500 text-white">
            <UsersRound className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <h2 className="truncate font-semibold text-white">
            {room?.name ?? "Loading room..."}
          </h2>
          <p className="text-xs text-gray-400">Team room</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* <Button variant="ghost" size="icon" aria-label="More options" className="text-gray-400 hover:bg-white/10 hover:text-white">
          <MoreVertical className="h-5 w-5" />
        </Button> */}
      </div>
    </header>
  );
}
