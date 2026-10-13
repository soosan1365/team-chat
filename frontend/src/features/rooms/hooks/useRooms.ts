
import { getRooms } from "@/src/services/room.service";
import { useQuery } from "@tanstack/react-query";

export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
}