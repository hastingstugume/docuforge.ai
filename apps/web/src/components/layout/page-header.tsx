import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#0E1628]">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-[#5D6780]">{subtitle}</p> : null}
      </div>
      {actions}
    </header>
  );
}
