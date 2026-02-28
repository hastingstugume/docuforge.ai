import { randomBytes, randomUUID } from "node:crypto";
import { createServer } from "node:http";

const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 4000);
const allowedOrigins = new Set(
  (process.env.CORS_ORIGIN ?? "http://127.0.0.1:3000,http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const sessions = new Map();
const projects = [];
const defaultOwnerId = "system-owner";

const projectTypes = new Set([
  "api",
  "dashboard",
  "infrastructure",
  "finance",
  "compliance",
  "migration",
  "general",
]);
const projectStatuses = new Set(["active", "draft", "archived"]);

function emailLooksValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidIsoDate(value) {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

function toUserResponse(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  };
}

function parseProjectInput(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const type = typeof body.type === "string" ? body.type : "general";

  if (name.length < 2) {
    return { ok: false, error: "Project name must be at least 2 characters." };
  }

  if (description.length < 5) {
    return { ok: false, error: "Project description must be at least 5 characters." };
  }

  if (!projectTypes.has(type)) {
    return { ok: false, error: "Invalid project type." };
  }

  return { ok: true, data: { name, description, type } };
}

function parseProjectPatchInput(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Invalid project payload." };
  }

  const data = {};

  if (Object.hasOwn(body, "name")) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (name.length < 2) {
      return { ok: false, error: "Project name must be at least 2 characters." };
    }
    data.name = name;
  }

  if (Object.hasOwn(body, "description")) {
    const description = typeof body.description === "string" ? body.description.trim() : "";
    if (description.length < 5) {
      return { ok: false, error: "Project description must be at least 5 characters." };
    }
    data.description = description;
  }

  if (Object.hasOwn(body, "status")) {
    if (typeof body.status !== "string" || !projectStatuses.has(body.status)) {
      return { ok: false, error: "Invalid project status." };
    }
    data.status = body.status;
  }

  if (Object.hasOwn(body, "type")) {
    if (typeof body.type !== "string" || !projectTypes.has(body.type)) {
      return { ok: false, error: "Invalid project type." };
    }
    data.type = body.type;
  }

  if (Object.hasOwn(body, "docsCount")) {
    if (!Number.isInteger(body.docsCount) || body.docsCount < 0) {
      return { ok: false, error: "docsCount must be a non-negative integer." };
    }
    data.docsCount = body.docsCount;
  }

  if (Object.keys(data).length === 0) {
    return { ok: false, error: "Provide at least one field to update." };
  }

  return { ok: true, data };
}

function validateProject(project) {
  return (
    project &&
    typeof project.id === "string" &&
    typeof project.name === "string" &&
    typeof project.description === "string" &&
    projectStatuses.has(project.status) &&
    projectTypes.has(project.type) &&
    Number.isInteger(project.docsCount) &&
    project.docsCount >= 0 &&
    isValidIsoDate(project.updatedAt) &&
    isValidIsoDate(project.createdAt) &&
    typeof project.ownerId === "string"
  );
}

