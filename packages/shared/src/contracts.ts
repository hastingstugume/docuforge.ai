import { z } from "zod";
import { projectSchema, projectStatusSchema, projectTypeSchema } from "./entities";
import { userSchema } from "./auth";

export const apiErrorSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
});

export const listProjectsResponseSchema = z.object({
  ok: z.literal(true),
  data: z.array(projectSchema),
  meta: z
    .object({
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      pageSize: z.number().int().positive(),
      totalPages: z.number().int().nonnegative(),
    })
    .optional(),
});

export const listProjectsQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: projectStatusSchema.optional(),
  type: projectTypeSchema.optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  sortBy: z.enum(["updatedAt", "createdAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const createProjectInputSchema = z.object({
  name: z.string().trim().min(2, "Project name must be at least 2 characters."),
  description: z.string().trim().min(5, "Project description must be at least 5 characters."),
  type: z
    .enum(["api", "dashboard", "infrastructure", "finance", "compliance", "migration", "general"])
    .optional(),
});

export const createProjectResponseSchema = z.object({
  ok: z.literal(true),
  data: projectSchema,
});

export const getProjectResponseSchema = z.object({
  ok: z.literal(true),
  data: projectSchema,
});

export const updateProjectInputSchema = z
  .object({
    name: z.string().trim().min(2, "Project name must be at least 2 characters.").optional(),
    description: z
      .string()
      .trim()
      .min(5, "Project description must be at least 5 characters.")
      .optional(),
    status: projectStatusSchema.optional(),
    type: projectTypeSchema.optional(),
    docsCount: z.number().int().nonnegative().optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.description !== undefined ||
      value.status !== undefined ||
      value.type !== undefined ||
      value.docsCount !== undefined,
    {
      message: "Provide at least one field to update.",
    },
  );

export const updateProjectResponseSchema = z.object({
  ok: z.literal(true),
  data: projectSchema,
});

export const deleteProjectInputSchema = z.object({
  confirmName: z.string().trim().min(1, "Project name confirmation is required."),
});

export const deleteProjectResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    id: z.string(),
  }),
});

export const meResponseSchema = z.object({
  ok: z.literal(true),
  data: userSchema,
});

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
export type ListProjectsResponse = z.infer<typeof listProjectsResponseSchema>;
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;
export type CreateProjectResponse = z.infer<typeof createProjectResponseSchema>;
export type GetProjectResponse = z.infer<typeof getProjectResponseSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;
export type UpdateProjectResponse = z.infer<typeof updateProjectResponseSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectInputSchema>;
export type DeleteProjectResponse = z.infer<typeof deleteProjectResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
