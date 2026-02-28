import {
  authResponseSchema,
  createProjectInputSchema,
  createProjectResponseSchema,
  listProjectsResponseSchema,
  loginInputSchema,
  meResponseSchema,
  signupInputSchema,
  type Project,
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

function unauthorizedResponse() {
  return HttpResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export const handlers = [
  http.get("*/health", () => {
    return HttpResponse.json({ ok: true, service: "docuforge-mock-api" });
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

  http.get("*/projects", () => {
    return HttpResponse.json(listProjectsResponseSchema.parse({ ok: true, data: projects }));
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

    return HttpResponse.json(createProjectResponseSchema.parse({ ok: true, data: project }));
  }),
];

export function resetMockData(): void {
  projects = [...seededProjects];
  sessions.clear();
}
