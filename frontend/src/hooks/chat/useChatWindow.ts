import { useState } from "react";
import { useRooms } from "@/src/hooks/rooms/useRooms";
import type { ReplyMessage } from "@/src/types/messages";

export function useChatWindow(selectedRoomId: string | null) {
  const { data: rooms } = useRooms();

  const [replyState, setReplyState] = useState<{
    roomId: string | null;
    message: ReplyMessage | null;
  }>({
    roomId: selectedRoomId,
    message: null,
  });

  const currentRoom = rooms?.find((room) => room.id === selectedRoomId);
  const isMember = currentRoom?.isMember ?? false;

  const replyingTo =
    replyState.roomId === selectedRoomId ? replyState.message : null;

  function setReplyingTo(message: ReplyMessage | null) {
    setReplyState({
      roomId: selectedRoomId,
      message,
    });
  }

  return {
    isMember,
    replyingTo,
    setReplyingTo,
  };
}