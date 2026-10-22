import { getUnreadMessagesCount } from "@/src/services/message.service";
import { useQuery } from "@tanstack/react-query";

export function useUnreadMessagesCount() {
  return useQuery({
    queryKey: ["unreadMessagesCount"],
    queryFn: getUnreadMessagesCount,
    refetchInterval: 10000,
  });
}