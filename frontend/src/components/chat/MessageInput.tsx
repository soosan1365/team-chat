"use client";
import { useRef, useState } from "react";
import { Paperclip, Smile, Send, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadAttachment } from "@/src/hooks/useUploadAttachment";
import { useAudioRecording } from "@/src/hooks/useAudioRecording";
import { useSendMessage } from "@/src/hooks/useSendMessage";
import EmojiPicker from "./EmojiPicker";
type ReplyMessage = {
  id: string;
  content: string;
  senderName: string;
};

type MessageInputProps = {
  roomId: string;
  isMember: boolean;
  replyingTo: ReplyMessage | null;
  onCancelReply: () => void;
};

export default function MessageInput({
  roomId,
  isMember,
  replyingTo,
  onCancelReply,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { sendMessage, isSendingMessage } = useSendMessage();
  const [showEmojis, setShowEmojis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    isRecording,
    mediaRecorder,
    isUploading,
    startRecording,
    stopRecording,
  } = useAudioRecording();
  const isDisabled = !isMember || isUploading || isSendingMessage;
  const uploadAttachmentMutation = useUploadAttachment(roomId);

  function handleRecording() {
    if (
      !isMember ||
      isUploading ||
      isSendingMessage ||
      uploadAttachmentMutation.isPending
    ) {
      return;
    }
    if (isRecording && mediaRecorder) {
      stopRecording();
      return;
    }

    startRecording(roomId);
  }

  async function handleSend() {
    if (!isMember || isUploading || isSendingMessage) return;

    const content = message.trim();
    if (!content) return;

    const success = await sendMessage(content, roomId, replyingTo?.id ?? null);

    if (success) {
      setMessage("");
      onCancelReply();
    }
  }

  async function handleSendClick() {
    if (
      !isMember ||
      isUploading ||
      isSendingMessage ||
      uploadAttachmentMutation.isPending
    ) {
      return;
    }

    if (selectedFile) {
      try {
        await uploadAttachmentMutation.mutateAsync(selectedFile);

        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Failed to upload attachment:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to upload attachment.",
        );
      }

      return;
    }

    if (isRecording && mediaRecorder) {
      stopRecording();
    } else {
      await handleSend();
    }
  }

  return (
    <div className="border-t border-white/10 bg-[#000205] p-4">
      {replyingTo && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-teal-400/20 bg-[#152437] px-3 py-2">
          <div className="min-w-0 flex-1 border-l-2 border-teal-400 pl-3">
            <p className="text-xs font-semibold text-teal-300">
              Replying to {replyingTo.senderName}
            </p>

            <p className="truncate text-sm text-slate-300">
              {replyingTo.content}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancelReply}
            title="Cancel reply"
            aria-label="Cancel reply"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {selectedFile && (
        <div className="mb-2 flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-white/10 bg-[#0e1118] px-3 py-2 sm:max-w-sm">
          <Paperclip className="h-4 w-4 shrink-0 text-violet-400" />

          <span
            className="min-w-0 flex-1 truncate text-xs text-gray-300"
            title={selectedFile.name}
          >
            {selectedFile.name}
          </span>

          <span className="shrink-0 text-[10px] text-gray-500">
            {selectedFile.size < 1024 * 1024
              ? `${(selectedFile.size / 1024).toFixed(0)} KB`
              : `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`}
          </span>

          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Remove selected file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0e1118] px-3 py-2 transition focus-within:border-violet-500/50">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isDisabled}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 text-white hover:bg-white/10 hover:text-white"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(event) => {
            setSelectedFile(event.target.files?.[0] ?? null);
          }}
        />

        <Input
          disabled={isDisabled}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleSend();
            }
          }}
          placeholder={
            isMember ? "Type your message..." : "Join the room to send messages"
          }
          className="border-0 bg-transparent text-white shadow-none placeholder:text-gray-500 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isDisabled}
          onClick={() => setShowEmojis((previous) => !previous)}
          className="shrink-0 text-white hover:bg-white/35 hover:text-white"
          aria-label="Add emoji"
        >
          <Smile className="h-5 w-5" />
        </Button>
        {showEmojis && isMember && (
          <EmojiPicker
            onSelect={(emoji) => {
              setMessage((previous) => previous + emoji);
              setShowEmojis(false);
            }}
          />
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isDisabled}
          onClick={handleRecording}
          className={`shrink-0 ${
            isRecording
              ? "animate-pulse text-red-500"
              : "text-white hover:bg-white/35 hover:text-white"
          }`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <Mic className="h-5 w-5" />
        </Button>

        {isRecording && (
          <div className="flex shrink-0 items-center gap-1 text-red-500">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
          </div>
        )}

        <Button
          type="button"
          onClick={() => void handleSendClick()}
          disabled={
            isDisabled ||
            uploadAttachmentMutation.isPending ||
            (!selectedFile && !isRecording && !message.trim())
          }
          size="icon"
          className="shrink-0 rounded-xl bg-violet-600 text-white hover:bg-violet-300 disabled:opacity-40"
          aria-label={isRecording ? "Stop recording" : "Send message"}
        >
          <Send className="h-4 w-4  " />
        </Button>
      </div>

      <p className="mt-2 text-center text-[11px] text-gray-600">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}
