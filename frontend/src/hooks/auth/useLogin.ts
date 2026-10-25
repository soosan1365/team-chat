
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "@/src/services/auth.service";
import { authKeys } from "./useCurrentUse";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.currentUser,
      });
    },
  });
}
