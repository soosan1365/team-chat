"use client";

import { CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRoomMessages } from "@/src/hooks/useRoomMessages";
import { useRooms } from "@/src/hooks/useRooms";
import { useSocket } from "@/src/hooks/useSocket";
import { useEffect, useRef } from "react";
import { Paperclip, Download } from "lucide-react";
import ChatStatus from "./ChatStatus";
type MessageListProps = {
  roomId: string;
  userId: string;
};

export default function MessageList({ roomId, userId }: MessageListProps) {
  const { data: rooms, isLoading: isLoadingRooms } = useRooms();
  const currentRoom = rooms?.find((room) => room.id === roomId);
  const isMember = currentRoom?.isMember;

  const {
    data: messages,
    isLoading,
    isError,
  } = useRoomMessages(roomId, Boolean(isMember));
  const bottomRef = useRef<HTMLDivElement>(null);

  useSocket(isMember ? roomId : "");

  useEffect(() => {
    if (isLoading || isLoadingRooms || !isMember) return;

    bottomRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  }, [isLoading, isLoadingRooms, isMember, messages]);

  if (!roomId) {
    return (
      <ChatStatus
        type="empty"
        title="Ready to connect?"
        description="Choose a room from the sidebar and join the conversation."
      />
    );
  }

  if (isLoadingRooms) {
    return (
      <ChatStatus
        type="loading"
        title="Loading rooms..."
        description="Getting your workspace ready."
      />
    );
  }

  // User is not a member
  if (currentRoom && !isMember) {
    return (
      <ChatStatus
        type="locked"
        title="Join this room first"
        description="Join the room from the sidebar to view messages and chat with others."
      />
    );
  }

  // Loading messages
  if (isLoading) {
    return (
      <ChatStatus
        type="loading"
        title="Loading messages..."
        description="Getting your conversation ready."
      />
    );
  }

  // Error loading messages
  if (isError) {
    return (
      <ChatStatus
        type="error"
        title="Something went wrong"
        description="Couldn't load messages. Please try again."
      />
    );
  }
  // Messages list

  return (
    <div className="flex-1 space-y-6 overflow-y-auto bg-[#070d18] p-6">
      {messages?.length ? (
        messages.map((message) => {
          const isMe = message.userId === userId;
          console.log("Message:", {
            type: message.type,
            fileUrl: message.fileUrl,
            fileName: message.fileName,
          });
          return (
            <div
              key={message.id}
              className={`flex items-end gap-3 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-cyan-300 text-xs text-[#0D1726]">
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
                      ? "border border-teal-400/20 bg-[#152437]"
                      : isMe
                        ? "rounded-br-sm border-[1px] border-teal-200 text-[#d2d6dd]"
                        : "rounded-bl-sm border-[1px] border-teal-200  bg-[#152437] text-slate-200"
                  }`}
                >
                  {message.type === "audio" && message.audioUrl ? (
                    <audio
                      controls
                      preload="metadata"
                      src={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}${message.audioUrl}`}
                      className="h-9 w-56 max-w-full"
                    />
                  ) : message.type === "file" && message.fileUrl ? (
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}${message.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={message.fileName ?? true}
                      className="flex items-center gap-3 text-teal-200 transition hover:text-teal-100"
                    >
                      <Paperclip className="h-5 w-5 shrink-0" />
                      <span className="max-w-48 break-all">
                        {message.fileName ?? message.content}
                      </span>
                      <Download className="h-4 w-4 shrink-0" />
                    </a>
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

                  {isMe && (
                    <CheckCheck className="h-3.5 w-3.5 text-violet-400" />
                  )}
                </div>
              </div>

              {isMe && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-cyan-600 text-xs text-[#0D1726]">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })
      ) : (
        <ChatStatus
          type="empty"
          title="Start the conversation"
          description="No messages yet. Send the first message!"
        />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
