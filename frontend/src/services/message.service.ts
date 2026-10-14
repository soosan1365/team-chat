//قط مسئول گرفتن تاریخچه پیام‌ها از بک‌اند
const API_URL = "http://localhost:4000/api";
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
};
export async function getRoomMessages(
  roomId: string
): Promise<Message[]> {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("Please log in to view messages");
  }

  const response = await fetch(
    `${API_URL}/rooms/${roomId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return response.json() as Promise<Message[]>;
}

export type CreateMessageInput = {
  content: string;
  roomId: string;
};

export async function createMessage(input: CreateMessageInput) {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("Please log in to send messages");
  }

  const response = await fetch(
    `${API_URL}/rooms/${input.roomId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: input.content,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}

