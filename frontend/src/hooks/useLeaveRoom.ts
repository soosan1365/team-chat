import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveRoom } from "../services/room.service";

export function useLeaveRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveRoom,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },
  });
}
