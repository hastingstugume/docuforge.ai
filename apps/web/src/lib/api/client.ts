const DEFAULT_API_PORT = 4000;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function resolveApiBaseUrl(): string {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (isBrowser()) {
    const hostname = window.location.hostname || "127.0.0.1";
    const host = hostname === "localhost" ? "127.0.0.1" : hostname;
    return `http://${host}:${DEFAULT_API_PORT}`;
  }

  return `http://127.0.0.1:${DEFAULT_API_PORT}`;
}

export function getApiUrl(pathname: string): string {
  return `${resolveApiBaseUrl()}${pathname}`;
}

async function readErrorMessage(response: Response): Promise<string | null> {
  try {
    const payload = (await response.json()) as { error?: unknown };
    return typeof payload.error === "string" ? payload.error : null;
  } catch {
    return null;
  }
}

export async function apiFetchJson(pathname: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(getApiUrl(pathname), init);

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message ?? `Request failed with status ${response.status}`);
  }

  return response.json();
}
