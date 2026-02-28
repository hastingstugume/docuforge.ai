import {
  listDocumentsQuerySchema,
  listDocumentsResponseSchema,
  type ListDocumentsQuery,
  type ListDocumentsResponse,
} from "@docuforge/shared";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetchJson } from "@/lib/api/client";

export const documentsQueryKey = ["documents"] as const;

function toDocumentsQueryString(query: ListDocumentsQuery): string {
  const normalized = listDocumentsQuerySchema.parse(query);
  const searchParams = new URLSearchParams();

  if (normalized.search) searchParams.set("search", normalized.search);
  if (normalized.status) searchParams.set("status", normalized.status);
  if (normalized.page) searchParams.set("page", String(normalized.page));
  if (normalized.pageSize) searchParams.set("pageSize", String(normalized.pageSize));
  if (normalized.sortBy) searchParams.set("sortBy", normalized.sortBy);
  if (normalized.sortOrder) searchParams.set("sortOrder", normalized.sortOrder);

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : "";
}

async function fetchDocuments(query: ListDocumentsQuery = {}): Promise<ListDocumentsResponse> {
  const payload = await apiFetchJson(`/documents${toDocumentsQueryString(query)}`);
  return listDocumentsResponseSchema.parse(payload);
}

export function useDocuments(query: ListDocumentsQuery = {}) {
  const normalizedQuery = listDocumentsQuerySchema.parse(query);

  return useQuery({
    queryKey: [...documentsQueryKey, normalizedQuery] as const,
    queryFn: () => fetchDocuments(normalizedQuery),
    placeholderData: keepPreviousData,
  });
}
