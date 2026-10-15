"use client";
import { useState } from "react";
import { Paperclip, Smile, Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMessage } from "@/src/services/message.service";
import { uploadAudioMessage } from "@/src/services/audio.service";

type MessageInputProps = {
  roomId: string;
  isMember: boolean;
};

export default function MessageInput({ roomId, isMember }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const isDisabled = !isMember || isUploading;

  function handleRecording() {
    if (!isMember || isUploading) return;

    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      return;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = async () => {
          const blob = new Blob(chunks, {
            type: recorder.mimeType || "audio/webm",
          });

          stream.getTracks().forEach((track) => track.stop());
          setMediaRecorder(null);
          setIsRecording(false);

          try {
            setIsUploading(true);
            await uploadAudioMessage(roomId, blob);
          } catch (error) {
            console.error("Failed to send audio:", error);
            alert("Failed to send audio message.");
          } finally {
            setIsUploading(false);
          }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Microphone access failed:", error);
        alert("Please allow microphone access to record audio.");
      });
  }

  async function handleSendAudio() {
    if (!isMember || isUploading) return;

    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }

  async function handleSend() {
    if (!isMember || isUploading) return;

    const content = message.trim();
    if (!content) return;

    try {
      setIsUploading(true);
      await createMessage({ content, roomId });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSendClick() {
    if (!isMember || isUploading) return;

    if (isRecording) {
      await handleSendAudio();
    } else {
      await handleSend();
    }
  }

  return (
    <div className="border-t border-white/10 bg-[#111318] p-4">
      <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-[#191C24] px-3 py-2 transition focus-within:border-violet-500/50">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isDisabled}
          className="shrink-0 text-gray-400 hover:bg-white/10 hover:text-white"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

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
          className="shrink-0 text-gray-400 hover:bg-white/10 hover:text-white"
          aria-label="Add emoji"
        >
          <Smile className="h-5 w-5" />
        </Button>

        {showEmojis && isMember && (
          <div className="absolute bottom-14 right-12 z-50 flex max-w-64 flex-wrap gap-2 rounded-xl border border-white/10 bg-[#191C24] p-3">
            {[
              "😀",
              "😂",
              "😍",
              "🥰",
              "😊",
              "👍",
              "❤️",
              "🎉",
              "🔥",
              "😭",
              "🙏",
              "👏",
            ].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setMessage((previous) => previous + emoji);
                  setShowEmojis(false);
                }}
                className="rounded p-1 text-xl hover:bg-white/10"
              >
                {emoji}
              </button>
            ))}
          </div>
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
              : "text-gray-400 hover:bg-white/10 hover:text-white"
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
          disabled={isDisabled || (!isRecording && !message.trim())}
          size="icon"
          className="shrink-0 rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40"
          aria-label={isRecording ? "Stop recording" : "Send message"}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <p className="mt-2 text-center text-[11px] text-gray-600">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}
