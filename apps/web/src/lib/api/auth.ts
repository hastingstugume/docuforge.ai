import type { AuthResponse, LoginInput, SignupInput } from "@docuforge/shared";
import { parseAuthResponse, parseLoginInput, parseSignupInput } from "@/lib/validation/auth";

function resolveApiBaseUrl(): string {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const host = hostname === "localhost" ? "127.0.0.1" : hostname;
    return `http://${host}:4000`;
  }

  return "http://127.0.0.1:4000";
}

function getApiUrl(pathname: string): string {
  return `${resolveApiBaseUrl()}${pathname}`;
}

async function parseErrorMessage(response: Response): Promise<string | null> {
  try {
    const payload = (await response.json()) as { error?: unknown };
    return typeof payload.error === "string" ? payload.error : null;
  } catch {
    return null;
  }
}

export async function login(payload: LoginInput): Promise<AuthResponse> {
  const parsed = parseLoginInput(payload);

  const response = await fetch(getApiUrl("/auth/login"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message ?? "Login failed. Please try again.");
  }

  return parseAuthResponse(await response.json());
}

export async function signup(payload: SignupInput): Promise<AuthResponse> {
  const parsed = parseSignupInput(payload);

  const response = await fetch(getApiUrl("/auth/signup"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message ?? "Signup failed. Please try again.");
  }

  return parseAuthResponse(await response.json());
}
