"use client";

import { useRef } from "react";
import { m, useInView, useReducedMotion, useScroll } from "motion/react";
import type { ExperienceItem } from "@/content/site";
import { EASE_OUT_EXPO } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

/** Vertical timeline whose crimson line fills as the reader scrolls through it. */
export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 65%"] });

  return (
    <ol ref={listRef} className="relative flex flex-col gap-16">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-white/10" />
      <m.span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-brand"
        style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
      />
      {items.map((item) => (
        <TimelineItem key={`${item.company}-${item.role}`} item={item} />
      ))}
    </ol>
  );
}

function TimelineItem({ item }: { item: ExperienceItem }) {
  const ref = useRef<HTMLLIElement>(null);
  const reached = useInView(ref, { once: true, margin: "0px 0px -35% 0px" });

  return (
    <m.li
      ref={ref}
      className="relative grid grid-cols-[15px_minmax(0,1fr)] gap-x-6"
      initial={{ opacity: 0, y: 24 }}
      animate={reached ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative z-10 mt-1.5 h-[15px] w-[15px] rounded-full border-2 transition-colors duration-500",
          reached ? "border-brand bg-brand ring-4 ring-brand/15" : "border-zinc-600 bg-background",
        )}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-zinc-400 tabular-nums">
            {item.periods.map((period, index) => (
              <span key={period}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                <span className="whitespace-nowrap">{period}</span>
              </span>
            ))}
          </p>
          <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{item.role}</h3>
          <p className="text-base text-zinc-300">
            {item.company}
            <span className="text-zinc-400">
              {" "}
              · {item.location}
              {item.team ? ` · ${item.team}` : ""}
            </span>
          </p>
        </div>

        <ul className="flex flex-col gap-3 text-sm leading-6 text-zinc-400">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
              <span aria-hidden="true" className="mt-2.5 h-px w-3 bg-zinc-600" />
              {highlight}
            </li>
          ))}
        </ul>

        <ul aria-label={`${item.company} tools and focus areas`} className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </m.li>
  );
}
