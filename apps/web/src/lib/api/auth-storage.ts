import type { AuthResponse, User } from "@docuforge/shared";

const TOKEN_KEY = "docuforge.auth.token";
const USER_KEY = "docuforge.auth.user";

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

export function saveAuthSession(payload: AuthResponse): void {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, payload.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

export function clearAuthSession(): void {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getAuthToken(): string | null {
  if (!hasWindow()) {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (!hasWindow()) {
    return null;
  }

  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
