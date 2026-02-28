import { meResponseSchema, type User } from "@docuforge/shared";
import { useQuery } from "@tanstack/react-query";
import { apiFetchJson } from "@/lib/api/client";
import { getAuthToken } from "@/lib/api/auth-storage";
import { isMockingEnabled } from "@/lib/msw/initialize";

async function fetchMe(token: string | null): Promise<User> {
  const payload = await apiFetchJson("/me", {
    headers: token ? { authorization: `Bearer ${token}` } : undefined,
  });
  return meResponseSchema.parse(payload).data;
}

export function useMe() {
  const token = getAuthToken();
  const shouldFetch = Boolean(token) || isMockingEnabled();

  return useQuery({
    queryKey: ["me", token ?? "anonymous"],
    queryFn: () => fetchMe(token),
    enabled: shouldFetch,
    staleTime: 60_000,
  });
}
