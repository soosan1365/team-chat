
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage, type Message } from "@/src/services/message.service";

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      messageId,
    }: {
      roomId: string;
      messageId: string;
    }) => deleteMessage(roomId, messageId),

    onSuccess: (_, { roomId, messageId }) => {
      queryClient.setQueryData<Message[]>(
        ["messages", roomId],
        (oldMessages = []) =>
          oldMessages.filter((message) => message.id !== messageId),
      );
    },
  });
}
