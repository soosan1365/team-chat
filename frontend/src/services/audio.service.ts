
import { parseResponse } from "@/src/services/api";
import { UploadAudioResponse } from "../types/attachment";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function uploadAudioMessage(
  roomId: string,
  audioBlob: Blob,
): Promise<UploadAudioResponse> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "voice-message.webm");

  const response = await fetch(
    `${API_URL}/api/rooms/${roomId}/audio`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  return parseResponse<UploadAudioResponse>(response);
}
