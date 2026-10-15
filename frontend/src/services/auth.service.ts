
const API_URL = "http://localhost:4000/api/auth";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export async function registerUser(input: RegisterInput) {
const response = await fetch(`${API_URL}/register`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(input),
});

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Registration failed");
  }

  return data;
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
 const response = await fetch(`${API_URL}/login`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(input),
});

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Login failed");
  }

  return data;
}
export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/me`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Authentication required");
  }

  return data;
}


export async function logoutUser(): Promise<void> {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Logout failed");
  }
}
