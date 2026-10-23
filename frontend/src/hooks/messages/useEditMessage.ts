import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMessage } from "@/src/services/message.service";
import type { Message } from "@/src/types/messages";
import type { EditMessageParams } from "@/src/types/messages";
export function useEditMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, messageId, content }: EditMessageParams) =>
      updateMessage(roomId, messageId, content),

    onSuccess: (updatedMessage, { roomId }) => {
      queryClient.setQueryData<Message[]>(
        ["messages", roomId],
        (messages = []) =>
          messages.map((message) =>
            message.id === updatedMessage.id ? updatedMessage : message,
          ),
      );
    },
  });
}