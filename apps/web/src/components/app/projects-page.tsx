"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  CircleAlert,
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
  Trash2,
  ChevronDown,
} from "lucide-react";
import type { ActivityEvent, Project, ProjectStatus, ProjectType } from "@docuforge/shared";
import { useActivityEvents } from "@/lib/api/activity";
import { useDeleteProject, useProjects } from "@/lib/api/projects";

const iconCycle: LucideIcon[] = [FilePlus2, FilePlus2, Folder, FileText, ShieldCheck, Archive];
const toneCycle = ["orange", "blue", "indigo", "slate", "green", "violet"] as const;
const statusOptions: Array<{ label: string; value: ProjectStatus | "all" }> = [
  { label: "Status: All", value: "all" },
  { label: "Status: Active", value: "active" },
  { label: "Status: Draft", value: "draft" },
  { label: "Status: Archived", value: "archived" },
];
const typeOptions: Array<{ label: string; value: ProjectType | "all" }> = [
  { label: "Type: All", value: "all" },
  { label: "Type: API", value: "api" },
  { label: "Type: Dashboard", value: "dashboard" },
  { label: "Type: Infrastructure", value: "infrastructure" },
  { label: "Type: Finance", value: "finance" },
  { label: "Type: Compliance", value: "compliance" },
  { label: "Type: Migration", value: "migration" },
  { label: "Type: General", value: "general" },
];
const EMPTY_PROJECTS: Project[] = [];

