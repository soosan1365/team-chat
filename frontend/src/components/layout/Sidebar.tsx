"use client";

import { Plus, Users, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRooms } from "@/src/features/rooms/hooks/useRooms";

type SidebarProps = {
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
};
export default function Sidebar({ selectedRoomId, onSelectRoom }: SidebarProps) {
  const { data: rooms, isLoading, isError } = useRooms();

  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#0E1016] md:w-[320px] md:shrink-0">
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <div>
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <p className="mt-1 text-xs text-gray-500">
            Stay connected with your team
          </p>
        </div>

        <Button
          size="icon"
          className="rounded-xl bg-violet-600 text-white hover:bg-violet-500"
          aria-label="New conversation"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {isLoading && (
          <p className="px-3 py-8 text-center text-sm text-gray-400">
            Loading rooms...
          </p>
        )}

        {isError && (
          <p className="px-3 py-8 text-center text-sm text-red-400">
            Failed to load rooms.
          </p>
        )}

        {rooms?.map((room) => {
          const isSelected = selectedRoomId === room.id;

          return (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                isSelected
                  ? "bg-violet-500/10 ring-1 ring-violet-500/20"
                  : "hover:bg-white/[0.04]"
              }`}
            >
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-violet-600 text-white">
                  <UsersRound className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-medium ${
                    isSelected ? "text-white" : "text-gray-200"
                  }`}
                >
                  {room.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">Team room</p>
              </div>
            </button>
          );
        })}

        {!isLoading && !isError && rooms?.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-gray-500">
            No rooms available.
          </p>
        )}
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Team Workspace</p>
            <p className="mt-1 text-xs text-gray-500">
              {rooms?.length ?? 0} rooms
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
