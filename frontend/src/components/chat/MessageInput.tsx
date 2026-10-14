"use client";

import { useState } from "react";
import { Paperclip, Smile, Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMessage } from "@/src/services/message.service";
type MessageInputProps = {
  roomId: string;
};

export default function MessageInput({ roomId }: MessageInputProps) {
  const [message, setMessage] = useState("");

  async function handleSend() {
    const content = message.trim();
    if (!content) return;

    try {
      await createMessage({
        content,
        roomId,
        
      });

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }

  return (
    <div className="border-t border-white/10 bg-[#111318] p-4">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#191C24] px-3 py-2 transition focus-within:border-violet-500/50">
        {/* Attachment */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-gray-400 hover:bg-white/10 hover:text-white"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Message Input */}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="border-0 bg-transparent text-white shadow-none focus-visible:ring-0 placeholder:text-gray-500"
        />

        {/* Emoji */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden shrink-0 text-gray-400 hover:bg-white/10 hover:text-white sm:flex"
          aria-label="Add emoji"
        >
          <Smile className="h-5 w-5" />
        </Button>

        {/* Voice Message */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden shrink-0 text-gray-400 hover:bg-white/10 hover:text-white sm:flex"
          aria-label="Voice message"
        >
          <Mic className="h-5 w-5" />
        </Button>

        {/* Send */}
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          size="icon"
          className="shrink-0 rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40"
          aria-label="Send message"
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
