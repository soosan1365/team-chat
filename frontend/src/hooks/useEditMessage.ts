import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMessage, type Message } from "@/src/services/message.service";

type EditMessageParams = {
  roomId: string;
  messageId: string;
  content: string;
};

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