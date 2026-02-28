# DocuForge (Monorepo)

## Structure
- `apps/web` — Next.js frontend
- `apps/api` — NestJS backend
- `packages/shared` — shared types/schemas
- `packages/promptpacks` — versioned prompt packs (backend)

## Prereqs
- Node.js 20+
- pnpm 9+

## Install
```bash
pnpm install
```

## Dev
```bash
pnpm dev
# or
pnpm dev:web
pnpm dev:api
```

Frontend data source:
- `apps/web` uses the real API by default (`apps/api` on port `4000`).
- Browser MSW mocks are opt-in only via `NEXT_PUBLIC_API_MOCKING=enabled`.

## Env
Copy `.env.example` to `.env` at repo root and adjust as needed.
