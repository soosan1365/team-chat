const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function uploadAttachment(roomId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/api/rooms/${roomId}/attachments`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to upload attachment");
  }

  return data;
}