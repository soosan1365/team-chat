"use client";

import { CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRoomMessages } from "@/src/features/messages/hooks/useRoomMessages";
import { useSocket } from "@/src/hooks/useSocket";

type MessageListProps = {
  roomId: string;
  userId: string;
};

export default function MessageList({ roomId, userId }: MessageListProps) {
  const { data: messages, isLoading, isError, error } = useRoomMessages(roomId);

  useSocket(roomId);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
        Loading messages...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-red-400">
        Failed to load messages.
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
          No messages yet. Start the conversation!
        </p>
      )}
    </div>
  );
}
