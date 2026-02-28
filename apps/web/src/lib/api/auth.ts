import {
  authResponseSchema,
  loginInputSchema,
  signupInputSchema,
  type AuthResponse,
  type LoginInput,
  type SignupInput,
} from "@docuforge/shared";
import { saveAuthSession } from "@/lib/api/auth-storage";
import { apiFetchJson } from "@/lib/api/client";

export async function login(payload: LoginInput): Promise<AuthResponse> {
  const parsed = loginInputSchema.parse(payload);
  const response = await apiFetchJson("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed),
  });
  const authResponse = authResponseSchema.parse(response);
  saveAuthSession(authResponse);
  return authResponse;
}

export async function signup(payload: SignupInput): Promise<AuthResponse> {
  const parsed = signupInputSchema.parse(payload);
  const response = await apiFetchJson("/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed),
  });
  const authResponse = authResponseSchema.parse(response);
  saveAuthSession(authResponse);
  return authResponse;
}
