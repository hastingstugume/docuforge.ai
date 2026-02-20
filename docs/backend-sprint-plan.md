1) Backend Sprint Plan (NestJS) — 6 to 8 weeks

Backend stack
	•	NestJS + TypeScript
	•	Prisma + PostgreSQL
	•	Swagger/OpenAPI
	•	JWT auth (phase 1) → can swap to Keycloak later
	•	MinIO/S3 for export files (phase 2)
	•	Redis + BullMQ for async jobs (phase 2)

Definition of Done (backend)
	•	Endpoints match frontend MSW routes exactly
	•	All DTOs validated (Zod or class-validator)
	•	Unit tests for services + e2e smoke tests for APIs
	•	Migrations are repeatable and run via job in K8s
	•	Observability basics: request logging + error capture

⸻

Week 1 — Project foundation + Auth + Org

Tasks
	•	NestJS app scaffolding in apps/api
	•	Prisma setup + migrations
	•	Core modules: Auth, Orgs, Users
	•	JWT auth endpoints:
	•	POST /auth/signup
	•	POST /auth/login
	•	GET /me
	•	RBAC skeleton: OWNER/ADMIN/EDITOR/VIEWER

Tests
	•	e2e: signup → login → /me returns profile

DoD
	•	Frontend can authenticate against real backend (swap MSW for auth only)

⸻

Week 2 — Projects CRUD + Access Control

Tasks
	•	Projects module CRUD:
	•	GET /projects
	•	POST /projects
	•	GET /projects/:id
	•	PATCH /projects/:id
	•	Org membership checks (cannot access other org projects)
	•	Pagination + search query params

Tests
	•	e2e: create project → list projects → get project

DoD
	•	Frontend Projects dashboard works with real API

⸻

Week 3 — Context Wizard API

Tasks
	•	Context module:
	•	GET /projects/:id/context
	•	PUT /projects/:id/context
	•	Store context_json + context_summary
	•	Context summarizer (v1 simple):
	•	deterministic summary OR LLM call behind interface (optional)

Tests
	•	e2e: update context → get context returns same

DoD
	•	Frontend Wizard persists data to backend

⸻

Week 4 — Documents + Drafts + Versioning

Tasks
	•	Documents module:
	•	GET /projects/:id/docs
	•	POST /projects/:id/docs (create doc per type)
	•	Drafts module:
	•	GET /docs/:docId/draft
	•	PUT /docs/:docId/draft
	•	Publish versions:
	•	POST /docs/:docId/publish
	•	GET /docs/:docId/versions
	•	GET /versions/:versionId

Tests
	•	e2e: create doc → update draft → publish → versions list

DoD
	•	Editor loads/saves/publishes against backend

⸻

Week 5 — Generation Engine v1 (Sync) + Jobs API

Goal: make generation real (even if synchronous at first)

Tasks
	•	Generation module:
	•	POST /docs/:docId/generate
	•	POST /docs/:docId/regenerate-section
	•	Jobs:
	•	GET /projects/:id/jobs
	•	job record creation + status transitions
	•	PromptPack system (in repo):
	•	packages/promptpacks/srs/v1/*
	•	Guardrails v1:
	•	required headings exist
	•	required tables exist
	•	if missing → retry once with fix prompt

Tests
	•	e2e: generate SRS draft returns populated content
	•	regen section updates only that section

DoD
	•	Frontend “Generate → Editor draft” works with real content

⸻

Week 6 — Exports v1 (MD/PDF/DOCX) + Storage

Tasks
	•	Exports endpoints:
	•	POST /versions/:versionId/exports
	•	GET /projects/:id/exports
	•	GET /exports/:exportId/download (or signed URL)
	•	Storage adapter:
	•	Local in dev
	•	MinIO/S3 in prod
	•	PDF/DOCX generation (choose one):
	•	Markdown → PDF (Puppeteer or a server-side renderer)
	•	Markdown → DOCX (docx library)

Tests
	•	export creates file metadata + downloadable asset

DoD
	•	Exports work end-to-end in dev with MinIO or local storage

⸻

Week 7–8 (Optional but recommended) — Async jobs + worker

Tasks
	•	Redis + BullMQ queue
	•	Worker process (optional apps/worker or separate Nest “worker” mode)
	•	Generation/export moved to background
	•	UI polls jobs endpoints reliably

DoD
	•	Large docs don’t block API; stable production scaling

⸻

2) CI/CD + Kubernetes Deployment Plan

Save as: docs/deploy-plan-kubernetes.md

Production topology (recommended)
	•	docuforge.ai → Next.js web
	•	api.docuforge.ai → NestJS API
	•	Postgres: managed preferred, else StatefulSet + PV/PVC (NFS)
	•	MinIO/S3 for exports
	•	Redis (when async jobs start)

⸻

Containerization strategy

You build two images from the monorepo:
	•	docuforge-web:<tag>
	•	docuforge-api:<tag>

Monorepo just helps building and sharing code; K8s deploys separate images.

⸻

Environments
	•	dev namespace: quick iteration
	•	prod namespace: stable releases

⸻

Helm chart layout (GitOps-friendly)

infra/k8s/helm/docuforge/
  Chart.yaml
  values.yaml
  values-dev.yaml
  values-prod.yaml
  templates/
    web-deployment.yaml
    web-service.yaml
    api-deployment.yaml
    api-service.yaml
    ingressroute-web.yaml
    ingressroute-api.yaml
    secrets.yaml
    configmaps.yaml
    migration-job.yaml
    hpa-web.yaml (optional)
    hpa-api.yaml (optional)


⸻

Critical: DB migrations pattern (safe)

Do NOT rely on “migration on app startup” in multi-replica.

Use a Kubernetes Job per deploy:
	•	Runs prisma migrate deploy
	•	Runs before rolling out API deployment (Helm hook or Argo sync wave)

⸻

CI pipeline (GitHub Actions example logic)

On push to main:
	1.	Install dependencies
	2.	Lint + typecheck + tests
	3.	Build Next.js & API
	4.	Build docker images
	5.	Push to registry (GHCR/DockerHub)
	6.	Update Helm values image tag (GitOps) OR deploy step

⸻

CD (ArgoCD recommended)
	•	ArgoCD watches infra/k8s/helm/docuforge
	•	When image tag changes in values, Argo syncs
	•	Use sync waves:
	1.	secrets/config
	2.	migration job
	3.	api deployment
	4.	web deployment

⸻

Ingress routing (Traefik example)
	•	Host(docuforge.ai) → web service
	•	Host(api.docuforge.ai) → api service
	•	TLS via cert-manager or Traefik ACME

⸻

Secrets/config (baseline)

web
	•	NEXT_PUBLIC_API_BASE_URL=https://api.docuforge.ai

api
	•	DATABASE_URL
	•	JWT_SECRET
	•	LLM_API_KEY
	•	S3_ENDPOINT / MINIO_ENDPOINT
	•	S3_ACCESS_KEY / S3_SECRET_KEY
	•	REDIS_URL (later)

⸻

Scaling rules
	•	Web: stateless, scale on CPU
	•	API: stateless, scale on CPU + memory
	•	Worker: separate deployment (later), scale by queue depth

⸻

Observability minimum
	•	Central logs (even just Loki later)
	•	Error tracking (Sentry) on web + api
	•	Readiness/liveness probes for both
