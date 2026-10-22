import { useEffect, useState } from "react";
import { useRooms } from "@/src/hooks/rooms/useRooms";

export function useChatWindow(selectedRoomId: string | null) {
  const { data: rooms } = useRooms();

  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    content: string;
    senderName: string;
  } | null>(null);

  const currentRoom = rooms?.find((room) => room.id === selectedRoomId);

  const isMember = currentRoom?.isMember ?? false;

  useEffect(() => {
    setReplyingTo(null);
  }, [selectedRoomId]);

  return {
    isMember,
    replyingTo,
    setReplyingTo,
  };
}
