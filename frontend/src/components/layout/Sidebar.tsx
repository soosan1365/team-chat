"use client";

import { useState } from "react";
import {
  Plus,
  Users,
  UsersRound,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRooms } from "@/src/hooks/useRooms";
import { useJoinRoom } from "@/src/hooks/useJoinRoom";
import { useLeaveRoom } from "@/src/hooks/useLeaveRoom";
type SidebarProps = {
  selectedRoomId: string | null;
onSelectRoom: (roomId: string | null) => void;};

export default function Sidebar({
  selectedRoomId,
  onSelectRoom,
}: SidebarProps) {
  const { data: rooms, isLoading, isError } = useRooms();
  const joinRoomMutation = useJoinRoom();
  const leaveRoomMutation = useLeaveRoom();
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);

  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#0E1016] md:w-[320px] md:shrink-0">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <div>
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <p className="mt-1 text-xs text-gray-500">
            Stay connected with your team
          </p>
        </div>
      </div>

      {/* Rooms List */}
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
          const isExpanded = expandedRoomId === room.id;

          return (
            <div key={room.id}>
              {/* Room Item */}
              <div
                className={`flex items-center gap-2 rounded-xl p-3 transition ${
                  isSelected
                    ? "bg-violet-500/10 ring-1 ring-violet-500/20"
                    : "hover:bg-white/[0.04]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectRoom(room.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
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

                    <p className="mt-1 text-xs text-gray-500">
                      {room._count.members}{" "}
                      {room._count.members === 1 ? "member" : "members"}
                    </p>
                  </div>
                </button>
                {room.isMember ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={leaveRoomMutation.isPending}
                    onClick={() => {
                      leaveRoomMutation.mutate(room.id, {
                        onSuccess: () => {
                          
                          if (selectedRoomId === room.id) {
                            onSelectRoom("");
                          }
                        },
                      });
                    }}
                    className="shrink-0 rounded-lg"
                  >
                    {leaveRoomMutation.isPending ? "Leaving..." : "Leave"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={joinRoomMutation.isPending}
                    onClick={() => joinRoomMutation.mutate(room.id)}
                    className="shrink-0 rounded-lg bg-violet-600 text-white hover:bg-violet-500"
                  >
                    {joinRoomMutation.isPending ? "Joining..." : "Join"}
                  </Button>
                )}
                {/* Expand / Collapse Members */}
                <button
                  type="button"
                  onClick={() => setExpandedRoomId(isExpanded ? null : room.id)}
                  className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                  aria-label={isExpanded ? "Hide members" : "Show members"}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Members List */}
              {isExpanded && (
                <div className="ml-8 mt-1 space-y-1 border-l border-white/10 pl-4">
                  {room.members.length > 0 ? (
                    room.members.map((member) => (
                      <div
                        key={member.user.id}
                        className="flex items-center gap-2 py-2 text-sm text-gray-400"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-medium text-violet-300">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>

                        <span className="truncate">{member.user.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="py-2 text-xs text-gray-500">
                      No members yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {!isLoading && !isError && rooms?.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-gray-500">
            No rooms available.
          </p>
        )}
      </div>

      {/* Workspace Footer */}
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
