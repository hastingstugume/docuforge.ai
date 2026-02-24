import Link from "next/link";
import {
  Archive,
  CircleDot,
  Clock3,
  FilePlus2,
  FileText,
  Folder,
  Files,
  Grid2x2,
  List,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";

const projects = [
  {
    name: "Nexus API Gateway",
    description:
      "Internal documentation for the microservices gateway and authentication middleware.",
    age: "2 hours ago",
    docs: "14 Docs",
    status: "active",
    tone: "orange",
    icon: FilePlus2,
  },
  {
    name: "CloudScale Dashboard",
    description: "Technical specs for the multi-cloud monitoring frontend and real-time analytics.",
    age: "5 hours ago",
    docs: "8 Docs",
    status: "active",
    tone: "blue",
    icon: FilePlus2,
  },
  {
    name: "Storage Vault v4",
    description:
      "Infrastructure requirements for the encrypted blob storage and retention policies.",
    age: "1 day ago",
    docs: "22 Docs",
    status: "active",
    tone: "indigo",
    icon: Folder,
  },
  {
    name: "Payment Orchestrator",
    description:
      "Detailed workflows for stripe integration, refund handling, and ledger reconciliation.",
    age: "3 days ago",
    docs: "5 Docs",
    status: "draft",
    tone: "slate",
    icon: FileText,
  },
  {
    name: "Compliance Auditor",
    description:
      "SOX and ISO 27001 compliance tracking system technical requirements and controls.",
    age: "1 week ago",
    docs: "12 Docs",
    status: "active",
    tone: "green",
    icon: ShieldCheck,
  },
  {
    name: "Legacy Migration Docs",
    description: "Archived documentation for the sunsetting mainframe-to-cloud migration project.",
    age: "2 weeks ago",
    docs: "31 Docs",
    status: "archived",
    tone: "violet",
    icon: Archive,
  },
];

const recentActivity = [
  {
    actor: "Sarah K.",
    action: "published new version of",
    target: "Nexus API Gateway",
    time: "12m ago",
  },
  {
    actor: "Mike T.",
    action: "added 4 context features to",
    target: "Payment Orchestrator",
    time: "1h ago",
  },
  {
    actor: "Automation",
    action: "generated PDF export for",
    target: "Compliance Auditor",
    time: "3h ago",
  },
];

const quickDocs = ["Architecture Overview v2", "Security Policy - ISO27k", "Endpoint Definitions"];

export function ProjectsPage() {
  return (
    <div className="flex flex-col gap-5">
      <section>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-[#1D2637]">
                Projects
              </h1>
              <span className="rounded bg-[#F0F4FB] px-1.5 py-0.5 text-[10px] font-semibold text-[#7A879E]">
                12 Total
              </span>
            </div>
            <p className="mt-1 text-[13px] text-[#6D7991]">
              Manage and maintain all your technical documentation projects from one central hub.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 items-center rounded-md border border-[#D9E0EC] bg-white px-1">
              <button
                type="button"
                className="inline-flex h-7 w-7 items-center justify-center rounded text-[#4E5A73]"
                aria-label="Grid view"
              >
                <Grid2x2 className="h-3.5 w-3.5" />
              </button>
              <span className="mx-0.5 h-4 w-px bg-[#E3E8F1]" />
              <button
                type="button"
                className="inline-flex h-7 w-7 items-center justify-center rounded text-[#8B96AC] hover:text-[#5C6881]"
                aria-label="List view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2F68E8] px-3 text-[13px] font-semibold text-white transition hover:bg-[#275ad0]"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-[#E2E8F2] bg-[#F7F9FD] p-2">
          <label className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#97A2B6]" />
            <input
              type="search"
              placeholder="Filter projects by name, tags, or technology..."
              className="h-9 w-full rounded-md border border-[#DFE5F0] bg-white pl-9 pr-3 text-[13px] text-[#374359] outline-none placeholder:text-[#9BA7BA] focus:border-[#2F68E8] focus:ring-2 focus:ring-[#2F68E8]/15"
            />
          </label>
          <FilterChip label="Status: All" widthClass="w-[120px]" />
          <FilterChip label="Type: All" widthClass="w-[110px]" />
          <span className="hidden h-5 w-px bg-[#E1E7F1] lg:block" />
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-md px-2 text-[13px] font-medium text-[#6C7891] transition hover:bg-[#EFF4FB]"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-lg border-[3px] border-dashed border-[#9CB1D0] bg-[#FBFCFE] p-4">
            <div className="flex h-full min-h-[164px] flex-col items-center justify-center text-center">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-[#B7C5DD] bg-white text-[#667A9A]">
                <Plus className="h-4 w-4" strokeWidth={3} />
              </span>
              <p className="mt-3 text-[18px] font-bold text-[#313C53]">Create New Project</p>
              <p className="mt-1 text-[13px] text-[#79859D]">Start a fresh documentation context</p>
            </div>
          </article>

          {projects.map((project) => (
            <article key={project.name} className="rounded-lg border border-[#E3E8F1] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <span
                  className={[
                    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E6ECF6]",
                    getToneClasses(project.tone),
                  ].join(" ")}
                >
                  <project.icon className="h-4 w-4" />
                </span>
                <button
                  type="button"
                  className="text-[#A1ABBC]"
                  aria-label={`Project actions for ${project.name}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <h2 className="mt-3 text-[16px] font-bold leading-tight text-[#1F283A]">
                {project.name}
              </h2>
              <p className="mt-1 min-h-[46px] text-[12px] leading-relaxed text-[#6E7890]">
                {project.description}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-[#8B96AC]">
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3 w-3" />
                  {project.age}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Files className="h-3 w-3" />
                  {project.docs}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={[
                    "rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    getStatusClassName(project.status),
                  ].join(" ")}
                >
                  {project.status}
                </span>
                <Link
                  href="/dashboard"
                  className="text-[12px] font-semibold text-[#2F68E8] hover:underline"
                >
                  View Project
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E6ECF4] pt-3 text-[12px] text-[#76839A]">
          <p>
            Showing <span className="font-bold text-[#4D5B74]">6</span> of{" "}
            <span className="font-bold text-[#4D5B74]">12</span> projects
          </p>
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              className="h-7 rounded-md border border-[#DCE3EE] px-2 text-[#95A0B4]"
            >
              Previous
            </button>
            <button type="button" className="h-7 rounded-md bg-[#2F68E8] px-2 text-white">
              1
            </button>
            <button
              type="button"
              className="h-7 rounded-md border border-[#DCE3EE] px-2 text-[#6C7890]"
            >
              2
            </button>
            <button
              type="button"
              className="h-7 rounded-md border border-[#DCE3EE] px-2 text-[#6C7890]"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 border-t border-[#E6ECF4] pt-3 lg:grid-cols-[1.6fr_1fr]">
        <article className="rounded-lg border border-[#E2E8F2] bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2F68E8]">
              <CircleDot className="h-2.5 w-2.5" />
            </span>
            <p className="text-[12px] font-semibold text-[#6E7A91]">Recent Activity</p>
          </div>
          <ul className="mt-3 space-y-3 text-[13px]">
            {recentActivity.map((item) => (
              <li
                key={`${item.actor}-${item.target}`}
                className="flex items-start justify-between gap-2 border-b border-[#EDF1F7] pb-2 last:border-0 last:pb-0"
              >
                <p className="text-[#42506A]">
                  <span className="font-semibold">{item.actor}</span> {item.action}{" "}
                  <span className="font-semibold text-[#2F68E8]">{item.target}</span>
                </p>
                <span className="shrink-0 text-[#97A2B6]">{item.time}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-3 block text-left text-[12px] font-semibold text-[#2F68E8] hover:underline"
          >
            View All Activity Log
          </button>
        </article>

        <article className="rounded-lg border border-[#E2E8F2] bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2F68E8]">
              <CircleDot className="h-2.5 w-2.5" />
            </span>
            <p className="text-[12px] font-semibold text-[#6E7A91]">Quick Docs</p>
          </div>
          <p className="mt-1 text-[12px] text-[#8A96AB]">
            Frequently accessed technical specifications
          </p>
          <ul className="mt-3 space-y-2 text-[13px] text-[#4B5872]">
            {quickDocs.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#87A9F5]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F2] pt-3 text-[12px] text-[#7B879D]">
        <p>© 2024 DocuForge AI. All rights reserved.</p>
        <div className="flex gap-5">
          <p>Status</p>
          <p>Documentation</p>
          <p>Support</p>
          <p>Terms</p>
        </div>
      </footer>
    </div>
  );
}

function FilterChip({ label, widthClass = "" }: { label: string; widthClass?: string }) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center justify-between rounded-md border border-[#DDE4EF] bg-white px-3 text-[13px] text-[#56627B] ${widthClass}`}
    >
      <span>{label}</span>
      <Plus className="ml-2 h-3 w-3 text-[#8E9AB0]" />
    </button>
  );
}

function getToneClasses(tone: string): string {
  switch (tone) {
    case "orange":
      return "bg-[#FFF5EA] text-[#E58A2E]";
    case "blue":
      return "bg-[#EEF4FF] text-[#4B79E8]";
    case "green":
      return "bg-[#ECFAEF] text-[#4FA868]";
    case "violet":
      return "bg-[#F4EEFF] text-[#8669D9]";
    case "indigo":
      return "bg-[#EEF1FF] text-[#6277DF]";
    default:
      return "bg-[#F2F5FA] text-[#74849C]";
  }
}

function getStatusClassName(status: string): string {
  if (status === "active") {
    return "bg-[#EFF3F9] text-[#66748F]";
  }

  if (status === "draft") {
    return "bg-[#F4F6FA] text-[#8A95AB]";
  }

  return "bg-[#EEF1F6] text-[#93A0B5]";
}
