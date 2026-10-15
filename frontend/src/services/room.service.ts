import { Room } from "../types/room";

const API_URL = "http://localhost:4000/api";

export async function getRooms(): Promise<Room[]> {
  const response = await fetch(`${API_URL}/rooms`, {
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch rooms");
  }

  return data;
}

export async function joinRoom(roomId: string) {
  const response = await fetch(`${API_URL}/rooms/${roomId}/join`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to join room");
  }

  return data;
}
export async function leaveRoom(roomId: string) {
  const response = await fetch(`${API_URL}/rooms/${roomId}/leave`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to leave room");
  }

  return data;
}