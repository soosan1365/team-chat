import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/auth.service";

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