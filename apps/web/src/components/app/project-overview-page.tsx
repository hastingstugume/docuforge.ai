"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  Clock3,
  FileText,
  FolderClosed,
  History,
  Pencil,
  Play,
} from "lucide-react";
import { useProject } from "@/lib/api/projects";

export function ProjectOverviewPage({ projectId }: { projectId: string }) {
  const { data: project, isLoading, isError, error } = useProject(projectId);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="h-20 animate-pulse rounded-xl border border-[#E3E8F1] bg-white" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-24 animate-pulse rounded-lg border border-[#E3E8F1] bg-white" />
          <div className="h-24 animate-pulse rounded-lg border border-[#E3E8F1] bg-white" />
          <div className="h-24 animate-pulse rounded-lg border border-[#E3E8F1] bg-white" />
          <div className="h-24 animate-pulse rounded-lg border border-[#E3E8F1] bg-white" />
        </div>
      </section>
    );
  }

  if (isError || !project) {
    return (
      <section className="rounded-xl border border-[#F2CFD3] bg-white p-6">
        <p className="text-[16px] font-semibold text-[#8A2C38]">Project unavailable</p>
        <p className="mt-1 text-[13px] text-[#9A5360]">
          {error instanceof Error ? error.message : "This project was not found."}
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex h-9 items-center rounded-md border border-[#DCE3EE] px-3 text-[13px] font-semibold text-[#55617A] hover:bg-[#F5F8FD]"
        >
          Back to Projects
        </Link>
      </section>
    );
  }

  const contextCompletion = getContextCompletion(project.status);
  const activeDrafts = Math.max(1, Math.min(9, Math.round(project.docsCount / 3)));
  const health = Math.max(50, Math.min(96, contextCompletion + 8));

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-[#E3E8F1] bg-white">
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
          <div>
            <p className="inline-flex rounded bg-[#EEF4FF] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#2F68E8]">
              {toTypeLabel(project.type)}
            </p>
            <h1 className="mt-2 text-[36px] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#1D2637]">
              {project.name}
            </h1>
            <p className="mt-2 max-w-[780px] text-[15px] text-[#68758E]">{project.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#D8DFEB] bg-white px-3 text-[13px] font-semibold text-[#4E5B74] hover:bg-[#F6F9FE]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Project
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2F68E8] px-3 text-[13px] font-semibold text-white hover:bg-[#285ad0]"
            >
              <Play className="h-3.5 w-3.5" />
              Generate Docs
            </button>
          </div>
        </div>

        <div className="border-t border-[#E7EDF6] px-5">
          <div className="flex h-11 items-center gap-5 text-[13px]">
            <span className="relative inline-flex h-full items-center font-semibold text-[#2F68E8]">
              Overview
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded bg-[#2F68E8]" />
            </span>
            <span className="text-[#69758D]">Context Wizard</span>
            <span className="text-[#69758D]">Documents</span>
            <span className="text-[#69758D]">Jobs & Runs</span>
            <span className="text-[#69758D]">Exports</span>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} label="Documents Generated" value={String(project.docsCount)} sub="+3 in the last week" />
        <StatCard icon={Clock3} label="Last Generation" value={formatRelativeTime(project.updatedAt)} sub="v1.2.4 Deployment Spec" />
        <StatCard icon={History} label="Active Drafts" value={String(activeDrafts)} sub="Pending stakeholder review" />
        <StatCard icon={FolderClosed} label="Context Health" value={`${health}%`} sub="Ready for high-fidelity generation" />
      </section>

      <section className="grid gap-3 xl:grid-cols-[1.65fr_1fr]">
        <article className="rounded-xl border border-[#E3E8F1] bg-white">
          <div className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#2F68E8]">Configuration Required</p>
            <h2 className="mt-1 text-[29px] font-extrabold tracking-[-0.02em] text-[#1E2738]">Complete Project Context</h2>
            <p className="mt-1 text-[14px] text-[#69768E]">
              Your technical context is currently at {contextCompletion}%. Adding architecture and deployment details
              will improve document quality.
            </p>
            <div className="mt-4 flex items-center justify-between text-[12px] font-semibold text-[#53627D]">
              <span>Context Completion</span>
              <span>{contextCompletion}%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E6EDFA]">
              <span className="block h-full rounded-full bg-[#2F68E8]" style={{ width: `${contextCompletion}%` }} />
            </div>
            <button
              type="button"
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2F68E8] px-3 text-[13px] font-semibold text-white hover:bg-[#285ad0]"
            >
              Resume Context Wizard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-[#E3E8F1] bg-white p-5">
          <h3 className="text-[22px] font-extrabold tracking-[-0.01em] text-[#1E2738]">Project Metadata</h3>
          <dl className="mt-3 space-y-2 text-[13px]">
            <div className="flex justify-between gap-2">
              <dt className="text-[#7A879D]">Project Lead</dt>
              <dd className="font-semibold text-[#3D4962]">Marcus Aurelius</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[#7A879D]">Status</dt>
              <dd className="font-semibold text-[#3D4962]">{project.status}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[#7A879D]">Created</dt>
              <dd className="font-semibold text-[#3D4962]">{formatDate(project.createdAt)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[#7A879D]">Updated</dt>
              <dd className="font-semibold text-[#3D4962]">{formatDate(project.updatedAt)}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="rounded-xl border border-[#E3E8F1] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[24px] font-extrabold tracking-[-0.01em] text-[#1E2738]">Recent Documents</h3>
            <p className="text-[13px] text-[#6D7991]">Latest generated content in this project.</p>
          </div>
          <Link href="/documents" className="text-[13px] font-semibold text-[#2F68E8] hover:underline">
            View all
          </Link>
        </div>

        <ul className="mt-4 divide-y divide-[#EDF2F8]">
          {buildRecentDocuments(project.name).map((item) => (
            <li key={item.title} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#E1E8F4] text-[#6D7B96]">
                  <FileText className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-[#2C364D]">{item.title}</p>
                  <p className="text-[12px] text-[#8190A8]">{item.meta}</p>
                </div>
              </div>
              <span className="rounded bg-[#EEF2F8] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#6B7A95]">
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <article className="rounded-lg border border-[#E3E8F1] bg-white p-4">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#EEF4FF] text-[#2F68E8]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="mt-2 text-[12px] font-semibold text-[#73809A]">{label}</p>
      <p className="mt-1 text-[28px] font-extrabold leading-none tracking-[-0.02em] text-[#1F283A]">{value}</p>
      <p className="mt-1 text-[11px] text-[#8A97AB]">{sub}</p>
    </article>
  );
}

function toTypeLabel(type: string): string {
  switch (type) {
    case "api":
      return "SaaS Platform";
    case "dashboard":
      return "Cloud Monitoring";
    case "infrastructure":
      return "Core Infrastructure";
    case "finance":
      return "Finance Platform";
    case "compliance":
      return "Compliance Program";
    case "migration":
      return "Migration Program";
    default:
      return "Technical Program";
  }
}

function getContextCompletion(status: string): number {
  if (status === "active") {
    return 82;
  }
  if (status === "draft") {
    return 64;
  }
  return 55;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(isoDate: string): string {
  const value = new Date(isoDate).getTime();
  if (Number.isNaN(value)) {
    return "Unknown";
  }

  const delta = Date.now() - value;
  const hour = 1000 * 60 * 60;
  const day = hour * 24;

  if (delta < day) {
    const hours = Math.max(1, Math.floor(delta / hour));
    return `${hours}h ago`;
  }

  const days = Math.max(1, Math.floor(delta / day));
  return `${days}d ago`;
}

function buildRecentDocuments(projectName: string) {
  return [
    {
      title: `${projectName}: Architecture Decision Record`,
      meta: "ADR • Modified 2 hours ago",
      status: "Final",
    },
    {
      title: `${projectName}: API Specification`,
      meta: "Technical Spec • Modified 5 hours ago",
      status: "Review",
    },
    {
      title: `${projectName}: Integration Flow`,
      meta: "Diagram Docs • Modified yesterday",
      status: "Draft",
    },
  ];
}
