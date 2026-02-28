import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string().trim().min(1),
  email: z.email(),
});

export const loginInputSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signupInputSchema = loginInputSchema.extend({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
});

export const authResponseSchema = z.object({
  ok: z.literal(true),
  user: userSchema,
  token: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
