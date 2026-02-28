"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, FolderPlus } from "lucide-react";
import { createProjectInputSchema, type ProjectType } from "@docuforge/shared";
import { useCreateProject } from "@/lib/api/projects";

type FormState = {
  name: string;
  description: string;
  type: ProjectType;
};

const typeOptions: Array<{ value: ProjectType; label: string; helper: string }> = [
  { value: "api", label: "API", helper: "Service specs and endpoint docs" },
  { value: "dashboard", label: "Dashboard", helper: "Frontend and analytics documentation" },
  { value: "infrastructure", label: "Infrastructure", helper: "Platform and environment requirements" },
  { value: "finance", label: "Finance", helper: "Billing, payouts, and reconciliation workflows" },
  { value: "compliance", label: "Compliance", helper: "Audits, controls, and security standards" },
  { value: "migration", label: "Migration", helper: "Legacy-to-modern transition plans" },
  { value: "general", label: "General", helper: "Cross-functional product documentation" },
];

export function CreateProjectPage() {
  const router = useRouter();
  const createProjectMutation = useCreateProject();
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    type: "general",
  });

  const fieldErrors = useMemo(() => {
    const parsed = createProjectInputSchema.safeParse(form);
    if (parsed.success) {
      return {} as Record<string, string>;
    }

    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues as Array<{ path: Array<string | number>; message: string }>) {
      const key = String(issue.path[0]);
      if (!errors[key]) {
        errors[key] = issue.message;
      }
    }
    return errors;
  }, [form]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setErrorMessage(null);

    const parsed = createProjectInputSchema.safeParse(form);
    if (!parsed.success) {
      return;
    }

    try {
      const project = await createProjectMutation.mutateAsync(parsed.data);
      router.push(`/dashboard/${project.id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create project.");
    }
  }

  return (
    <section className="mx-auto w-full max-w-[920px]">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5E6B83] transition hover:text-[#2F68E8]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <div className="mt-3 rounded-xl border border-[#E2E8F2] bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF] text-[#2F68E8]">
            <FolderPlus className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-[27px] font-extrabold tracking-[-0.02em] text-[#1D2637]">
              Create New Project
            </h1>
            <p className="mt-1 text-[14px] text-[#6D7991]">
              Define the core context so your team can generate accurate documentation faster.
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
          <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
            <div>
              <label htmlFor="project-name" className="mb-1.5 block text-[13px] font-semibold text-[#3C4860]">
                Project Name
              </label>
              <input
                id="project-name"
                value={form.name}
                onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                placeholder="e.g. Nebula API Gateway"
                className="h-11 w-full rounded-md border border-[#DCE3EF] bg-white px-3 text-[14px] text-[#1F2A3C] outline-none placeholder:text-[#97A4B8] focus:border-[#2F68E8] focus:ring-2 focus:ring-[#2F68E8]/15"
                aria-invalid={Boolean(submitted && fieldErrors.name)}
                aria-describedby={submitted && fieldErrors.name ? "project-name-error" : undefined}
              />
              {submitted && fieldErrors.name ? (
                <p id="project-name-error" className="mt-1.5 text-xs text-[#C93434]">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="project-type" className="mb-1.5 block text-[13px] font-semibold text-[#3C4860]">
                Project Type
              </label>
              <select
                id="project-type"
                value={form.type}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, type: event.target.value as ProjectType }))
                }
                className="h-11 w-full rounded-md border border-[#DCE3EF] bg-white px-3 text-[14px] text-[#1F2A3C] outline-none focus:border-[#2F68E8] focus:ring-2 focus:ring-[#2F68E8]/15"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-[#8B98AD]">
                {typeOptions.find((option) => option.value === form.type)?.helper}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="mb-1.5 block text-[13px] font-semibold text-[#3C4860]"
            >
              Description
            </label>
            <textarea
              id="project-description"
              value={form.description}
              onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
              placeholder="Describe this project's technical domain, scope, and expected documentation outputs."
              rows={5}
              className="w-full rounded-md border border-[#DCE3EF] bg-white px-3 py-2.5 text-[14px] text-[#1F2A3C] outline-none placeholder:text-[#97A4B8] focus:border-[#2F68E8] focus:ring-2 focus:ring-[#2F68E8]/15"
              aria-invalid={Boolean(submitted && fieldErrors.description)}
              aria-describedby={submitted && fieldErrors.description ? "project-description-error" : undefined}
            />
            {submitted && fieldErrors.description ? (
              <p id="project-description-error" className="mt-1.5 text-xs text-[#C93434]">
                {fieldErrors.description}
              </p>
            ) : null}
          </div>

          {errorMessage ? <p className="text-sm text-[#C93434]">{errorMessage}</p> : null}

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E7EDF6] pt-4">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center rounded-md border border-[#D8DFEC] px-4 text-[13px] font-semibold text-[#536079] transition hover:bg-[#F4F7FC]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[#2F68E8] px-4 text-[13px] font-semibold text-white transition hover:bg-[#285ad0] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {createProjectMutation.isPending ? "Creating..." : "Create Project"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
