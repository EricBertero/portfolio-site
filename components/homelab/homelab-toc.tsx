"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface HomelabTocProps {
  sections: { id: string; label: string }[];
}

/**
 * "On this page" links. A wrapped row above the content on small screens; a sticky rail beside
 * it on wide ones, marking whichever section is being read.
 */
export function HomelabToc({ sections }: HomelabTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter((target): target is HTMLElement => target !== null);
    if (targets.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActiveId(visible[visible.length - 1].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
      <p className="mb-3 text-sm font-medium text-foreground">On this page</p>
      <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:border-l lg:border-line">
        {sections.map(({ id, label }) => {
          const active = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm transition-colors lg:-ml-px lg:min-h-10 lg:rounded-none lg:border-0 lg:border-l lg:px-4",
                  active
                    ? "border-brand text-foreground"
                    : "text-muted hover:border-line-strong hover:text-foreground lg:border-transparent lg:hover:border-line-strong",
                )}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
