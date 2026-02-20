"use client";

import type { ReactNode } from "react";

type SmoothScrollLinkProps = {
  href: `#${string}`;
  children: ReactNode;
  className?: string;
  offset?: number;
  durationMs?: number;
};

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function SmoothScrollLink({
  href,
  children,
  className,
  offset = 88,
  durationMs = 550,
}: SmoothScrollLinkProps) {
  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) {
      return;
    }

    event.preventDefault();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = window.scrollY;
    const end = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);

    if (reduceMotion) {
      window.scrollTo(0, end);
      window.history.pushState(null, "", href);
      return;
    }

    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(progress);
      window.scrollTo(0, start + (end - start) * eased);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        window.history.pushState(null, "", href);
      }
    }

    window.requestAnimationFrame(step);
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
