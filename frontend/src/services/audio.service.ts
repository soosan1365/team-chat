const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function uploadAudioMessage(roomId: string, audioBlob: Blob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "voice-message.webm");

  const response = await fetch(`${API_URL}/api/rooms/${roomId}/audio`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to upload audio message");
  }

  return data;
}
