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

function emailLooksValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
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
      sendJson(response, 200, { ok: true, user, token }, origin);
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
      sendJson(response, 200, { ok: true, user, token }, origin);
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
    sendJson(response, 200, { ok: true, user }, origin);
    return;
  }

  sendJson(response, 404, { ok: false, error: "Not found" }, origin);
});

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`[docuforge-api] listening on http://${host}:${port}`);
});
