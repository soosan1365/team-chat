
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Paperclip, Download, CheckCheck } from "lucide-react";
import { API_URL } from "@/src/lib/config";
import MessageActions from "./MessageActions";
import type { Message } from "@/src/types/message";

type MessageItemProps = {
  message: Message;
  userId: string;
  activeMessageId: string | null;
  setActiveMessageId: (id: string | null) => void;
  editingMessageId: string | null;
  setEditingMessageId: (id: string | null) => void;
  editContent: string;
  setEditContent: (content: string) => void;
  isSaving: boolean;
  onReply: (reply: {
    id: string;
    content: string;
    senderName: string;
  }) => void;
  onSaveEdit: (messageId: string) => void;
  onDelete: (messageId: string) => void;
};

export default function MessageItem({
  message,
  userId,
  activeMessageId,
  setActiveMessageId,
  editingMessageId,
  setEditingMessageId,
  editContent,
  setEditContent,
  isSaving,
  onReply,
  onSaveEdit,
  onDelete,
}: MessageItemProps) {
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
            onDelete={() => onDelete(message.id)}
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
                  disabled={isSaving}
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
                  disabled={isSaving || !editContent.trim()}
                  onClick={() => onSaveEdit(message.id)}
                  className="rounded-md bg-teal-500 px-3 py-1 text-xs text-[#07111d] disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
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
}
