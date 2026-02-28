"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
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
import type { Project } from "@docuforge/shared";
import { useCreateProject, useProjects } from "@/lib/api/projects";

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

const iconCycle: LucideIcon[] = [FilePlus2, FilePlus2, Folder, FileText, ShieldCheck, Archive];
const toneCycle = ["orange", "blue", "indigo", "slate", "green", "violet"] as const;

export function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: projects = [], isLoading, isError, error } = useProjects();
  const createProjectMutation = useCreateProject();

  const filteredProjects = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
      return projects;
    }
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(normalized) ||
        project.description.toLowerCase().includes(normalized),
    );
  }, [projects, searchTerm]);

  const visibleProjects = filteredProjects.slice(0, 6);
  const totalProjects = projects.length;

  function handleCreateProject() {
    const nextProjectNumber = totalProjects + 1;
    createProjectMutation.mutate({
      name: `New Project ${nextProjectNumber}`,
      description: "Start a fresh documentation context for new documentation assets.",
    });
  }

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
                {totalProjects} Total
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
              onClick={handleCreateProject}
              disabled={createProjectMutation.isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2F68E8] px-3 text-[13px] font-semibold text-white transition hover:bg-[#275ad0] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus className="h-4 w-4" />
              {createProjectMutation.isPending ? "Creating..." : "New Project"}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-[#E2E8F2] bg-[#F7F9FD] p-2">
          <label className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#97A2B6]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Filter projects by name, tags, or technology..."
              className="h-9 w-full rounded-md border border-[#DFE5F0] bg-white pl-9 pr-3 text-[13px] text-[#374359] outline-none placeholder:text-[#9BA7BA] focus:border-[#2F68E8] focus:ring-2 focus:ring-[#2F68E8]/15"
            />
          </label>
          <FilterChip label="Status: All" widthClass="w-[120px]" />
          <FilterChip label="Type: All" widthClass="w-[110px]" />
          <span className="hidden h-5 w-px bg-[#E1E7F1] lg:block" />
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="inline-flex h-9 items-center justify-center rounded-md px-2 text-[13px] font-medium text-[#6C7891] transition hover:bg-[#EFF4FB]"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-lg border-[3px] border-dashed border-[#9CB1D0] bg-[#FBFCFE] p-4">
            <button
              type="button"
              onClick={handleCreateProject}
              disabled={createProjectMutation.isPending}
              className="flex h-full min-h-[164px] w-full flex-col items-center justify-center text-center disabled:opacity-70"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-[#B7C5DD] bg-white text-[#667A9A]">
                <Plus className="h-4 w-4" strokeWidth={3} />
              </span>
              <p className="mt-3 text-[18px] font-bold text-[#313C53]">Create New Project</p>
              <p className="mt-1 text-[13px] text-[#79859D]">Start a fresh documentation context</p>
            </button>
          </article>

          {isLoading ? (
            <>
              <ProjectLoadingCard />
              <ProjectLoadingCard />
            </>
          ) : null}

          {isError ? (
            <article className="rounded-lg border border-[#F2CFD3] bg-[#FFF7F8] p-4">
              <p className="text-[13px] font-semibold text-[#8A2C38]">Unable to load projects.</p>
              <p className="mt-1 text-[12px] text-[#9A5360]">
                {error instanceof Error ? error.message : "Please try again."}
              </p>
            </article>
          ) : null}

          {!isLoading && !isError && visibleProjects.length === 0 ? (
            <article className="rounded-lg border border-[#E3E8F1] bg-white p-4">
              <p className="text-[14px] font-semibold text-[#2C374D]">No projects found</p>
              <p className="mt-1 text-[12px] text-[#6E7890]">
                Try a different filter, or create a new project.
              </p>
            </article>
          ) : null}

          {!isLoading && !isError
            ? visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tone={toneCycle[index % toneCycle.length]}
                  Icon={iconCycle[index % iconCycle.length]}
                />
              ))
            : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E6ECF4] pt-3 text-[12px] text-[#76839A]">
          <p>
            Showing <span className="font-bold text-[#4D5B74]">{visibleProjects.length}</span> of{" "}
            <span className="font-bold text-[#4D5B74]">{totalProjects}</span> projects
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

function ProjectCard({
  project,
  tone,
  Icon,
}: {
  project: Project;
  tone: (typeof toneCycle)[number];
  Icon: LucideIcon;
}) {
  return (
    <article className="rounded-lg border border-[#E3E8F1] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <span
          className={[
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E6ECF6]",
            getToneClasses(tone),
          ].join(" ")}
        >
          <Icon className="h-4 w-4" />
        </span>
        <button
          type="button"
          className="text-[#A1ABBC]"
          aria-label={`Project actions for ${project.name}`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <h2 className="mt-3 text-[16px] font-bold leading-tight text-[#1F283A]">{project.name}</h2>
      <p className="mt-1 min-h-[46px] text-[12px] leading-relaxed text-[#6E7890]">
        {project.description}
      </p>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[#8B96AC]">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3 w-3" />
          {formatRelativeTime(project.updatedAt)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Files className="h-3 w-3" />
          {project.docsCount} Docs
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
        <Link href="/dashboard" className="text-[12px] font-semibold text-[#2F68E8] hover:underline">
          View Project
        </Link>
      </div>
    </article>
  );
}

function ProjectLoadingCard() {
  return (
    <article className="rounded-lg border border-[#E3E8F1] bg-white p-4">
      <div className="h-8 w-8 animate-pulse rounded-md bg-[#EFF3F9]" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-[#EEF3FA]" />
      <div className="mt-2 h-3 w-full animate-pulse rounded bg-[#F3F6FB]" />
      <div className="mt-1 h-3 w-5/6 animate-pulse rounded bg-[#F3F6FB]" />
      <div className="mt-4 h-3 w-1/2 animate-pulse rounded bg-[#F0F4FA]" />
    </article>
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

function formatRelativeTime(isoDate: string): string {
  const time = new Date(isoDate).getTime();
  if (Number.isNaN(time)) {
    return "recently";
  }

  const deltaMs = Date.now() - time;
  const minute = 60_000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  if (deltaMs < hour) {
    const minutes = Math.max(1, Math.floor(deltaMs / minute));
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  if (deltaMs < day) {
    const hours = Math.max(1, Math.floor(deltaMs / hour));
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (deltaMs < week) {
    const days = Math.max(1, Math.floor(deltaMs / day));
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  const weeks = Math.max(1, Math.floor(deltaMs / week));
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
}
