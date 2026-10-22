
import { uploadAttachment } from "@/src/services/attachment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadAttachment(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAttachment(roomId, file),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["messages", roomId],
      });
    },
  });
}
