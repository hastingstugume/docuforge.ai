import {
  listActivityEventsQuerySchema,
  listActivityEventsResponseSchema,
  type ActivityEvent,
  type ListActivityEventsQuery,
} from "@docuforge/shared";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetchJson } from "@/lib/api/client";

export const activityEventsQueryKey = ["activity-events"] as const;

function toActivityQueryString(query: ListActivityEventsQuery): string {
  const normalized = listActivityEventsQuerySchema.parse(query);
  const searchParams = new URLSearchParams();
  if (normalized.limit) {
    searchParams.set("limit", String(normalized.limit));
  }

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : "";
}

async function fetchActivityEvents(query: ListActivityEventsQuery = {}): Promise<ActivityEvent[]> {
  const payload = await apiFetchJson(`/activities${toActivityQueryString(query)}`);
  return listActivityEventsResponseSchema.parse(payload).data;
}

export function useActivityEvents(query: ListActivityEventsQuery = {}) {
  const normalizedQuery = listActivityEventsQuerySchema.parse(query);

  return useQuery({
    queryKey: [...activityEventsQueryKey, normalizedQuery] as const,
    queryFn: () => fetchActivityEvents(normalizedQuery),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}
