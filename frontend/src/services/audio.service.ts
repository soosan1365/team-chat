
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function uploadAudioMessage(
  roomId: string,
  audioBlob: Blob,
) {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("Authentication required");
  }

  const formData = new FormData();
  formData.append("audio", audioBlob, "voice-message.webm");

  const response = await fetch(
    `${API_URL}/api/rooms/${roomId}/audio`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to upload audio message");
  }

  return response.json();
}
