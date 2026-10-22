"use client";

import { useRoomMessages } from "@/src/hooks/useRoomMessages";
import { useRooms } from "@/src/hooks/useRooms";
import { useSocket } from "@/src/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import ChatStatus from "./ChatStatus";
import { useMarkRoomAsRead } from "@/src/hooks/useMarkRoomAsRead";
import { useDeleteMessage } from "@/src/hooks/useDeleteMessage";
import DeleteMessageDialog from "./DeleteMessageDialog";
import { useEditMessage } from "@/src/hooks/useEditMessage";
import MessageItem from "./MessageItem";

type MessageListProps = {
  roomId: string;
  userId: string;
  onReply: (reply: { id: string; content: string; senderName: string }) => void;
};

export default function MessageList({
  roomId,
  userId,
  onReply,
}: MessageListProps) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const editMessageMutation = useEditMessage();
  const deleteMessageMutation = useDeleteMessage();
  const { mutate: markAsRead } = useMarkRoomAsRead();
  const { data: rooms, isLoading: isLoadingRooms } = useRooms();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const currentRoom = rooms?.find((room) => room.id === roomId);
  const isMember = currentRoom?.isMember ?? false;
  const {
    data: messages,
    isLoading,
    isError,
  } = useRoomMessages(roomId, Boolean(isMember));

  useSocket(isMember ? roomId : "");

  useEffect(() => {
    if (isLoading || isLoadingRooms || isError || !isMember) return;

    markAsRead(roomId);
  }, [roomId, isLoading, isLoadingRooms, isError, isMember, markAsRead]);

  useEffect(() => {
    if (isLoading || isLoadingRooms || !isMember) return;

    bottomRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  }, [isLoading, isLoadingRooms, isMember, messages]);

  useEffect(() => {
    setEditingMessageId(null);
    setEditContent("");
    setActiveMessageId(null);
    setMessageToDelete(null);
  }, [roomId]);
  const handleSaveEdit = (messageId: string) => {
    const content = editContent.trim();

    if (!content || !isMember) return;

    editMessageMutation.mutate(
      { roomId, messageId, content },
      {
        onSuccess: () => {
          setEditingMessageId(null);
          setEditContent("");
          setActiveMessageId(null);
        },
        onError: (error) => {
          console.error("Failed to edit message:", error);
        },
      },
    );
  };

  const handleDelete = (messageId: string) => {
    if (!isMember) return;
    setMessageToDelete(messageId);
  };
  const confirmDelete = () => {
    if (!messageToDelete) return;

    deleteMessageMutation.mutate(
      { roomId, messageId: messageToDelete },
      {
        onSuccess: () => {
          setActiveMessageId(null);
          setMessageToDelete(null);
        },
        onError: (error) => {
          console.error("Failed to delete message:", error);
        },
      },
    );
  };

  if (!roomId) {
    return (
      <ChatStatus
        type="empty"
        title="Ready to connect?"
        description="Choose a room from the sidebar and join the conversation."
      />
    );
  }

  if (isLoadingRooms) {
    return (
      <ChatStatus
        type="loading"
        title="Loading rooms..."
        description="Getting your workspace ready."
      />
    );
  }

  // User is not a member
  if (currentRoom && !isMember) {
    return (
      <ChatStatus
        type="locked"
        title="Join this room first"
        description="Join the room from the sidebar to view messages and chat with others."
      />
    );
  }

  // Loading messages
  if (isLoading) {
    return (
      <ChatStatus
        type="loading"
        title="Loading messages..."
        description="Getting your conversation ready."
      />
    );
  }

  // Error loading messages
  if (isError) {
    return (
      <ChatStatus
        type="error"
        title="Something went wrong"
        description="Couldn't load messages. Please try again."
      />
    );
  }
  // Messages list

  return (
    <div className="flex-1 space-y-6 overflow-y-auto bg-[#070d18] p-6">
      {messages?.length ? (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            userId={userId}
            activeMessageId={activeMessageId}
            setActiveMessageId={setActiveMessageId}
            editingMessageId={editingMessageId}
            setEditingMessageId={setEditingMessageId}
            editContent={editContent}
            setEditContent={setEditContent}
            isSaving={editMessageMutation.isPending}
            onReply={onReply}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <ChatStatus
          type="empty"
          title="Start the conversation"
          description="No messages yet. Send the first message!"
        />
      )}

      <div ref={bottomRef} />
      <DeleteMessageDialog
        open={messageToDelete !== null}
        isDeleting={deleteMessageMutation.isPending}
        onCancel={() => setMessageToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
