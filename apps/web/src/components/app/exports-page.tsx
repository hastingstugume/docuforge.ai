import {
  ArrowUpRightFromSquare,
  ChevronRight,
  FileText,
  Filter,
  RefreshCcw,
  Terminal,
} from "lucide-react";

const activeJobs = [
  {
    title: "Cloud Architecture Deep Dive",
    type: "PDF GENERATION",
    status: "Processing",
    progress: 72,
    started: "Started 12 mins ago",
  },
  {
    title: "Compliance_Report_Draft",
    type: "DOCX EXPORT",
    status: "Processing",
    progress: 15,
    started: "Started 2 mins ago",
  },
  {
    title: "Mobile API Spec Sync",
    type: "MARKDOWN SYNC",
    status: "Queued",
    progress: 0,
    started: "Started Just now",
  },
];

const exportRows = [
  {
    name: "API_Ref_Internal_v2.pdf",
    project: "Core API Gateway",
    format: "PDF",
    size: "1.2 MB",
    version: "2.4.0",
    time: "2024-05-15 14:30",
  },
  {
    name: "System_Architecture_DeepDive.md",
    project: "Cloud Infrastructure",
    format: "Markdown",
    size: "450 KB",
    version: "1.1.0",
    time: "2024-05-15 11:15",
  },
  {
    name: "Compliance_Security_Audit.docx",
    project: "Enterprise Admin",
    format: "DOCX",
    size: "3.8 MB",
    version: "4.2.1",
    time: "2024-05-14 16:45",
  },
  {
    name: "User_Onboarding_Flow.pdf",
    project: "Mobile App",
    format: "PDF",
    size: "2.1 MB",
    version: "0.9.8-beta",
    time: "2024-05-14 09:20",
  },
  {
    name: "GraphQL_Schema_Spec.md",
    project: "Core API Gateway",
    format: "Markdown",
    size: "120 KB",
    version: "2.3.9",
    time: "2024-05-13 18:10",
  },
];

export function ExportsPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#E0E5EF] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[34px] font-black tracking-[-0.02em] text-[#1E2638]">
              Jobs & Exports
            </h1>
            <p className="mt-1 text-sm text-[#6B7790]">
              Monitor documentation generation tasks and download your finalized technical assets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1 rounded-md border border-[#D9E0EC] bg-white px-3 text-sm font-semibold text-[#4D5972]"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1 rounded-md bg-[#2F68E8] px-3 text-sm font-semibold text-white transition hover:bg-[#275ad0]"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-[-0.02em] text-[#1F2738]">Active Jobs</h2>
            <span className="rounded bg-[#EAF1FF] px-2 py-0.5 text-[11px] font-semibold text-[#2F68E8]">
              3 Running
            </span>
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-3">
            {activeJobs.map((job) => (
              <article
                key={job.title}
                className="rounded-lg border border-[#E1E7F1] bg-[#FCFDFF] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[14px] font-semibold text-[#2C374D]">{job.title}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-[#78849B]">{job.type}</p>
                  </div>
                  <span className="rounded bg-[#EEF3F9] px-2 py-0.5 text-[10px] font-semibold text-[#637188]">
                    {job.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-[#7D89A0]">
                  <p>Progress</p>
                  <p>{job.progress}%</p>
                </div>
                <div className="mt-1 h-2 rounded bg-[#E8EDF5]">
                  <div className="h-2 rounded bg-[#2F68E8]" style={{ width: `${job.progress}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-[#E8EDF5] pt-2 text-[11px] text-[#7D89A0]">
                  <span className="inline-flex items-center gap-1">
                    <RefreshCcw className="h-3 w-3 text-[#98A5BC]" />
                    {job.started}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6E7C95]"
                  >
                    <span className="font-mono text-[10px]">{">_"}</span>
                    Logs
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-[#E0E6F0]">
          <div className="flex items-center justify-between border-b border-[#E8EDF5] px-4 py-3">
            <h3 className="text-[20px] font-black tracking-[-0.01em] text-[#20293B]">
              Export History
            </h3>
            <button
              type="button"
              className="text-[12px] font-semibold text-[#2F68E8] hover:underline"
            >
              Clear History
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
              <thead className="bg-[#F7F9FC] text-[12px] font-semibold text-[#6A768E]">
                <tr>
                  <th className="px-4 py-3">File Name</th>
                  <th className="px-2 py-3">Project</th>
                  <th className="px-2 py-3">Format</th>
                  <th className="px-2 py-3">Size</th>
                  <th className="px-2 py-3">Version</th>
                  <th className="px-2 py-3">Exported At</th>
                </tr>
              </thead>
              <tbody>
                {exportRows.map((row) => (
                  <tr key={row.name} className="border-t border-[#E8EDF5]">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 text-[#2F3A50]">
                        <FileText className="h-4 w-4 text-[#8A96AB]" />
                        {row.name}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-[#5E6A83]">{row.project}</td>
                    <td className="px-2 py-3">
                      <span className="rounded bg-[#EFF3F9] px-2 py-0.5 text-[10px] font-semibold text-[#65748D]">
                        {row.format}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-[#5E6A83]">{row.size}</td>
                    <td className="px-2 py-3 text-[#5E6A83]">{row.version}</td>
                    <td className="px-2 py-3 text-[#5E6A83]">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[12px] text-[#76839A]">
            <p>Showing 5 of 24 recent exports</p>
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                className="h-7 rounded-md border border-[#DCE3EE] px-2 text-[#95A0B4]"
              >
                Previous
              </button>
              <button
                type="button"
                className="h-7 rounded-md border border-[#DCE3EE] px-2 text-[#6C7890]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
        <article className="rounded-xl border border-[#E0E5EF] bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2F68E8]">
              <Terminal className="h-4 w-4" />
            </span>
            <p className="text-[18px] font-black tracking-[-0.01em] text-[#20293B]">
              Job Generation Logs
            </p>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-[#6D7992]">
            Access low-level completion logs for debugging failed exports or formatting issues.
          </p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#2F68E8] hover:underline"
          >
            Explore log explorer
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </article>

        <article className="rounded-xl border border-[#E0E5EF] bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#F3F6FC] text-[#71839D]">
              <ArrowUpRightFromSquare className="h-4 w-4" />
            </span>
            <p className="text-[18px] font-black tracking-[-0.01em] text-[#20293B]">
              Webhook Integrations
            </p>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-[#6D7992]">
            Automatically push finalized documents to GitHub, S3, or SharePoint on completion.
          </p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#2F68E8] hover:underline"
          >
            Configure webhooks
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </article>
      </section>

    </div>
  );
}
