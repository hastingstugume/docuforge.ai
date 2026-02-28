import {
  authResponseSchema,
  createProjectInputSchema,
  createProjectResponseSchema,
  deleteProjectInputSchema,
  deleteProjectResponseSchema,
  getProjectResponseSchema,
  listActivityEventsQuerySchema,
  listActivityEventsResponseSchema,
  listProjectsQuerySchema,
  listProjectsResponseSchema,
  loginInputSchema,
  meResponseSchema,
  signupInputSchema,
  updateProjectInputSchema,
  updateProjectResponseSchema,
  type ActivityEvent,
  type Project,
  type ProjectStatus,
  type ProjectType,
  type User,
} from "@docuforge/shared";
import { http, HttpResponse } from "msw";

const seededProjects: Project[] = [
  {
    id: "proj-nexus-api",
    name: "Nexus API Gateway",
    description: "Internal documentation for the microservices gateway and authentication middleware.",
    status: "active",
    type: "api",
    docsCount: 14,
    updatedAt: "2026-02-24T12:00:00.000Z",
    createdAt: "2026-01-15T08:30:00.000Z",
    ownerId: "user-docuforge",
  },
  {
    id: "proj-cloudscale",
    name: "CloudScale Dashboard",
    description: "Technical specs for the multi-cloud monitoring frontend and real-time analytics.",
    status: "active",
    type: "dashboard",
    docsCount: 8,
    updatedAt: "2026-02-24T09:00:00.000Z",
    createdAt: "2026-01-18T11:15:00.000Z",
    ownerId: "user-docuforge",
  },
  {
    id: "proj-storage-v4",
    name: "Storage Vault v4",
    description: "Infrastructure requirements for the encrypted blob storage and retention policies.",
    status: "active",
    type: "infrastructure",
    docsCount: 22,
    updatedAt: "2026-02-23T14:45:00.000Z",
    createdAt: "2026-01-12T07:00:00.000Z",
    ownerId: "user-docuforge",
  },
  {
    id: "proj-payment-orchestrator",
    name: "Payment Orchestrator",
    description: "Detailed workflows for stripe integration, refund handling, and ledger reconciliation.",
    status: "draft",
    type: "finance",
    docsCount: 5,
    updatedAt: "2026-02-21T16:30:00.000Z",
    createdAt: "2026-01-10T09:20:00.000Z",
    ownerId: "user-docuforge",
  },
  {
    id: "proj-compliance-auditor",
    name: "Compliance Auditor",
    description: "SOX and ISO 27001 compliance tracking system technical requirements and controls.",
    status: "active",
    type: "compliance",
    docsCount: 12,
    updatedAt: "2026-02-17T10:20:00.000Z",
    createdAt: "2025-12-09T14:05:00.000Z",
    ownerId: "user-docuforge",
  },
  {
    id: "proj-legacy-migration",
    name: "Legacy Migration Docs",
    description: "Archived documentation for the sunsetting mainframe-to-cloud migration project.",
    status: "archived",
    type: "migration",
    docsCount: 31,
    updatedAt: "2026-02-10T10:20:00.000Z",
    createdAt: "2025-10-09T10:05:00.000Z",
    ownerId: "user-docuforge",
  },
];

let projects = [...seededProjects];
const seededActivityEvents: ActivityEvent[] = [
  {
    id: "activity-1",
    action: "project.updated",
    resourceType: "project",
    resourceId: "proj-nexus-api",
    resourceName: "Nexus API Gateway",
    actorId: "user-docuforge",
    actorName: "DocuForge User",
    occurredAt: "2026-02-24T12:00:00.000Z",
  },
  {
    id: "activity-2",
    action: "project.updated",
    resourceType: "project",
    resourceId: "proj-payment-orchestrator",
    resourceName: "Payment Orchestrator",
    actorId: "user-docuforge",
    actorName: "DocuForge User",
    occurredAt: "2026-02-24T11:00:00.000Z",
  },
  {
    id: "activity-3",
    action: "project.created",
    resourceType: "project",
    resourceId: "proj-compliance-auditor",
    resourceName: "Compliance Auditor",
    actorId: "user-docuforge",
    actorName: "DocuForge User",
    occurredAt: "2026-02-24T09:00:00.000Z",
  },
];
let activityEvents = [...seededActivityEvents];
const sessions = new Map<string, User>();

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ensureSeedSession(): string {
  const token = "seed-token-docuforge";
  if (!sessions.has(token)) {
    sessions.set(token, {
      id: "user-docuforge",
      fullName: "DocuForge User",
      email: "test@company.com",
    });
  }
  return token;
}

