import { z } from "zod";

export const projectStatusSchema = z.enum(["active", "draft", "archived"]);

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: projectStatusSchema,
  docsCount: z.number().int().nonnegative(),
  updatedAt: z.string(),
  createdAt: z.string(),
  ownerId: z.string(),
});

export const contextSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  completion: z.number().int().min(0).max(100),
  summary: z.string(),
  updatedAt: z.string(),
});

export const documentStatusSchema = z.enum(["draft", "review", "published"]);

export const documentSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  summary: z.string(),
  status: documentStatusSchema,
  version: z.string(),
  updatedAt: z.string(),
});

export const jobStatusSchema = z.enum(["queued", "processing", "completed", "failed"]);

export const jobSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  type: z.enum(["pdf", "docx", "markdown", "generation"]),
  status: jobStatusSchema,
  progress: z.number().int().min(0).max(100),
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
});

export const exportFormatSchema = z.enum(["pdf", "docx", "markdown", "html"]);

export const exportSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  fileName: z.string(),
  format: exportFormatSchema,
  sizeBytes: z.number().int().nonnegative(),
  version: z.string(),
  exportedAt: z.string(),
});

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Context = z.infer<typeof contextSchema>;
export type DocumentStatus = z.infer<typeof documentStatusSchema>;
export type Document = z.infer<typeof documentSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
export type Job = z.infer<typeof jobSchema>;
export type ExportFormat = z.infer<typeof exportFormatSchema>;
export type Export = z.infer<typeof exportSchema>;
