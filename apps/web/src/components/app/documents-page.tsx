import { Download, FileText, Search } from "lucide-react";

const documents = [
  {
    title: "API Reference v2.0",
    summary: "Complete technical documentation for gateway APIs.",
    status: "Published",
    version: "v2.0.4",
    lastEdited: "2 hours ago",
  },
  {
    title: "System Architecture Design",
    summary: "High-level overview of the platform topology.",
    status: "Review",
    version: "v1.2.0",
    lastEdited: "Yesterday",
  },
  {
    title: "User Onboarding Flow",
    summary: "Detailed functional requirements for onboarding.",
    status: "Draft",
    version: "v0.8.5",
    lastEdited: "3 days ago",
  },
  {
    title: "Database Schema Migration Guide",
    summary: "Instructions and scripts for migrating schema safely.",
    status: "Published",
    version: "v1.0.0",
    lastEdited: "1 week ago",
  },
  {
    title: "Security & Compliance Audit",
    summary: "Internal documentation covering SOC2 controls.",
    status: "Review",
    version: "v2.1.0",
    lastEdited: "2 weeks ago",
  },
];

export function DocumentsPage() {
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
              placeholder="Search by title, summary, or content..."
              className="h-9 w-full rounded-md border border-[#DFE5F0] bg-white pl-9 pr-3 text-[13px] text-[#374359] outline-none placeholder:text-[#9BA7BA]"
            />
          </label>
          <FilterChip label="All Types" />
          <FilterChip label="All Status" />
          <FilterChip label="Last Edited" />
          <button
            type="button"
            className="h-9 rounded-md px-2 text-[13px] font-medium text-[#6C7891] transition hover:bg-[#F0F4FB]"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-[#E0E6F0]">
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
              {documents.map((document) => (
                <tr key={document.title} className="border-t border-[#E8EDF5]">
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
                    <span className="rounded bg-[#EFF3F9] px-2 py-0.5 text-[11px] font-semibold text-[#5D6982]">
                      {document.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-[#7A869F]">{document.version}</td>
                  <td className="px-2 py-3 text-[#6D7992]">{document.lastEdited}</td>
                  <td className="px-2 py-3 text-right text-[#8E99AE]">...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#76839A]">
          <p>Showing 1-5 of 52 documents</p>
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
              3
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

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F2] pt-4 text-[12px] text-[#7B879D]">
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

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center justify-between rounded-md border border-[#DDE4EF] bg-white px-3 text-[13px] text-[#56627B]"
    >
      {label}
      <span className="ml-2 text-[10px] text-[#8E9AB0]">▼</span>
    </button>
  );
}
