"use client";

import type { ActivityEvent } from "@docuforge/shared";
import { Clock3, FilePenLine, GitCommitHorizontal, Rocket, Trash2 } from "lucide-react";
import { useActivityEvents } from "@/lib/api/activity";

export function ActivityPage() {
  const { data: activityItems = [], isLoading, isError } = useActivityEvents({ limit: 50 });

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#E0E5EF] bg-white p-4 sm:p-5">
        <h1 className="text-[34px] font-black tracking-[-0.02em] text-[#1E2638]">Activity</h1>
        <p className="mt-1 text-sm text-[#6B7790]">
          Track team events across projects, documents, generations, and exports.
        </p>

        <div className="mt-4 rounded-lg border border-[#E1E7F1]">
          {isLoading ? (
            <p className="p-4 text-[13px] text-[#7E8AA1]">Loading activity...</p>
          ) : null}

          {!isLoading && isError ? (
            <p className="p-4 text-[13px] text-[#B13C49]">Unable to load activity log.</p>
          ) : null}

          {!isLoading && !isError && activityItems.length === 0 ? (
            <p className="p-4 text-[13px] text-[#7E8AA1]">No activity yet.</p>
          ) : null}

          {!isLoading && !isError && activityItems.length > 0 ? (
            <ul className="divide-y divide-[#E9EEF6]">
              {activityItems.map((item) => (
                <li key={item.id} className="flex flex-wrap items-start gap-3 p-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#EEF3FC] text-[#2F68E8]">
                    <ActivityIcon action={item.action} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-bold text-[#263247]">{toActivityTitle(item)}</p>
                    <p className="mt-1 text-[13px] text-[#66748E]">{toActivityDetail(item)}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[12px] text-[#8A96AC]">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatRelativeTime(item.occurredAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function ActivityIcon({ action }: { action: ActivityEvent["action"] }) {
  if (action === "project.created") {
    return <GitCommitHorizontal className="h-4 w-4" />;
  }
  if (action === "project.updated") {
    return <FilePenLine className="h-4 w-4" />;
  }
  if (action === "project.deleted") {
    return <Trash2 className="h-4 w-4" />;
  }
  return <Rocket className="h-4 w-4" />;
}

function toActivityTitle(item: ActivityEvent): string {
  if (item.action === "project.created") {
    return `${item.resourceName} created`;
  }
  if (item.action === "project.updated") {
    return `${item.resourceName} updated`;
  }
  return `${item.resourceName} deleted`;
}

function toActivityDetail(item: ActivityEvent): string {
  if (item.action === "project.created") {
    return `${item.actorName} created this project record.`;
  }
  if (item.action === "project.updated") {
    return `${item.actorName} updated project metadata.`;
  }
  return `${item.actorName} removed this project from the workspace.`;
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