export function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ProjectType | "all">("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteTargetProject, setDeleteTargetProject] = useState<Project | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const pageSize = 6;
  const deleteProjectMutation = useDeleteProject();
  const deferredSearchTerm = useDeferredValue(searchTerm.trim());

  const projectsQuery = useMemo(
    () => ({
      search: deferredSearchTerm || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      type: typeFilter === "all" ? undefined : typeFilter,
      page,
      pageSize,
      sortBy: "updatedAt" as const,
      sortOrder: "desc" as const,
    }),
    [deferredSearchTerm, page, statusFilter, typeFilter],
  );

  const { data: projectsResponse, isLoading, isError, error } = useProjects(projectsQuery);
  const projects = projectsResponse?.data ?? EMPTY_PROJECTS;
  const meta = projectsResponse?.meta;
  const {
    data: recentActivity = [],
    isLoading: isRecentActivityLoading,
    isError: isRecentActivityError,
  } = useActivityEvents({ limit: 3 });

  const quickDocs = useMemo(() => {
    return [...projects]
      .filter((project) => project.docsCount > 0)
      .sort((left, right) => right.docsCount - left.docsCount)
      .slice(0, 3);
  }, [projects]);

  const visibleProjects = projects;
  const totalProjects = meta?.total ?? projects.length;
  const currentPage = meta?.page ?? page;
  const totalPages = meta?.totalPages ?? (totalProjects > 0 ? 1 : 0);

  const statusOption = statusOptions.find((item) => item.value === statusFilter) ?? statusOptions[0];
  const typeOption = typeOptions.find((item) => item.value === typeFilter) ?? typeOptions[0];

  const hasActiveFilters = searchTerm.trim().length > 0 || statusFilter !== "all" || typeFilter !== "all";
  const canGoPrevious = currentPage > 1;
  const canGoNext = totalPages > 0 && currentPage < totalPages;

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setPage(1);
  }

  function goToPreviousPage() {
    if (!canGoPrevious) {
      return;
    }
    setPage((previous) => Math.max(1, previous - 1));
  }

  function goToNextPage() {
    if (!canGoNext) {
      return;
    }
    setPage((previous) => previous + 1);
  }

  function handleDeleteProject(project: Project) {
    setDeleteTargetProject(project);
    setDeleteConfirmation("");
    deleteProjectMutation.reset();
  }

  function closeDeleteDialog() {
    if (deleteProjectMutation.isPending) {
      return;
    }
    setDeleteTargetProject(null);
    setDeleteConfirmation("");
    deleteProjectMutation.reset();
  }

  function confirmProjectDelete() {
    if (!deleteTargetProject) {
      return;
    }

    deleteProjectMutation.mutate(
      {
        projectId: deleteTargetProject.id,
        payload: { confirmName: deleteConfirmation.trim() },
      },
      {
        onSuccess: () => {
          setDeleteTargetProject(null);
          setDeleteConfirmation("");
        },
      },
    );
  }

  const isDeleteConfirmationMatch =
    !!deleteTargetProject && deleteConfirmation.trim() === deleteTargetProject.name;

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
                onClick={() => setViewMode("grid")}
                className={[
                  "inline-flex h-7 w-7 items-center justify-center rounded",
                  viewMode === "grid"
                    ? "bg-[#EEF4FF] text-[#2F68E8]"
                    : "text-[#4E5A73] hover:bg-[#F4F7FC]",
                ].join(" ")}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid2x2 className="h-3.5 w-3.5" />
              </button>
              <span className="mx-0.5 h-4 w-px bg-[#E3E8F1]" />
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={[
                  "inline-flex h-7 w-7 items-center justify-center rounded",
                  viewMode === "list"
                    ? "bg-[#EEF4FF] text-[#2F68E8]"
                    : "text-[#8B96AC] hover:bg-[#F4F7FC] hover:text-[#5C6881]",
                ].join(" ")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
            <Link
              href="/dashboard/new"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2F68E8] px-3 text-[13px] font-semibold text-white transition hover:bg-[#275ad0]"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-[#E2E8F2] bg-[#F7F9FD] p-2">
          <label className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#97A2B6]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Filter projects by name, tags, or technology..."
              className="h-9 w-full rounded-md border border-[#DFE5F0] bg-white pl-9 pr-3 text-[13px] text-[#374359] outline-none placeholder:text-[#9BA7BA] focus:border-[#2F68E8] focus:ring-2 focus:ring-[#2F68E8]/15"
            />
          </label>
          <FilterSelect
            label={statusOption.label}
            widthClass="w-[120px]"
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value as ProjectStatus | "all");
              setPage(1);
            }}
            options={statusOptions}
          />
          <FilterSelect
            label={typeOption.label}
            widthClass="w-[132px]"
            value={typeFilter}
            onChange={(value) => {
              setTypeFilter(value as ProjectType | "all");
              setPage(1);
            }}
            options={typeOptions}
          />
          <span className="hidden h-5 w-px bg-[#E1E7F1] lg:block" />
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-9 items-center justify-center rounded-md px-2 text-[13px] font-medium text-[#6C7891] transition hover:bg-[#EFF4FB]"
          >
            Clear Filters
          </button>
        </div>

        <div
          className={[
            "mt-3 gap-3",
            viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3" : "flex flex-col",
          ].join(" ")}
        >
          <article className="rounded-lg border-[3px] border-dashed border-[#9CB1D0] bg-[#FBFCFE] p-4">
            <Link
              href="/dashboard/new"
              className="flex h-full min-h-[164px] w-full flex-col items-center justify-center text-center"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-[#B7C5DD] bg-white text-[#667A9A]">
                <Plus className="h-4 w-4" strokeWidth={3} />
              </span>
              <p className="mt-3 text-[18px] font-bold text-[#313C53]">Create New Project</p>
              <p className="mt-1 text-[13px] text-[#79859D]">Start a fresh documentation context</p>
            </Link>
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
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 inline-flex h-8 items-center rounded-md border border-[#DCE3EE] px-3 text-[12px] font-semibold text-[#5B6882] hover:bg-[#F5F8FD]"
                >
                  Reset Filters
                </button>
              ) : null}
            </article>
          ) : null}

          {!isLoading && !isError
            ? visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tone={getProjectTone(project, index)}
                  Icon={getProjectIcon(project, index)}
                  onDelete={() => handleDeleteProject(project)}
                  isDeleting={
                    deleteProjectMutation.isPending &&
                    deleteProjectMutation.variables?.projectId === project.id
                  }
                />
              ))
            : null}
        </div>

        {deleteProjectMutation.isError ? (
          <p className="mt-2 text-[12px] text-[#B13C49]">
            {deleteProjectMutation.error instanceof Error
              ? deleteProjectMutation.error.message
              : "Unable to delete project."}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E6ECF4] pt-3 text-[12px] text-[#76839A]">
          <p>
            Showing <span className="font-bold text-[#4D5B74]">{visibleProjects.length}</span> of{" "}
            <span className="font-bold text-[#4D5B74]">{totalProjects}</span> projects
          </p>
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={!canGoPrevious}
              className="h-7 rounded-md border border-[#DCE3EE] px-2 text-[#95A0B4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </button>
            <button type="button" className="h-7 rounded-md bg-[#2F68E8] px-2 text-white">
              {currentPage}
            </button>
            <button
              type="button"
              onClick={goToNextPage}
              disabled={!canGoNext}
              className="h-7 rounded-md border border-[#DCE3EE] px-2 text-[#6C7890] disabled:cursor-not-allowed disabled:opacity-60"
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
          {isRecentActivityLoading ? (
            <p className="mt-3 text-[13px] text-[#7E8AA1]">Loading activity...</p>
          ) : null}
          {!isRecentActivityLoading && !isRecentActivityError && recentActivity.length > 0 ? (
            <ul className="mt-3 space-y-3 text-[13px]">
              {recentActivity.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-2 border-b border-[#EDF1F7] pb-2 last:border-0 last:pb-0"
                >
                  <p className="text-[#42506A]">
                    Project <span className="font-semibold text-[#2F68E8]">{item.resourceName}</span> was{" "}
                    <span className="font-semibold">{toActivityActionLabel(item.action)}</span>.
                  </p>
                  <span className="shrink-0 text-[#97A2B6]">{formatRelativeTime(item.occurredAt)}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {!isRecentActivityLoading && isRecentActivityError ? (
            <p className="mt-3 text-[13px] text-[#7E8AA1]">Unable to load activity.</p>
          ) : null}
          {!isRecentActivityLoading && !isRecentActivityError && recentActivity.length === 0 ? (
            <p className="mt-3 text-[13px] text-[#7E8AA1]">No activity yet.</p>
          ) : null}
          <Link href="/activity" className="mt-3 block text-left text-[12px] font-semibold text-[#2F68E8] hover:underline">
            View All Activity Log
          </Link>
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
          {quickDocs.length > 0 ? (
            <ul className="mt-3 space-y-2 text-[13px] text-[#4B5872]">
              {quickDocs.map((project) => (
                <li key={project.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#87A9F5]" />
                  <Link href={`/dashboard/${project.id}`} className="hover:text-[#2F68E8] hover:underline">
                    {project.name}
                  </Link>
                  <span className="text-[11px] text-[#95A1B6]">({project.docsCount} docs)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[13px] text-[#7E8AA1]">No docs indexed yet.</p>
          )}
        </article>
      </section>

      {deleteTargetProject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4">
          <div className="w-full max-w-[460px] rounded-xl border border-[#DFE5F0] bg-white p-5 shadow-[0_20px_60px_rgba(17,24,39,0.22)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF2F4] text-[#B13C49]">
                <CircleAlert className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-[18px] font-bold text-[#1F283A]">Delete Project</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[#5E6B84]">
                  This action cannot be undone. Type{" "}
                  <span className="font-semibold text-[#27324A]">{deleteTargetProject.name}</span> to
                  confirm deletion.
                </p>
              </div>
            </div>

            <label className="mt-4 block text-[12px] font-semibold text-[#4A5670]">
              Confirm project name
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                autoFocus
                className="mt-1 h-10 w-full rounded-md border border-[#DCE3EE] px-3 text-[13px] text-[#2E3A52] outline-none placeholder:text-[#9DA8BC] focus:border-[#2F68E8] focus:ring-2 focus:ring-[#2F68E8]/15"
                placeholder={deleteTargetProject.name}
              />
            </label>

            {deleteProjectMutation.isError ? (
              <p className="mt-2 text-[12px] text-[#B13C49]">
                {deleteProjectMutation.error instanceof Error
                  ? deleteProjectMutation.error.message
                  : "Unable to delete project."}
              </p>
            ) : null}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={deleteProjectMutation.isPending}
                className="inline-flex h-9 items-center rounded-md border border-[#DCE3EE] bg-white px-3 text-[13px] font-medium text-[#54627D] hover:bg-[#F5F8FD] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmProjectDelete}
                disabled={!isDeleteConfirmationMatch || deleteProjectMutation.isPending}
                className="inline-flex h-9 items-center rounded-md bg-[#B13C49] px-3 text-[13px] font-semibold text-white hover:bg-[#9F3340] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteProjectMutation.isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}

function ProjectCard({
  project,
  tone,
  Icon,
  onDelete,
  isDeleting,
}: {
  project: Project;
  tone: (typeof toneCycle)[number];
  Icon: LucideIcon;
  onDelete: () => void;
  isDeleting: boolean;
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
        <details className="relative">
          <summary
            className="list-none cursor-pointer rounded p-1 text-[#A1ABBC] hover:bg-[#F2F6FC] [&::-webkit-details-marker]:hidden"
            aria-label={`Project actions for ${project.name}`}
          >
            <MoreVertical className="h-4 w-4" />
          </summary>
          <div className="absolute right-0 top-7 z-10 w-[148px] rounded-md border border-[#DFE5F0] bg-white p-1 shadow-[0_8px_30px_rgba(25,38,62,0.08)]">
            <Link
              href={`/dashboard/${project.id}`}
              className="block rounded px-2 py-1.5 text-[12px] font-medium text-[#3D4A63] hover:bg-[#F4F7FD]"
            >
              Open Project
            </Link>
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              aria-label={`Delete project ${project.name}`}
              className="flex w-full items-center gap-1 rounded px-2 py-1.5 text-left text-[12px] font-medium text-[#A73A46] hover:bg-[#FFF4F6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isDeleting ? "Deleting..." : "Delete Project"}
            </button>
          </div>
        </details>
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
        <Link
          href={`/dashboard/${project.id}`}
          className="text-[12px] font-semibold text-[#2F68E8] hover:underline"
        >
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
  widthClass = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
  widthClass?: string;
}) {
  return (
    <label
      className={`relative inline-flex h-9 items-center rounded-md border border-[#DDE4EF] bg-white px-3 text-[13px] text-[#56627B] ${widthClass}`}
    >
      <span className="pointer-events-none truncate pr-5">{label}</span>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-[#8E9AB0]" />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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

function getProjectTone(project: Project, index: number): (typeof toneCycle)[number] {
  switch (project.type) {
    case "api":
      return "orange";
    case "dashboard":
      return "blue";
    case "infrastructure":
      return "indigo";
    case "finance":
      return "slate";
    case "compliance":
      return "green";
    case "migration":
      return "violet";
    default:
      return toneCycle[index % toneCycle.length];
  }
}

function getProjectIcon(project: Project, index: number): LucideIcon {
  switch (project.type) {
    case "api":
      return FilePlus2;
    case "dashboard":
      return FilePlus2;
    case "infrastructure":
      return Folder;
    case "finance":
      return FileText;
    case "compliance":
      return ShieldCheck;
    case "migration":
      return Archive;
    default:
      return iconCycle[index % iconCycle.length];
  }
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

function toActivityActionLabel(action: ActivityEvent["action"]): string {
  if (action === "project.created") {
    return "created";
  }
  if (action === "project.updated") {
    return "updated";
  }
  return "deleted";
}
