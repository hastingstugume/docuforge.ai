import { z } from "zod";
import { projectSchema } from "./entities";
import { userSchema } from "./auth";

export const apiErrorSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
});

export const listProjectsResponseSchema = z.object({
  ok: z.literal(true),
  data: z.array(projectSchema),
});

export const createProjectInputSchema = z.object({
  name: z.string().trim().min(2, "Project name must be at least 2 characters."),
  description: z.string().trim().min(5, "Project description must be at least 5 characters."),
});

export const createProjectResponseSchema = z.object({
  ok: z.literal(true),
  data: projectSchema,
});

export const meResponseSchema = z.object({
  ok: z.literal(true),
  data: userSchema,
});

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ListProjectsResponse = z.infer<typeof listProjectsResponseSchema>;
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;
export type CreateProjectResponse = z.infer<typeof createProjectResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
