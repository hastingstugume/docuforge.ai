import type { ReactNode } from "react";
import { Building2, CreditCard, Plug, Users } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#E0E5EF] bg-white p-4 sm:p-5">
        <div>
          <h1 className="text-[34px] font-black tracking-[-0.02em] text-[#1E2638]">Settings</h1>
          <p className="mt-1 text-sm text-[#6B7790]">
            Manage your organization&apos;s configuration, team members, and billing.
          </p>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[280px_1fr]">
          <aside className="rounded-lg border border-[#E1E7F1] bg-[#FBFCFE] p-3">
            <ul className="space-y-1">
              <SettingsNavItem
                active
                icon={<Building2 className="h-4 w-4" />}
                label="Organization"
              />
              <SettingsNavItem icon={<Users className="h-4 w-4" />} label="Team & Members" />
              <SettingsNavItem icon={<CreditCard className="h-4 w-4" />} label="Billing & Plans" />
              <SettingsNavItem icon={<Plug className="h-4 w-4" />} label="Integrations" />
            </ul>
          </aside>

          <div className="space-y-4">
            <article className="rounded-lg border border-[#E1E7F1] bg-white">
              <div className="border-b border-[#E8EDF5] px-4 py-3">
                <h2 className="text-[32px] font-black tracking-[-0.02em] text-[#1F2738]">
                  Organization Profile
                </h2>
                <p className="mt-1 text-sm text-[#6C7890]">
                  Public information about your company and workspace.
                </p>
              </div>

              <div className="grid gap-3 p-4 md:grid-cols-2">
                <Field label="Organization Name" value="Acme Engineering" />
                <Field label="Technical Domain" value="acme.tech" />
                <div className="md:col-span-2">
                  <Field
                    label="Description"
                    value="Core infrastructure and platform engineering team."
                  />
                </div>
              </div>

              <div className="border-t border-[#E8EDF5] px-4 py-3">
                <button
                  type="button"
                  className="inline-flex h-9 items-center rounded-md bg-[#2F68E8] px-4 text-sm font-semibold text-white transition hover:bg-[#275ad0]"
                >
                  Save Changes
                </button>
              </div>
            </article>

            <article className="rounded-lg border border-[#E1E7F1] bg-white p-4">
              <h3 className="text-[30px] font-black tracking-[-0.02em] text-[#1F2738]">
                Global Defaults
              </h3>
              <p className="mt-1 text-sm text-[#6C7890]">
                Standard configurations applied to all new projects and documents.
              </p>

              <div className="mt-4 space-y-4">
                <SettingToggle
                  label="Auto-Versioning"
                  description="Automatically increment version numbers on document publish."
                  enabled
                />
                <SettingToggle
                  label="Markdown Flavor"
                  description="Default to GitHub Flavored Markdown for all exports."
                  enabled
                />
                <SettingToggle
                  label="Public Preview"
                  description="Allow non-team members to view read-only document links."
                  enabled={false}
                />
              </div>
            </article>
          </div>
        </div>
      </section>

    </div>
  );
}

function SettingsNavItem({
  icon,
  label,
  active = false,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        className={[
          "inline-flex h-10 w-full items-center gap-2 rounded-md px-3 text-left text-[13px] font-semibold transition",
          active ? "bg-[#2F68E8] text-white" : "text-[#5F6B82] hover:bg-[#F0F4FB]",
        ].join(" ")}
      >
        <span className={active ? "text-white" : "text-[#8090A9]"}>{icon}</span>
        {label}
      </button>
    </li>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-semibold text-[#5C6781]">{label}</span>
      <input
        readOnly
        value={value}
        className="h-10 w-full rounded-md border border-[#DCE3EE] bg-[#FAFBFE] px-3 text-[13px] text-[#364159]"
      />
    </label>
  );
}

function SettingToggle({
  label,
  description,
  enabled,
}: {
  label: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#EDF1F7] pb-3 last:border-0 last:pb-0">
      <div>
        <p className="text-[17px] font-bold text-[#2A354A]">{label}</p>
        <p className="mt-0.5 text-[13px] text-[#6D7992]">{description}</p>
      </div>
      <button
        type="button"
        aria-label={`Toggle ${label}`}
        aria-pressed={enabled}
        className={[
          "relative mt-1 inline-flex h-6 w-12 rounded-full transition",
          enabled ? "bg-[#2F68E8]" : "bg-[#C6CFDD]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
            enabled ? "right-0.5" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
