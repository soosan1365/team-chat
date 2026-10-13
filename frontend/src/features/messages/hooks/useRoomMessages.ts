import { getRoomMessages } from "../../../services/message.service";

import { useQuery } from "@tanstack/react-query";

export function useRoomMessages(roomId: string) {
  return useQuery({
    queryKey: ["messages", roomId],
    queryFn: () => getRoomMessages(roomId),
    enabled: Boolean(roomId),
  });
}
