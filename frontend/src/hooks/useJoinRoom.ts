import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinRoom } from "../services/room.service";

export function useJoinRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinRoom,
    onSuccess: async (_data, roomId) => {
      await queryClient.invalidateQueries({ queryKey: ["rooms"] });
      await queryClient.invalidateQueries({
        queryKey: ["room-messages", roomId],
      });
    },
    onError: (error) => {
      console.error("Failed to join room:", error);
    },
  });
}
