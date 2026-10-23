
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage } from "@/src/services/message.service";
import type { Message } from "@/src/types/messages";
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
