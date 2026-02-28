"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  Activity,
  Bell,
  ChevronDown,
  Download,
  FileText,
  Grid2x2,
  Hexagon,
  LogOut,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react";
import { useMe } from "@/lib/api/me";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Projects", icon: Grid2x2 },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/exports", label: "Exports", icon: Download },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: me } = useMe();

  const activeHref = useMemo(() => {
    if (!pathname) {
      return "/dashboard";
    }

    const exact = navItems.find((item) => item.href === pathname);
    if (exact) {
      return exact.href;
    }

    const nested = navItems.find((item) => pathname.startsWith(`${item.href}/`));
    return nested?.href ?? "/dashboard";
  }, [pathname]);

  const initials = me?.fullName
    ? me.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((chunk) => chunk[0]?.toUpperCase() ?? "")
        .join("")
    : "HA";

  return (
    <main className="min-h-dvh bg-[#F4F6FA] text-[#1F2739]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1360px] flex-col border-x border-[#E2E8F2] bg-[#F7F9FC]">
        <header className="sticky top-0 z-30 border-b border-[#E2E8F2] bg-white">
          <div className="flex h-[60px]">
            <div className="hidden w-[188px] items-center border-r border-[#E2E8F2] px-4 lg:flex">
              <Link href="/dashboard" className="inline-flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#2F68E8] text-white">
                  <Hexagon className="h-3.5 w-3.5" />
                </span>
                <span className="text-[15px] font-bold tracking-[-0.01em] text-[#2F68E8]">
                  DocuForge AI
                </span>
              </Link>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-3 px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#D8DFEB] bg-white text-[#5F6B82] lg:hidden"
                aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <Link href="/dashboard" className="inline-flex items-center gap-2 lg:hidden">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#2F68E8] text-white">
                  <Hexagon className="h-3.5 w-3.5" />
                </span>
                <span className="text-[15px] font-bold tracking-[-0.01em] text-[#2F68E8]">
                  DocuForge AI
                </span>
              </Link>

              <button
                type="button"
                className="hidden items-center gap-1 rounded-md px-1 text-[13px] font-semibold text-[#3C475E] md:inline-flex"
              >
                Engineering Team
                <ChevronDown className="h-3.5 w-3.5 text-[#8C98AD]" />
              </button>

              <label className="relative hidden min-w-0 max-w-[380px] flex-1 md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA5B9]" />
                <input
                  type="search"
                  placeholder="Search projects, docs..."
                  className="h-9 w-full rounded-md border border-[#E2E7F0] bg-[#F8FAFD] pl-9 pr-3 text-[13px] text-[#354055] outline-none placeholder:text-[#96A1B5] focus:border-[#2F68E8] focus:ring-2 focus:ring-[#2F68E8]/15"
                />
              </label>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6F7A90] transition hover:bg-[#F4F7FC]"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#FF4D5E]" />
                </button>

                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                  aria-label="Profile menu"
                >
                  <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#D7DEEA] bg-[linear-gradient(140deg,#f1f5ff,#d6e2ff)] text-xs font-bold text-[#3A4A6A]">
                    {initials}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-[#2FC36B]" />
                  </span>
                </button>
              </div>

              <button
                type="button"
                className="relative inline-flex h-9 items-center gap-2 rounded-md border border-[#E2E7F0] bg-[#F8FAFD] px-3 text-[13px] text-[#5E6B84] md:hidden"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </header>

        {isMobileNavOpen ? (
          <div
            className="fixed inset-0 z-50 bg-[#111827]/35 lg:hidden"
            role="presentation"
            onClick={() => setMobileNavOpen(false)}
          >
            <div
              className="h-full w-[268px] max-w-[82vw]"
              role="presentation"
              onClick={(event) => event.stopPropagation()}
            >
              <Sidebar activeHref={activeHref} onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1">
          <div className="hidden lg:block">
            <Sidebar activeHref={activeHref} onNavigate={() => undefined} />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex-1 px-4 pb-6 pt-4 sm:px-6 sm:pt-5">{children}</div>
            <AppFooter />
          </div>
        </div>
      </div>
    </main>
  );
}

function AppFooter() {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F2] px-4 py-3 text-[12px] text-[#7B879D] sm:px-6">
      <p>© 2024 DocuForge AI. All rights reserved.</p>
      <div className="flex gap-5">
        <p>Status</p>
        <p>Documentation</p>
        <p>Support</p>
        <p>Terms</p>
      </div>
    </footer>
  );
}

function Sidebar({ activeHref, onNavigate }: { activeHref: string; onNavigate: () => void }) {
  return (
    <aside className="flex h-full w-[188px] flex-col border-r border-[#E2E8F2] bg-[#F7F9FC]">
      <nav className="px-3 py-3" aria-label="App navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={[
                    "group flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-[#2F68E8] text-white"
                      : "text-[#5D6880] hover:bg-[#EDF2FA] hover:text-[#2C3A55]",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-4 w-4",
                      isActive ? "text-white" : "text-[#7F8AA0] group-hover:text-[#58647D]",
                    ].join(" ")}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-[#E2E8F2] p-3">
        <div className="rounded-lg border border-[#E2E8F2] bg-white p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#2F68E8]">Trial Plan</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#76839A]">
            7 days remaining in your professional trial.
          </p>
          <button
            type="button"
            className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-md border border-[#D7DEEA] bg-white text-[11px] font-semibold text-[#4A566E] transition hover:bg-[#F7FAFE]"
          >
            Upgrade Plan
          </button>
        </div>

        <button
          type="button"
          className="mt-3 inline-flex h-8 w-full items-center gap-2 rounded-md px-2 text-[13px] font-medium text-[#66748D] transition hover:bg-[#EDF2FA]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