function recordProjectActivity(action: ActivityEvent["action"], project: Project): void {
  activityEvents = [
    {
      id: createId(),
      action,
      resourceType: "project" as const,
      resourceId: project.id,
      resourceName: project.name,
      actorId: "user-docuforge",
      actorName: "DocuForge User",
      occurredAt: new Date().toISOString(),
    },
    ...activityEvents,
  ].slice(0, 5_000);
}

function unauthorizedResponse() {
  return HttpResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function parseListProjectsQuery(requestUrl: string) {
  const url = new URL(requestUrl);
  const pageRaw = url.searchParams.get("page");
  const pageSizeRaw = url.searchParams.get("pageSize");

  const parsed = listProjectsQuerySchema.safeParse({
    search: url.searchParams.get("search") ?? undefined,
    status: (url.searchParams.get("status") ?? undefined) as ProjectStatus | undefined,
    type: (url.searchParams.get("type") ?? undefined) as ProjectType | undefined,
    page: pageRaw ? Number(pageRaw) : undefined,
    pageSize: pageSizeRaw ? Number(pageSizeRaw) : undefined,
    sortBy: url.searchParams.get("sortBy") ?? undefined,
    sortOrder: url.searchParams.get("sortOrder") ?? undefined,
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid query params." };
  }

  return { ok: true as const, data: parsed.data };
}

export const handlers = [
  http.get("*/health", () => {
    return HttpResponse.json({ ok: true, service: "docuforge-mock-api" });
  }),

  http.get("*/activities", ({ request }) => {
    const url = new URL(request.url);
    const limitRaw = url.searchParams.get("limit");
    const parsed = listActivityEventsQuerySchema.safeParse({
      limit: limitRaw ? Number(limitRaw) : undefined,
    });

    if (!parsed.success) {
      return HttpResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid query params." },
        { status: 400 },
      );
    }

    const limit = parsed.data.limit ?? 20;
    return HttpResponse.json(
      listActivityEventsResponseSchema.parse({
        ok: true,
        data: activityEvents.slice(0, limit),
      }),
    );
  }),

  http.post("*/auth/login", async ({ request }) => {
    const body = await request.json();
    const parsed = loginInputSchema.safeParse(body);
    if (!parsed.success) {
      return HttpResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid login payload." }, { status: 400 });
    }

    const user: User = {
      id: "user-docuforge",
      fullName: "DocuForge User",
      email: parsed.data.email.toLowerCase(),
    };
    const token = createId();
    sessions.set(token, user);

    return HttpResponse.json(authResponseSchema.parse({ ok: true, user, token }));
  }),

  http.post("*/auth/signup", async ({ request }) => {
    const body = await request.json();
    const parsed = signupInputSchema.safeParse(body);
    if (!parsed.success) {
      return HttpResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid signup payload." }, { status: 400 });
    }

    const user: User = {
      id: createId(),
      fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
    };
    const token = createId();
    sessions.set(token, user);

    return HttpResponse.json(authResponseSchema.parse({ ok: true, user, token }));
  }),

  http.get("*/me", ({ request }) => {
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length).trim()
      : null;

    if (!token) {
      const fallbackToken = ensureSeedSession();
      const user = sessions.get(fallbackToken) as User;
      return HttpResponse.json(meResponseSchema.parse({ ok: true, data: user }));
    }

    const user = sessions.get(token);
    if (!user) {
      return unauthorizedResponse();
    }

    return HttpResponse.json(meResponseSchema.parse({ ok: true, data: user }));
  }),

  http.get("*/projects", ({ request }) => {
    const query = parseListProjectsQuery(request.url);
    if (!query.ok) {
      return HttpResponse.json({ ok: false, error: query.error }, { status: 400 });
    }

    const search = query.data.search?.toLowerCase() ?? "";
    const sortBy = query.data.sortBy ?? "updatedAt";
    const sortOrder = query.data.sortOrder ?? "desc";
    const page = query.data.page ?? 1;
    const pageSize = query.data.pageSize ?? 20;

    const filtered = projects
      .filter((project) => (query.data.status ? project.status === query.data.status : true))
      .filter((project) => (query.data.type ? project.type === query.data.type : true))
      .filter((project) =>
        search
          ? project.name.toLowerCase().includes(search) ||
            project.description.toLowerCase().includes(search)
          : true,
      )
      .sort((a, b) => {
        let left: string | number;
        let right: string | number;
        if (sortBy === "name") {
          left = a.name.toLowerCase();
          right = b.name.toLowerCase();
        } else if (sortBy === "createdAt") {
          left = new Date(a.createdAt).getTime();
          right = new Date(b.createdAt).getTime();
        } else {
          left = new Date(a.updatedAt).getTime();
          right = new Date(b.updatedAt).getTime();
        }
        if (left === right) return 0;
        const result = left > right ? 1 : -1;
        return sortOrder === "asc" ? result : -result;
      });

    const total = filtered.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return HttpResponse.json(
      listProjectsResponseSchema.parse({
        ok: true,
        data,
        meta: { total, page, pageSize, totalPages },
      }),
    );
  }),

  http.get("*/projects/:projectId", ({ params }) => {
    const projectId = String(params.projectId ?? "");
    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      return HttpResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }

    return HttpResponse.json(getProjectResponseSchema.parse({ ok: true, data: project }));
  }),

  http.post("*/projects", async ({ request }) => {
    const body = await request.json();
    const parsed = createProjectInputSchema.safeParse(body);

    if (!parsed.success) {
      return HttpResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid project payload." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const project: Project = {
      id: createId(),
      name: parsed.data.name,
      description: parsed.data.description,
      status: "draft",
      type: parsed.data.type ?? "general",
      docsCount: 0,
      updatedAt: now,
      createdAt: now,
      ownerId: "user-docuforge",
    };

    projects = [project, ...projects];
    recordProjectActivity("project.created", project);

    return HttpResponse.json(createProjectResponseSchema.parse({ ok: true, data: project }));
  }),

  http.patch("*/projects/:projectId", async ({ params, request }) => {
    const projectId = String(params.projectId ?? "");
    const index = projects.findIndex((item) => item.id === projectId);
    if (index < 0) {
      return HttpResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateProjectInputSchema.safeParse(body);
    if (!parsed.success) {
      return HttpResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid project payload." },
        { status: 400 },
      );
    }

    const updated: Project = {
      ...projects[index],
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updated;
    recordProjectActivity("project.updated", updated);
    return HttpResponse.json(updateProjectResponseSchema.parse({ ok: true, data: updated }));
  }),

  http.delete("*/projects/:projectId", async ({ params, request }) => {
    const projectId = String(params.projectId ?? "");
    const index = projects.findIndex((item) => item.id === projectId);
    if (index < 0) {
      return HttpResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return HttpResponse.json({ ok: false, error: "Invalid delete payload." }, { status: 400 });
    }

    const parsed = deleteProjectInputSchema.safeParse(body);
    if (!parsed.success) {
      return HttpResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid delete payload." },
        { status: 400 },
      );
    }

    if (parsed.data.confirmName !== projects[index].name) {
      return HttpResponse.json(
        { ok: false, error: "Project name confirmation does not match." },
        { status: 400 },
      );
    }

    const project = projects[index];
    projects.splice(index, 1);
    recordProjectActivity("project.deleted", project);
    return HttpResponse.json(deleteProjectResponseSchema.parse({ ok: true, data: { id: projectId } }));
  }),
];

export function resetMockData(): void {
  projects = [...seededProjects];
  activityEvents = [...seededActivityEvents];
  sessions.clear();
}
