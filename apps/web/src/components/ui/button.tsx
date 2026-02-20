import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
};

export function Button({
  children,
  className,
  href,
  type = "button",
  variant = "primary",
  onClick,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition",
    variant === "primary" && "bg-[#1F6FEB] text-white hover:bg-[#195fc9]",
    variant === "secondary" && "border border-[#D2D8E3] bg-white text-[#0F1728] hover:bg-[#F7F9FC]",
    variant === "ghost" && "text-[#3A465A] hover:bg-[#EEF2F8]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles} onClick={onClick}>
      {children}
    </button>
  );
}
