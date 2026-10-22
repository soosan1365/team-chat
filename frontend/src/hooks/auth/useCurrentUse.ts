import { getCurrentUser } from "@/src/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const authKeys = {
  currentUser: ["auth", "me"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false,
  });
}