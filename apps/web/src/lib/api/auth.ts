import type { AuthResponse, LoginInput, SignupInput } from "@docuforge/shared";
import { parseAuthResponse, parseLoginInput, parseSignupInput } from "@/lib/validation/auth";

export async function login(payload: LoginInput): Promise<AuthResponse> {
  const parsed = parseLoginInput(payload);

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed),
  });

  if (!response.ok) {
    throw new Error("Login failed. Please try again.");
  }

  return parseAuthResponse(await response.json());
}

export async function signup(payload: SignupInput): Promise<AuthResponse> {
  const parsed = parseSignupInput(payload);

  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed),
  });

  if (!response.ok) {
    throw new Error("Signup failed. Please try again.");
  }

  return parseAuthResponse(await response.json());
}
