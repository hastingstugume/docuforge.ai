import { z } from "zod";
import type { AuthResponse, LoginInput, SignupInput } from "@docuforge/shared";

export const loginInputSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signupInputSchema = loginInputSchema.extend({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
});

export const authResponseSchema = z.object({
  ok: z.boolean(),
  user: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.email(),
  }),
  token: z.string(),
});

export function parseLoginInput(payload: unknown): LoginInput {
  return loginInputSchema.parse(payload) as LoginInput;
}

export function parseSignupInput(payload: unknown): SignupInput {
  return signupInputSchema.parse(payload) as SignupInput;
}

export function parseAuthResponse(payload: unknown): AuthResponse {
  return authResponseSchema.parse(payload) as AuthResponse;
}
