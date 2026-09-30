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
    <div className="border-t border-line">
      {categories.map((category) => {
        const open = category.id === activeId;
        const buttonId = `skills-${category.id}-button`;
        const panelId = `skills-${category.id}-panel`;
        const titleId = `skills-${category.id}-title`;
        const countId = `skills-${category.id}-count`;
        const summaryId = `skills-${category.id}-summary`;

        return (
          <div key={category.id} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                // Announced as just the category name; the count and summary are its description.
                aria-labelledby={titleId}
                aria-describedby={`${countId} ${summaryId}`}
                onClick={() => onToggle(category.id)}
                className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-1 py-6 text-left"
              >
                <span
                  id={titleId}
                  className={cn(
                    "text-lg font-semibold tracking-tight transition-colors sm:text-xl",
                    open ? "text-foreground" : "text-soft group-hover:text-foreground",
                  )}
                >
                  {category.title}
                </span>
                <span className="row-span-2 flex items-center gap-3 pt-0.5">
                  <span id={countId} className="hidden text-sm text-muted tabular-nums sm:inline">
                    {countItems(category)} skills
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300",
                      open
                        ? "border-brand bg-brand text-on-brand"
                        : "border-line-strong text-soft group-hover:border-brand",
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
                <span id={summaryId} className="text-sm leading-6 text-muted">
                  {category.summary}
                </span>
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
                    className="pt-3"
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
                    }}
                  >
                    <h4 className="text-sm font-medium text-muted">{group.title}</h4>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-soft"
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
