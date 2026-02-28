import {
  authResponseSchema,
  loginInputSchema,
  signupInputSchema,
  type AuthResponse,
  type LoginInput,
  type SignupInput,
} from "@docuforge/shared";

export { authResponseSchema, loginInputSchema, signupInputSchema };

export function parseLoginInput(payload: unknown): LoginInput {
  return loginInputSchema.parse(payload) as LoginInput;
}

export function parseSignupInput(payload: unknown): SignupInput {
  return signupInputSchema.parse(payload) as SignupInput;
}

export function parseAuthResponse(payload: unknown): AuthResponse {
  return authResponseSchema.parse(payload) as AuthResponse;
}
