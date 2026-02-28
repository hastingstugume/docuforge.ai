import {
  createProjectInputSchema,
  createProjectResponseSchema,
  deleteProjectInputSchema,
  deleteProjectResponseSchema,
  getProjectResponseSchema,
  listProjectsQuerySchema,
  listProjectsResponseSchema,
  updateProjectInputSchema,
  updateProjectResponseSchema,
  type CreateProjectInput,
  type DeleteProjectInput,
  type ListProjectsQuery,
  type ListProjectsResponse,
  type Project,
  type UpdateProjectInput,
} from "@docuforge/shared";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetchJson } from "@/lib/api/client";

export const projectsQueryKey = ["projects"] as const;
export const projectQueryKey = (projectId: string) => [...projectsQueryKey, projectId] as const;

function toProjectsQueryString(query: ListProjectsQuery): string {
  const normalized = listProjectsQuerySchema.parse(query);
  const searchParams = new URLSearchParams();

  if (normalized.search) searchParams.set("search", normalized.search);
  if (normalized.status) searchParams.set("status", normalized.status);
  if (normalized.type) searchParams.set("type", normalized.type);
  if (normalized.page) searchParams.set("page", String(normalized.page));
  if (normalized.pageSize) searchParams.set("pageSize", String(normalized.pageSize));
  if (normalized.sortBy) searchParams.set("sortBy", normalized.sortBy);
  if (normalized.sortOrder) searchParams.set("sortOrder", normalized.sortOrder);

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : "";
}

async function fetchProjects(query: ListProjectsQuery = {}): Promise<ListProjectsResponse> {
  const payload = await apiFetchJson(`/projects${toProjectsQueryString(query)}`);
  return listProjectsResponseSchema.parse(payload);
}

async function fetchProject(projectId: string): Promise<Project> {
  const payload = await apiFetchJson(`/projects/${projectId}`);
  return getProjectResponseSchema.parse(payload).data;
}

async function createProject(payload: CreateProjectInput): Promise<Project> {
  const parsedPayload = createProjectInputSchema.parse(payload);
  const response = await apiFetchJson("/projects", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsedPayload),
  });
  return createProjectResponseSchema.parse(response).data;
}

async function updateProject(projectId: string, payload: UpdateProjectInput): Promise<Project> {
  const parsedPayload = updateProjectInputSchema.parse(payload);
  const response = await apiFetchJson(`/projects/${projectId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsedPayload),
  });
  return updateProjectResponseSchema.parse(response).data;
}

async function deleteProject(projectId: string, payload: DeleteProjectInput): Promise<string> {
  const parsedPayload = deleteProjectInputSchema.parse(payload);
  const response = await apiFetchJson(`/projects/${projectId}`, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsedPayload),
  });
  return deleteProjectResponseSchema.parse(response).data.id;
}

export function useProjects(query: ListProjectsQuery = {}) {
  const normalizedQuery = listProjectsQuerySchema.parse(query);

  return useQuery({
    queryKey: [...projectsQueryKey, normalizedQuery] as const,
    queryFn: () => fetchProjects(normalizedQuery),
    placeholderData: keepPreviousData,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: projectQueryKey(projectId),
    queryFn: () => fetchProject(projectId),
    enabled: projectId.length > 0,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.setQueryData(projectQueryKey(project.id), project);
      void queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: UpdateProjectInput }) =>
      updateProject(projectId, payload),
    onSuccess: (project) => {
      queryClient.setQueryData(projectQueryKey(project.id), project);
      void queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: DeleteProjectInput }) =>
      deleteProject(projectId, payload),
    onSuccess: (projectId) => {
      queryClient.removeQueries({ queryKey: projectQueryKey(projectId) });
      void queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
}
