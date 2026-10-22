import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAudioMessage } from "@/src/services/audio.service";

export function useUploadAudio(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (audioBlob: Blob) =>
      uploadAudioMessage(roomId, audioBlob),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["messages", roomId],
      });
    },
  });
}