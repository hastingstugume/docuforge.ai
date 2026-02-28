import {
  createProjectInputSchema,
  createProjectResponseSchema,
  listProjectsResponseSchema,
  type CreateProjectInput,
  type Project,
} from "@docuforge/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetchJson } from "@/lib/api/client";

export const projectsQueryKey = ["projects"] as const;

async function fetchProjects(): Promise<Project[]> {
  const payload = await apiFetchJson("/projects");
  return listProjectsResponseSchema.parse(payload).data;
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

export function useProjects() {
  return useQuery({
    queryKey: projectsQueryKey,
    queryFn: fetchProjects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
}
