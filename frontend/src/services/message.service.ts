//قط مسئول گرفتن تاریخچه پیام‌ها از بک‌اند
const API_URL = "http://localhost:4000/api";

export async function getRoomMessages(roomId: string) {
  const response = await fetch(
    `${API_URL}/rooms/${roomId}/messages`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return response.json();
}

export type CreateMessageInput = {
  content: string;
  userId: string;
  roomId: string;
};

export async function createMessage(input: CreateMessageInput) {
  const response = await fetch(
    `${API_URL}/rooms/${input.roomId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: input.content,
        userId: input.userId,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}
