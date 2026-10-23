const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
import type { UploadAttachmentResponse } from "@/src/types/messages";
import { parseResponse } from "@/src/services/api";
export async function uploadAttachment(roomId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/rooms/${roomId}/attachments`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return parseResponse<UploadAttachmentResponse>(response);
}
