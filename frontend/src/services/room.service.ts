import { Room } from "../types/room";

const API_URL = "http://localhost:4000/api";

export async function getRooms(): Promise<Room[]> {
  const response = await fetch(`${API_URL}/rooms`);

  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return response.json();
}