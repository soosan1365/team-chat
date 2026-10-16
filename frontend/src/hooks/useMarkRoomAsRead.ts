import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markRoomAsRead } from "../services/message.service";

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