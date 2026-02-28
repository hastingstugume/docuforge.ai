"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { DocumentStatus } from "@docuforge/shared";
import { ChevronDown, Download, FileText, Search } from "lucide-react";
import { useDocuments } from "@/lib/api/documents";

const statusOptions: Array<{ label: string; value: DocumentStatus | "all" }> = [
  { label: "All Status", value: "all" },
  { label: "Published", value: "published" },
  { label: "Review", value: "review" },
  { label: "Draft", value: "draft" },
];

const sortOptions: Array<{ label: string; value: "updatedAt" | "title" }> = [
  { label: "Last Edited", value: "updatedAt" },
  { label: "Title", value: "title" },
];

export function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"updatedAt" | "title">("updatedAt");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const deferredSearch = useDeferredValue(searchTerm.trim());

  const query = useMemo(
    () => ({
      search: deferredSearch || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      pageSize,
      sortBy,
      sortOrder: "desc" as const,
    }),
    [deferredSearch, page, sortBy, statusFilter],
  );

  const { data: documentsResponse, isLoading, isError, error } = useDocuments(query);
  const documents = documentsResponse?.data ?? [];
  const meta = documentsResponse?.meta;
  const totalDocuments = meta?.total ?? documents.length;
  const currentPage = meta?.page ?? page;
  const totalPages = meta?.totalPages ?? (totalDocuments > 0 ? 1 : 0);
  const hasActiveFilters = searchTerm.trim().length > 0 || statusFilter !== "all";
  const canGoPrevious = currentPage > 1;
  const canGoNext = totalPages > 0 && currentPage < totalPages;

  const statusOption = statusOptions.find((item) => item.value === statusFilter) ?? statusOptions[0];

  const showingStart = totalDocuments === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingEnd = totalDocuments === 0 ? 0 : Math.min(currentPage * pageSize, totalDocuments);

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("updatedAt");
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

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#E0E5EF] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[34px] font-black tracking-[-0.02em] text-[#1E2638]">Documents</h1>
            <p className="mt-1 text-sm text-[#6B7790]">
              Manage and organize all technical documentation assets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1 rounded-md border border-[#D9E0EC] bg-white px-3 text-sm font-semibold text-[#4D5972]"
            >
              <Download className="h-4 w-4" />
              Export All
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1 rounded-md bg-[#2F68E8] px-3 text-sm font-semibold text-white transition hover:bg-[#275ad0]"
            >
              + New Document
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 rounded-lg border border-[#E3E8F1] bg-[#F8FAFD] p-2 xl:grid-cols-[1.7fr_auto_auto_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#97A2B6]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Search by title, summary, or content..."
              className="h-9 w-full rounded-md border border-[#DFE5F0] bg-white pl-9 pr-3 text-[13px] text-[#374359] outline-none placeholder:text-[#9BA7BA]"
            />
          </label>
          <FilterChip label="All Types" />
          <FilterSelect
            label={statusOption.label}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value as DocumentStatus | "all");
              setPage(1);
            }}
            options={statusOptions}
          />
          <FilterSelect
            label={sortOptions.find((item) => item.value === sortBy)?.label ?? "Last Edited"}
            value={sortBy}
            onChange={(value) => {
              setSortBy(value as "updatedAt" | "title");
              setPage(1);
            }}
            options={sortOptions}
          />
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="h-9 rounded-md px-2 text-[13px] font-medium text-[#6C7891] transition hover:bg-[#F0F4FB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-[#E0E6F0]">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-[#F7F9FC] text-[12px] font-semibold text-[#6A768E]">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" aria-label="Select all documents" />
                </th>
                <th className="px-2 py-3">Document Title</th>
                <th className="px-2 py-3">Summary</th>
                <th className="px-2 py-3">Status</th>
                <th className="px-2 py-3">Version</th>
                <th className="px-2 py-3">Last Edited</th>
                <th className="px-2 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {isLoading ? (
                <tr className="border-t border-[#E8EDF5]">
                  <td colSpan={7} className="px-4 py-8 text-center text-[#7A869F]">
                    Loading documents...
                  </td>
                </tr>
              ) : null}

              {isError ? (
                <tr className="border-t border-[#F2CFD3] bg-[#FFF7F8]">
                  <td colSpan={7} className="px-4 py-8 text-center text-[#8A2C38]">
                    {error instanceof Error ? error.message : "Unable to load documents."}
                  </td>
                </tr>
              ) : null}

              {!isLoading && !isError && documents.length === 0 ? (
                <tr className="border-t border-[#E8EDF5]">
                  <td colSpan={7} className="px-4 py-8 text-center text-[#7A869F]">
                    No documents found.
                  </td>
                </tr>
              ) : null}

              {!isLoading && !isError
                ? documents.map((document) => (
                    <tr key={document.id} className="border-t border-[#E8EDF5]">
                      <td className="px-4 py-3">
                        <input type="checkbox" aria-label={`Select ${document.title}`} />
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#EEF3FC] text-[#7283A2]">
                            <FileText className="h-4 w-4" />
                          </span>
                          <p className="font-semibold text-[#2D384E]">{document.title}</p>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-[#6D7992]">{document.summary}</td>
                      <td className="px-2 py-3">
                        <span
                          className={[
                            "rounded px-2 py-0.5 text-[11px] font-semibold",
                            getDocumentStatusBadge(document.status),
                          ].join(" ")}
                        >
                          {toLabel(document.status)}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-[#7A869F]">{document.version}</td>
                      <td className="px-2 py-3 text-[#6D7992]">{formatRelativeTime(document.updatedAt)}</td>
                      <td className="px-2 py-3 text-right text-[#8E99AE]">...</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#76839A]">
          <p>
            Showing {showingStart}-{showingEnd} of {totalDocuments} documents
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
    </div>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center justify-between rounded-md border border-[#DDE4EF] bg-white px-3 text-[13px] text-[#56627B]"
    >
      {label}
      <ChevronDown className="ml-2 h-3.5 w-3.5 text-[#8E9AB0]" />
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
}) {
  return (
    <label className="relative inline-flex h-9 items-center rounded-md border border-[#DDE4EF] bg-white px-3 text-[13px] text-[#56627B]">
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

function getDocumentStatusBadge(status: DocumentStatus): string {
  if (status === "published") {
    return "bg-[#EFF7F1] text-[#3D7A50]";
  }
  if (status === "review") {
    return "bg-[#F5F7FA] text-[#667389]";
  }
  return "bg-[#EEF2F9] text-[#6D7992]";
}

function toLabel(status: DocumentStatus): string {
  if (status === "published") {
    return "Published";
  }
  if (status === "review") {
    return "Review";
  }
  return "Draft";
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
