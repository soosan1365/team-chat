const API_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/auth`;
import type { RegisterInput, LoginInput, AuthResponse } from "@/src/types/auth";
import { parseResponse } from "@/src/services/api";
export async function registerUser(input: RegisterInput) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<AuthResponse>(response);
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseResponse<AuthResponse>(response);
}
export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/me`, {
    credentials: "include",
  });

  return parseResponse<AuthResponse>(response);
}

export async function logoutUser(): Promise<void> {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  await parseResponse<unknown>(response);
}
