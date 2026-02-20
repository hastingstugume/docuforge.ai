import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<"section">;

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={cn("py-8", className)} {...props}>
      {children}
    </section>
  );
}
