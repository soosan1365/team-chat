"use client";

import { CheckCheck, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRoomMessages } from "@/src/hooks/useRoomMessages";
import { useRooms } from "@/src/hooks/useRooms";
import { useSocket } from "@/src/hooks/useSocket";
import { useEffect, useRef } from "react";

type MessageListProps = {
  roomId: string;
  userId: string;
};

export default function MessageList({ roomId, userId }: MessageListProps) {
  const { data: rooms, isLoading: isLoadingRooms } = useRooms();
  const currentRoom = rooms?.find((room) => room.id === roomId);
  const isMember = currentRoom?.isMember;

  const { data: messages, isLoading, isError } = useRoomMessages(roomId);

  const bottomRef = useRef<HTMLDivElement>(null);

  useSocket(isMember ? roomId : "");

  useEffect(() => {
    if (isLoading || isLoadingRooms || !isMember) return;

    bottomRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  }, [isLoading, isLoadingRooms, isMember, messages]);

  // هنوز اتاقی انتخاب نشده
  if (!roomId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#0B0D12] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
            <MessageCircle className="h-7 w-7 text-violet-400" />
          </div>

          <h3 className="mb-2 text-base font-semibold text-gray-100">
            انتخاب اتاق گفتگو
          </h3>

          <p className="text-sm text-gray-400">
            برای شروع چت، یک اتاق از سایدبار انتخاب کن.
          </p>
        </div>
      </div>
    );
  }

  // وضعیت عضویت هنوز در حال دریافت است
  if (isLoadingRooms) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#0B0D12] text-sm text-gray-400">
        Select a Chat Room!{" "}
      </div>
    );
  }

  // کاربر عضو اتاق نیست
  if (currentRoom && !isMember) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#0B0D12] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
            <MessageCircle className="h-7 w-7 text-violet-400" />
          </div>

          <h3 className="mb-2 text-base font-semibold text-gray-100">
            Join this room first!{" "}
          </h3>

          <p className="text-sm leading-6 text-gray-400">
            To view messages, click Join in the sidebar.{" "}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#0B0D12] text-sm text-gray-400">
        Loading messages...{" "}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#0B0D12] text-sm text-red-400">
        Failed to load messages. Please try again.{" "}
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 overflow-y-auto bg-[#0B0D12] p-6">
      {messages?.map((message) => {
        const isMe = message.userId === userId;

        return (
          <div
            key={message.id}
            className={`flex items-end gap-3 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {!isMe && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-indigo-500 text-xs text-white">
                  {message.user.name?.slice(0, 2).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`flex max-w-[75%] flex-col gap-1 ${
                isMe ? "items-end" : "items-start"
              }`}
            >
              {!isMe && (
                <span className="px-1 text-xs text-gray-400">
                  {message.user.name ?? "User"}
                </span>
              )}

              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.type === "audio"
                    ? "border border-violet-500/50 bg-[#191C24]"
                    : isMe
                      ? "rounded-br-sm bg-violet-600 text-white"
                      : "rounded-bl-sm border border-white/5 bg-[#191C24] text-gray-200"
                }`}
              >
                {message.type === "audio" && message.audioUrl ? (
                  <audio
                    controls
                    preload="metadata"
                    src={`http://localhost:4000${message.audioUrl}`}
                    className="h-9 w-56 max-w-full"
                  />
                ) : (
                  message.content
                )}
              </div>

              <div className="flex items-center gap-1.5 px-1">
                <span className="text-[11px] text-gray-500">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {isMe && <CheckCheck className="h-3.5 w-3.5 text-violet-400" />}
              </div>
            </div>

            {isMe && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-violet-600 text-xs text-white">
                  You
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}

      {!messages?.length && (
        <p className="py-8 text-center text-sm text-gray-500">
          No messages yet. Start the conversation!{" "}
        </p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
