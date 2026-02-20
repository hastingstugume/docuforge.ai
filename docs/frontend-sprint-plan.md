📘 DocuForge Frontend Sprint Plan (4 Weeks)

Tech Stack
	•	Next.js (App Router)
	•	TailwindCSS
	•	shadcn/ui
	•	TanStack Query
	•	React Hook Form + Zod
	•	Zustand (light UI state)
	•	MSW (mock API)
	•	Vitest + RTL
	•	Playwright (E2E)

⸻

🧱 Architecture Rules
	•	All types live in packages/shared
	•	All API calls go through hooks in /lib/api
	•	No direct fetch in components
	•	Every page must have:
	•	Loading state
	•	Empty state
	•	Error state
	•	Small PRs only (1 feature slice per day)

⸻

🗓 WEEK 1 — Foundation

Day 1 — Repo + UI Base
	•	Confirm monorepo working
	•	Install shadcn/ui
	•	Setup Tailwind theme tokens
	•	Add global layout wrapper

Done when:
App runs and basic UI renders.

⸻

Day 2 — Landing Page
	•	Hero
	•	Problem section
	•	Solution section
	•	Docs grid
	•	Pricing
	•	Footer

Test
	•	Playwright: landing loads

⸻

Day 3 — Auth
	•	Login page
	•	Signup page
	•	Form validation (Zod)
	•	Mock auth endpoint

Test
	•	Login → redirect to dashboard

⸻

Day 4 — App Shell
	•	Sidebar
	•	Topbar
	•	Route highlighting
	•	Layout groups (marketing) and (app)

⸻

Day 5 — MSW + API Hooks
	•	Setup MSW
	•	Define shared types:
	•	Project
	•	Context
	•	Document
	•	Job
	•	Export
	•	Implement:
	•	useProjects()
	•	useCreateProject()
	•	useMe()

Test
	•	Dashboard shows seeded projects

⸻

🗓 WEEK 2 — Projects

Day 6 — Dashboard
	•	Project cards grid
	•	Search filter
	•	Empty state
	•	“New Project” CTA

⸻

Day 7 — Create Project
	•	Form
	•	Validation
	•	Redirect to project overview

Test
	•	Create → appears in dashboard

⸻

Day 8 — Project Overview
	•	Header
	•	Summary cards
	•	Tabs:
	•	Context
	•	Documents
	•	Jobs
	•	Exports

⸻

Day 9 — Tab Pages
	•	Context page skeleton
	•	Docs page skeleton
	•	Jobs page skeleton
	•	Exports page skeleton

⸻

Day 10 — Docs List UI
	•	Doc type registry
	•	Docs table
	•	Status badges
	•	Generate pack button placeholder

⸻

🗓 WEEK 3 — Context Wizard + Generation Flow

Day 11 — Wizard Shell
	•	Stepper
	•	Next / Back
	•	Save draft

⸻

Day 12 — Wizard Steps 1–3
	•	Overview
	•	Stakeholders
	•	Features

⸻

Day 13 — Wizard Steps 4–7
	•	Integrations
	•	NFR
	•	Security
	•	Deployment

⸻

Day 14 — Wizard Steps 8–9
	•	Risks
	•	Review summary
	•	Generate CTA

⸻

Day 15 — Generate Docs + Jobs
	•	Doc pack selection
	•	Mock generation jobs
	•	Jobs page
	•	Status transitions

Test
	•	Wizard → Generate → Job completes

⸻

🗓 WEEK 4 — Editor + Versions + Exports

Day 16 — Editor Layout
	•	3-pane layout
	•	Outline
	•	Editor
	•	Context summary
	•	Metadata header

⸻

Day 17 — Editor Engine
	•	TipTap (recommended)
	•	Autosave draft
	•	Unsaved indicator

⸻

Day 18 — Section Regeneration
	•	Select section
	•	Regenerate modal
	•	Update only selected section

⸻

Day 19 — Publish Versions
	•	Publish button
	•	Version timeline
	•	Read-only version view

⸻

Day 20 — Exports
	•	Export actions
	•	Exports table
	•	Download link (mock)

⸻

🧪 Testing Minimum Standard

Every week:
	•	Landing happy path passes
	•	Login → Dashboard passes
	•	Create project flow passes
	•	Wizard → Generate → Editor passes
	•	Publish → Export passes

⸻

🏁 Month-End Definition of Done
	•	Fully navigable product
	•	All flows functional with MSW
	•	Stable editor
	•	Versioning works
	•	Jobs simulation works
	•	Exports UI works
	•	No console errors
	•	Playwright suite green

⸻

🚀 After Frontend Completion

Then backend sprint begins:

Month 1:
	•	Auth
	•	Projects
	•	Context
	•	Documents
	•	Drafts
	•	Versions

Month 2:
	•	Generation engine
	•	Async jobs (BullMQ)
	•	Exports engine
	•	Storage
	•	Integrations