function parsePositiveInteger(value, fallback) {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function getProjectIdFromPath(pathname) {
  const raw = pathname.replace(/^\/projects\//, "");
  return raw ? decodeURIComponent(raw) : "";
}

function getSessionUserId(request) {
  const token = parseBearerToken(request.headers.authorization);
  if (!token || !sessions.has(token)) {
    return defaultOwnerId;
  }
  return sessions.get(token).id;
}

function isAllowedLanOrigin(origin) {
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const match = /^192\.168\.1\.(\d{1,3})$/.exec(parsed.hostname);
    if (!match) {
      return false;
    }

    const lastOctet = Number(match[1]);
    return Number.isInteger(lastOctet) && lastOctet >= 1 && lastOctet <= 100;
  } catch {
    return false;
  }
}

function getCorsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Headers": "content-type, authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    Vary: "Origin",
  };

  if (origin && (allowedOrigins.has(origin) || isAllowedLanOrigin(origin))) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function sendJson(response, statusCode, payload, origin) {
  const body = JSON.stringify(payload);
  const headers = getCorsHeaders(origin);
  response.writeHead(statusCode, {
    ...headers,
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON body.");
  }
}

function parseBearerToken(authorizationHeader) {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  const method = request.method ?? "GET";
  const url = new URL(request.url ?? "/", `http://${host}:${port}`);
  const pathname = url.pathname;

  if (method === "OPTIONS") {
    response.writeHead(204, getCorsHeaders(origin));
    response.end();
    return;
  }

  if (method === "GET" && pathname === "/health") {
    sendJson(response, 200, { ok: true, service: "docuforge-api" }, origin);
    return;
  }

  if (method === "POST" && pathname === "/auth/login") {
    try {
      const body = await readJsonBody(request);
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const password = typeof body.password === "string" ? body.password : "";

      if (!emailLooksValid(email)) {
        sendJson(response, 400, { ok: false, error: "Enter a valid email address." }, origin);
        return;
      }

      if (password.length < 8) {
        sendJson(
          response,
          400,
          { ok: false, error: "Password must be at least 8 characters." },
          origin,
        );
        return;
      }

      const token = randomBytes(24).toString("hex");
      const user = {
        id: randomUUID(),
        fullName: "DocuForge User",
        email,
      };

      sessions.set(token, user);
      sendJson(response, 200, { ok: true, user: toUserResponse(user), token }, origin);
      return;
    } catch {
      sendJson(response, 400, { ok: false, error: "Invalid login payload" }, origin);
      return;
    }
  }

  if (method === "POST" && pathname === "/auth/signup") {
    try {
      const body = await readJsonBody(request);
      const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const password = typeof body.password === "string" ? body.password : "";

      if (fullName.length < 2) {
        sendJson(
          response,
          400,
          { ok: false, error: "Full name must be at least 2 characters." },
          origin,
        );
        return;
      }

      if (!emailLooksValid(email)) {
        sendJson(response, 400, { ok: false, error: "Enter a valid email address." }, origin);
        return;
      }

      if (password.length < 8) {
        sendJson(
          response,
          400,
          { ok: false, error: "Password must be at least 8 characters." },
          origin,
        );
        return;
      }

      const token = randomBytes(24).toString("hex");
      const user = {
        id: randomUUID(),
        fullName,
        email,
      };

      sessions.set(token, user);
      sendJson(response, 200, { ok: true, user: toUserResponse(user), token }, origin);
      return;
    } catch {
      sendJson(response, 400, { ok: false, error: "Invalid signup payload" }, origin);
      return;
    }
  }

  if (method === "GET" && pathname === "/me") {
    const token = parseBearerToken(request.headers.authorization);
    if (!token || !sessions.has(token)) {
      sendJson(response, 401, { ok: false, error: "Unauthorized" }, origin);
      return;
    }

    const user = sessions.get(token);
    sendJson(response, 200, { ok: true, data: toUserResponse(user) }, origin);
    return;
  }

  if (method === "GET" && pathname === "/projects") {
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");
    const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";
    const page = parsePositiveInteger(url.searchParams.get("page"), 1);
    const pageSize = parsePositiveInteger(url.searchParams.get("pageSize"), 20);
    const sortBy = url.searchParams.get("sortBy") ?? "updatedAt";
    const sortOrder = url.searchParams.get("sortOrder") ?? "desc";

    if (status && !projectStatuses.has(status)) {
      sendJson(response, 400, { ok: false, error: "Invalid status query." }, origin);
      return;
    }

    if (type && !projectTypes.has(type)) {
      sendJson(response, 400, { ok: false, error: "Invalid type query." }, origin);
      return;
    }

    if (page === null || pageSize === null || pageSize > 100) {
      sendJson(response, 400, { ok: false, error: "Invalid pagination query." }, origin);
      return;
    }

    if (!["updatedAt", "createdAt", "name"].includes(sortBy)) {
      sendJson(response, 400, { ok: false, error: "Invalid sortBy query." }, origin);
      return;
    }

    if (sortOrder !== "asc" && sortOrder !== "desc") {
      sendJson(response, 400, { ok: false, error: "Invalid sortOrder query." }, origin);
      return;
    }

    const filtered = projects
      .filter(validateProject)
      .filter((project) => (status ? project.status === status : true))
      .filter((project) => (type ? project.type === type : true))
      .filter((project) =>
        search
          ? project.name.toLowerCase().includes(search) ||
            project.description.toLowerCase().includes(search)
          : true,
      )
      .sort((a, b) => {
        let left;
        let right;
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

    sendJson(
      response,
      200,
      {
        ok: true,
        data,
        meta: { total, page, pageSize, totalPages },
      },
      origin,
    );
    return;
  }

  if (method === "GET" && pathname.startsWith("/projects/")) {
    const projectId = getProjectIdFromPath(pathname);
    const project = projects.find((item) => item.id === projectId && validateProject(item));

    if (!project) {
      sendJson(response, 404, { ok: false, error: "Project not found." }, origin);
      return;
    }

    sendJson(response, 200, { ok: true, data: project }, origin);
    return;
  }

  if (method === "POST" && pathname === "/projects") {
    try {
      const body = await readJsonBody(request);
      const parsed = parseProjectInput(body);

      if (!parsed.ok) {
        sendJson(response, 400, { ok: false, error: parsed.error }, origin);
        return;
      }

      const now = new Date().toISOString();
      const project = {
        id: randomUUID(),
        name: parsed.data.name,
        description: parsed.data.description,
        status: "draft",
        type: parsed.data.type,
        docsCount: 0,
        updatedAt: now,
        createdAt: now,
        ownerId: getSessionUserId(request),
      };

      projects.unshift(project);
      sendJson(response, 200, { ok: true, data: project }, origin);
      return;
    } catch {
      sendJson(response, 400, { ok: false, error: "Invalid project payload" }, origin);
      return;
    }
  }

  if (method === "PATCH" && pathname.startsWith("/projects/")) {
    try {
      const projectId = getProjectIdFromPath(pathname);
      const index = projects.findIndex((item) => item.id === projectId && validateProject(item));
      if (index < 0) {
        sendJson(response, 404, { ok: false, error: "Project not found." }, origin);
        return;
      }

      const body = await readJsonBody(request);
      const parsed = parseProjectPatchInput(body);
      if (!parsed.ok) {
        sendJson(response, 400, { ok: false, error: parsed.error }, origin);
        return;
      }

      const updated = {
        ...projects[index],
        ...parsed.data,
        updatedAt: new Date().toISOString(),
      };

      if (!validateProject(updated)) {
        sendJson(response, 400, { ok: false, error: "Invalid project payload." }, origin);
        return;
      }

      projects[index] = updated;
      sendJson(response, 200, { ok: true, data: updated }, origin);
      return;
    } catch {
      sendJson(response, 400, { ok: false, error: "Invalid project payload" }, origin);
      return;
    }
  }

  if (method === "DELETE" && pathname.startsWith("/projects/")) {
    const projectId = getProjectIdFromPath(pathname);
    const index = projects.findIndex((item) => item.id === projectId && validateProject(item));
    if (index < 0) {
      sendJson(response, 404, { ok: false, error: "Project not found." }, origin);
      return;
    }

    projects.splice(index, 1);
    sendJson(response, 200, { ok: true, data: { id: projectId } }, origin);
    return;
  }

  sendJson(response, 404, { ok: false, error: "Not found" }, origin);
});

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`[docuforge-api] listening on http://${host}:${port}`);
});
