import { useState } from "react";
import { createMessage } from "@/src/services/message.service";

export function useSendMessage() {
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  async function sendMessage(
    content: string,
    roomId: string,
    replyToId: string | null,
  ) {
    if (isSendingMessage || !content.trim()) return;

    try {
      setIsSendingMessage(true);

      await createMessage({
        content: content.trim(),
        roomId,
        replyToId,
      });

      return true;
    } catch (error) {
      console.error("Failed to send message:", error);
      return false;
    } finally {
      setIsSendingMessage(false);
    }
  }

  return { sendMessage, isSendingMessage };
}