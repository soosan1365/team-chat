import { useQuery } from "@tanstack/react-query";
import { getUnreadMessagesCount } from "../services/message.service";

export function useUnreadMessagesCount() {
  return useQuery({
    queryKey: ["unreadMessagesCount"],
    queryFn: getUnreadMessagesCount,
    refetchInterval: 10000,
  });
}