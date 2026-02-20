import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("py-8", className)}>{children}</section>;
}
