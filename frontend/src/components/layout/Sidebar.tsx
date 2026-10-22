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
import { useRooms } from "@/src/hooks/rooms/useRooms";
import { useJoinRoom } from "@/src/hooks/rooms/useJoinRoom";
import { useLeaveRoom } from "@/src/hooks/rooms/useLeaveRoom";
import { Network } from "lucide-react";
import LeaveRoomDialog from "../dialogs/LeaveRoomDialog";
type SidebarProps = {
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string | null) => void;
};

export default function Sidebar({
  selectedRoomId,
  onSelectRoom,
}: SidebarProps) {
  const { data: rooms, isLoading, isError } = useRooms();
  const joinRoomMutation = useJoinRoom();
  const leaveRoomMutation = useLeaveRoom();
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);
  const [roomToLeave, setRoomToLeave] = useState<{
    id: string;
    name: string;
  } | null>(null);
  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden border-r border-[#293B55] bg-[#02050a] md:w-[320px] md:shrink-0">
      {" "}
      {/* Sidebar Header */}
      <div className="shrink-0 border-b border-[#293B55] px-3 py-2 sm:px-5 sm:py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100">
              Messages
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Stay connected with your team
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#293B55] bg-[#01050c] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          <span className="text-xs text-slate-200">Team workspace</span>
          <span className="ml-auto text-xs text-slate-400">
            {rooms?.length ?? 0} rooms
          </span>
        </div>
      </div>
      {/* Rooms List */}
      <div className="flex-none min-h-0 overflow-y-auto space-y-2 px-3 py-2">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-teal-300" />
            <p className="text-sm text-slate-400">Loading rooms...</p>
          </div>
        )}
        {isError && (
          <p className="rounded-xl border border-rose-400/15 bg-rose-400/5 px-3 py-4 text-center text-sm text-rose-300">
            Failed to load rooms.
          </p>
        )}
        {rooms?.map((room) => {
          const isSelected = selectedRoomId === room.id;
          const isExpanded = expandedRoomId === room.id;
          const isJoining =
            joinRoomMutation.isPending &&
            joinRoomMutation.variables === room.id;
          const isLeaving =
            leaveRoomMutation.isPending &&
            leaveRoomMutation.variables === room.id;

          return (
            <div key={room.id}>
              {/* Room Item */}
              <div
                className={`group relative flex min-w-0 items-center gap-1.5 overflow-hidden rounded-xl border p-2 transition-colors duration-200 sm:gap-2 sm:p-2 ${
                  isSelected
                    ? "border-sky-400/30 bg-[#172B45]"
                    : "border-transparent hover:border-[#344B69] hover:bg-[#142238]"
                }`}
              >
                {isSelected && (
                  <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-sky-900 " />
                )}

                <button
                  type="button"
                  onClick={() => onSelectRoom(room.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-300 sm:gap-3"
                >
                  <Avatar className="h-9 w-9 shrink-0 rounded-lg bg-transparent sm:h-11 sm:w-11">
                    <AvatarFallback
                      className={`rounded-lg border-0 shadow-none transition-colors ${
                        isSelected
                          ? "bg-teal-200/  text-teal-200"
                          : "bg-teal-300/15 text-teal-300 group-hover:bg-teal-300/10"
                      }`}
                    >
                      <UsersRound className="h-4 w-4 sm:h-5 sm:w-5" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-semibold ${
                        isSelected ? "text-sky-400" : "text-slate-200"
                      }`}
                    >
                      {room.name}
                    </p>

                    <p className="mt-1 truncate text-[11px] text-slate-400 sm:text-xs">
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
                    onClick={() =>
                      setRoomToLeave({ id: room.id, name: room.name })
                    }
                    className="h-8 w-[56px] shrink-0 rounded-lg border-slate-600/80 bg-slate-800/70 px-2 text-xs text-slate-300 transition-all hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-300 sm:px-3"
                  >
                    {isLeaving ? "Leaving..." : "Leave"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={joinRoomMutation.isPending}
                    onClick={() => joinRoomMutation.mutate(room.id)}
                    className="h-8 w-[56px] shrink-0 rounded-lg bg-sky-400 px-2 text-xs font-semibold text-[#0B1424] transition-colors hover:bg-sky-200 disabled:opacity-50 sm:px-3"
                  >
                    {isJoining ? "Joining..." : "Join"}
                  </Button>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedRoomId(isExpanded ? null : room.id)}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700/70 hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 sm:p-2"
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
                <div className="ml-5 mt-2 space-y-1 border-l border-slate-700 pl-4 sm:ml-8">
                  {room.members.length > 0 ? (
                    room.members.map((member) => (
                      <div
                        key={member.user.id}
                        className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-400 transition hover:bg-slate-800/50 hover:text-slate-200"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-teal-300/10 bg-teal-300/10 text-xs font-semibold text-teal-200">
                          {member.user.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>

                        <span className="truncate">
                          {member.user.name ?? "User"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="py-2 text-xs text-slate-500">
                      No members yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {!isLoading && !isError && rooms?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-center">
            <UsersRound className="mx-auto mb-3 h-7 w-7 text-slate-500" />
            <p className="text-sm font-medium text-slate-300">
              No rooms available
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Your rooms will appear here.
            </p>
          </div>
        )}
      </div>
      {/* Workspace Footer */}
      <div className="mt-auto hidden md:block  shrink-0 border-t border-slate-700/60 p-2 sm:p-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/ p-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-300/15 bg-teal-300/10 text-teal-200">
            <Network className="h-5 w-5" />{" "}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">
              Team Workspace
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {rooms?.length ?? 0} rooms available
            </p>
          </div>
          <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-teal-300" />
        </div>
      </div>
      <LeaveRoomDialog
        open={roomToLeave !== null}
        roomName={roomToLeave?.name ?? ""}
        isPending={leaveRoomMutation.isPending}
        onOpenChange={(open) => {
          if (!open && !leaveRoomMutation.isPending) {
            setRoomToLeave(null);
          }
        }}
        onConfirm={() => {
          if (!roomToLeave) return;

          leaveRoomMutation.mutate(roomToLeave.id, {
            onSuccess: () => {
              if (selectedRoomId === roomToLeave.id) {
                onSelectRoom(null);
              }
              setRoomToLeave(null);
            },
          });
        }}
      />
    </aside>
  );
}
