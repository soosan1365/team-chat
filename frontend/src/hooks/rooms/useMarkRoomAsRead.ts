import { markRoomAsRead } from "@/src/services/message.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMarkRoomAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markRoomAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unreadMessagesCount"],
      });
    },
  });
}