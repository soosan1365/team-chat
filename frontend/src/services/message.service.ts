// مسئول گرفتن تاریخچه پیام‌ها و ارسال پیام به بک‌اند
const API_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api`;
export type Message = {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
  };
  replyTo: {
    id: string;
    content: string;
    user: {
      id: string;
      name: string | null;
    };
  } | null;
  type: string;
  audioUrl: string | null;
  fileUrl: string | null;
  fileName: string | null;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as T;
}

export async function getRoomMessages(roomId: string): Promise<Message[]> {
  const response = await fetch(`${API_URL}/rooms/${roomId}/messages`, {
    credentials: "include",
    cache: "no-store",
  });

  return parseResponse<Message[]>(response);
}

export type CreateMessageInput = {
  content: string;
  roomId: string;
  replyToId?: string | null;
};

export async function createMessage(input: CreateMessageInput) {
  const response = await fetch(`${API_URL}/rooms/${input.roomId}/messages`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: input.content,
      replyToId: input.replyToId,
    }),
  });

  return parseResponse<Message>(response);
}
export async function updateMessage(
  roomId: string,
  messageId: string,
  content: string,
): Promise<Message> {
  const response = await fetch(
    `${API_URL}/rooms/${roomId}/messages/${messageId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    },
  );

  return parseResponse<Message>(response);
}
export async function markRoomAsRead(roomId: string): Promise<void> {
  const response = await fetch(`${API_URL}/rooms/${roomId}/read`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to mark room as read");
  }
}
export async function getUnreadMessagesCount(): Promise<number> {
  const response = await fetch(`${API_URL}/messages/unread-count`, {
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseResponse<{ count: number }>(response);
  return data.count;
}
export async function deleteMessage(
  roomId: string,
  messageId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/rooms/${roomId}/messages/${messageId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "Failed to delete message");
  }
}
