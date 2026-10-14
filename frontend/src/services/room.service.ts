import { Room } from "../types/room";

const API_URL = "http://localhost:4000/api";

export async function getRooms(): Promise<Room[]> {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("Please log in to view rooms");
  }

  const response = await fetch(`${API_URL}/rooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return response.json();
}
export async function joinRoom(roomId: string) {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("Please log in to join a room");
  }

  const response = await fetch(`${API_URL}/rooms/${roomId}/join`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "Failed to join room");
  }

  return response.json();
}