"use client";

import { m } from "motion/react";
import type { SkillCategory } from "@/content/site";
import { PlusIcon } from "@/components/ui/icons";
import { EASE_OUT_EXPO } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

interface SkillCategoriesProps {
  categories: SkillCategory[];
  activeId: string | null;
  onToggle: (id: string) => void;
}

function countItems(category: SkillCategory) {
  return category.groups.reduce((total, group) => total + group.items.length, 0);
}

/** Accordion of skill categories; one open at a time, each revealing its sub-groups. */
export function SkillCategories({ categories, activeId, onToggle }: SkillCategoriesProps) {
  return (
    <div className="border-t border-white/10">
      {categories.map((category) => {
        const open = category.id === activeId;
        const buttonId = `skills-${category.id}-button`;
        const panelId = `skills-${category.id}-panel`;

        return (
          <div key={category.id} className="border-b border-white/10">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => onToggle(category.id)}
                className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-1 py-6 text-left"
              >
                <span
                  className={cn(
                    "text-lg font-semibold tracking-tight transition-colors sm:text-xl",
                    open ? "text-foreground" : "text-zinc-300 group-hover:text-foreground",
                  )}
                >
                  {category.title}
                </span>
                <span className="row-span-2 flex items-center gap-3 pt-0.5">
                  <span className="hidden text-sm text-zinc-400 tabular-nums sm:inline">
                    {countItems(category)} skills
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300",
                      open
                        ? "border-brand bg-brand text-white"
                        : "border-white/15 text-zinc-300 group-hover:border-brand",
                    )}
                  >
                    <PlusIcon
                      aria-hidden="true"
                      className={cn(
                        "h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        open && "rotate-45",
                      )}
                    />
                  </span>
                </span>
                <span className="text-sm leading-6 text-zinc-400">{category.summary}</span>
              </button>
            </h3>

            {/* Panels stay in the DOM when closed (hidden via visibility) so every skill is in the page source. */}
            <m.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="overflow-hidden"
              initial={false}
              animate={
                open
                  ? { height: "auto", opacity: 1, visibility: "visible" }
                  : { height: 0, opacity: 0, transitionEnd: { visibility: "hidden" } }
              }
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
              <m.div
                className="grid gap-6 pb-8 sm:grid-cols-2"
                initial={false}
                animate={open ? "shown" : "hidden"}
                variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
              >
                {category.groups.map((group) => (
                  <m.div
                    key={group.title}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
                    }}
                  >
                    <h4 className="text-sm font-medium text-zinc-400">{group.title}</h4>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-zinc-200"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </m.div>
                ))}
              </m.div>
            </m.div>
          </div>
        );
      })}
    </div>
  );
}
