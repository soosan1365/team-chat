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
