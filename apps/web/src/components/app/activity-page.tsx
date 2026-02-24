import { Clock3, FilePenLine, GitCommitHorizontal, Rocket } from "lucide-react";

const activityItems = [
  {
    title: "Nexus API Gateway updated",
    detail: "Sarah K. published version 2.4.0 with revised OAuth flows.",
    age: "12 mins ago",
    type: "publish",
  },
  {
    title: "Payment Orchestrator context changed",
    detail: "Mike T. added 4 integration constraints for ledger reconciliation.",
    age: "1 hour ago",
    type: "context",
  },
  {
    title: "Compliance Auditor exported",
    detail: "Automation generated PDF and DOCX artifacts for stakeholder review.",
    age: "3 hours ago",
    type: "export",
  },
  {
    title: "Storage Vault v4 draft regenerated",
    detail: "AI regeneration completed for security and disaster recovery sections.",
    age: "Yesterday",
    type: "generate",
  },
];

export function ActivityPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#E0E5EF] bg-white p-4 sm:p-5">
        <h1 className="text-[34px] font-black tracking-[-0.02em] text-[#1E2638]">Activity</h1>
        <p className="mt-1 text-sm text-[#6B7790]">
          Track team events across projects, documents, generations, and exports.
        </p>

        <div className="mt-4 rounded-lg border border-[#E1E7F1]">
          <ul className="divide-y divide-[#E9EEF6]">
            {activityItems.map((item) => (
              <li key={item.title} className="flex flex-wrap items-start gap-3 p-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#EEF3FC] text-[#2F68E8]">
                  <ActivityIcon type={item.type} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold text-[#263247]">{item.title}</p>
                  <p className="mt-1 text-[13px] text-[#66748E]">{item.detail}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[12px] text-[#8A96AC]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.age}
                </span>
              </li>
            ))}
          </ul>
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

function ActivityIcon({ type }: { type: string }) {
  if (type === "publish") {
    return <GitCommitHorizontal className="h-4 w-4" />;
  }
  if (type === "context") {
    return <FilePenLine className="h-4 w-4" />;
  }
  if (type === "export") {
    return <Rocket className="h-4 w-4" />;
  }
  return <Rocket className="h-4 w-4" />;
}
