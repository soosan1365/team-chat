"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRoomMessages } from "@/src/hooks/useRoomMessages";
import { useRooms } from "@/src/hooks/useRooms";
import { useSocket } from "@/src/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { Paperclip, Download, CheckCheck } from "lucide-react";
import ChatStatus from "./ChatStatus";
import { useMarkRoomAsRead } from "@/src/hooks/useMarkRoomAsRead";
import MessageActions from "./MessageActions";
import { useDeleteMessage } from "@/src/hooks/useDeleteMessage";
import DeleteMessageDialog from "./DeleteMessageDialog";
import { useEditMessage } from "@/src/hooks/useEditMessage";
import { API_URL } from "@/src/lib/config";

type MessageListProps = {
  roomId: string;
  userId: string;
  onReply: (reply: { id: string; content: string; senderName: string }) => void;
};

export default function MessageList({
  roomId,
  userId,
  onReply,
}: MessageListProps) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const editMessageMutation = useEditMessage();
  const deleteMessageMutation = useDeleteMessage();
  const { mutate: markAsRead } = useMarkRoomAsRead();
  const { data: rooms, isLoading: isLoadingRooms } = useRooms();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const currentRoom = rooms?.find((room) => room.id === roomId);
  const isMember = currentRoom?.isMember ?? false;
  const {
    data: messages,
    isLoading,
    isError,
  } = useRoomMessages(roomId, Boolean(isMember));

  useSocket(isMember ? roomId : "");

  useEffect(() => {
    if (isLoading || isLoadingRooms || isError || !isMember) return;

    markAsRead(roomId);
  }, [roomId, isLoading, isLoadingRooms, isError, isMember, markAsRead]);

  useEffect(() => {
    if (isLoading || isLoadingRooms || !isMember) return;

    bottomRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  }, [isLoading, isLoadingRooms, isMember, messages]);

  useEffect(() => {
    setEditingMessageId(null);
    setEditContent("");
    setActiveMessageId(null);
    setMessageToDelete(null);
  }, [roomId]);
  const handleSaveEdit = (messageId: string) => {
    const content = editContent.trim();

    if (!content || !isMember) return;

    editMessageMutation.mutate(
      { roomId, messageId, content },
      {
        onSuccess: () => {
          setEditingMessageId(null);
          setEditContent("");
          setActiveMessageId(null);
        },
        onError: (error) => {
          console.error("Failed to edit message:", error);
        },
      },
    );
  };

  const handleDelete = (messageId: string) => {
    if (!isMember) return;
    setMessageToDelete(messageId);
  };
  const confirmDelete = () => {
    if (!messageToDelete) return;

    deleteMessageMutation.mutate(
      { roomId, messageId: messageToDelete },
      {
        onSuccess: () => {
          setActiveMessageId(null);
          setMessageToDelete(null);
        },
        onError: (error) => {
          console.error("Failed to delete message:", error);
        },
      },
    );
  };

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

          const handleCopy = async () => {
            try {
              await navigator.clipboard.writeText(message.content);
              setActiveMessageId(null);
            } catch {
              console.error("Failed to copy message");
            }
          };

          return (
            <div
              key={message.id}
              className={`flex items-end gap-3 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className=" bg-cyan-300 text-xs text-[#0D1726]">
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

                {activeMessageId === message.id && (
                  <MessageActions
                    isMe={isMe}
                    onCopy={handleCopy}
                    onReply={() => {
                      onReply({
                        id: message.id,
                        content: message.content,
                        senderName: message.user.name ?? "User",
                      });
                      setActiveMessageId(null);
                    }}
                    onEdit={() => {
                      if (message.type !== "text") return;

                      setEditingMessageId(message.id);
                      setEditContent(message.content);
                      setActiveMessageId(null);
                    }}
                    onDelete={() => handleDelete(message.id)}
                  />
                )}

                <div
                  onClick={() =>
                    setActiveMessageId(
                      activeMessageId === message.id ? null : message.id,
                    )
                  }
                  className={`cursor-pointer rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.type === "audio"
                      ? "border border-teal-400/20 bg-[#152437]"
                      : isMe
                        ? "rounded-br-sm border border-teal-200 text-[#d2d6dd]"
                        : "rounded-bl-sm border border-teal-200 bg-[#152437] text-slate-200"
                  }`}
                >
                  {message.replyTo && (
                    <div className="mb-2 border-l-2 border-teal-400 pl-3">
                      <p className="text-xs font-semibold text-teal-300">
                        {message.replyTo.user.name ?? "User"}
                      </p>
                      <p className="max-w-64 truncate text-xs text-slate-400">
                        {message.replyTo.content}
                      </p>
                    </div>
                  )}
                  {message.type === "audio" && message.audioUrl ? (
                    <audio
                      onClick={(e) => e.stopPropagation()}
                      controls
                      preload="metadata"
                      src={`${API_URL}${message.audioUrl}`}
                      className="h-9 w-56 max-w-full"
                    />
                  ) : message.type === "file" && message.fileUrl ? (
                    <a
                      href={`${API_URL}${message.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={message.fileName ?? true}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-3 text-teal-200 transition hover:text-teal-100"
                    >
                      <Paperclip className="h-5 w-5 shrink-0" />
                      <span className="max-w-48 break-all">
                        {message.fileName ?? message.content}
                      </span>
                      <Download className="h-4 w-4 shrink-0" />
                    </a>
                  ) : editingMessageId === message.id ? (
                    <div
                      className="min-w-64 space-y-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full resize-y rounded-lg border border-teal-400/40 bg-[#0D1726] p-2 text-sm text-white outline-none focus:border-teal-300"
                        rows={3}
                        autoFocus
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={editMessageMutation.isPending}
                          onClick={() => {
                            setEditingMessageId(null);
                            setEditContent("");
                          }}
                          className="rounded-md px-3 py-1 text-xs text-gray-300 hover:bg-white/10"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          disabled={
                            editMessageMutation.isPending || !editContent.trim()
                          }
                          onClick={() => handleSaveEdit(message.id)}
                          className="rounded-md bg-teal-500 px-3 py-1 text-xs text-[#07111d] disabled:opacity-50"
                        >
                          {editMessageMutation.isPending ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
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
      <DeleteMessageDialog
        open={messageToDelete !== null}
        isDeleting={deleteMessageMutation.isPending}
        onCancel={() => setMessageToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
