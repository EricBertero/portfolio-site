"use client";

import { useMemo, useState } from "react";
import type { SkillCategory } from "@/content/site";
import { SkillCategories } from "@/components/skill-categories";
import { SkillTileGrid, type TileBadge } from "@/components/skill-tile-grid";

interface SkillsExplorerProps {
  categories: SkillCategory[];
  defaultOpenId: string | null;
}

/** Links the category accordion and the tool-tile grid through the open category. */
export function SkillsExplorer({ categories, defaultOpenId }: SkillsExplorerProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultOpenId);
  const badges = useMemo<TileBadge[]>(
    () => categories.flatMap((category) => category.badges.map((badge) => ({ ...badge, categoryId: category.id }))),
    [categories],
  );

  return (
    // The accordion leads on every screen size: it's the content, and on a phone the grid
    // below it shows the result of opening a category right after the tap.
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <SkillCategories
          categories={categories}
          activeId={activeId}
          onToggle={(id) => setActiveId((current) => (current === id ? null : id))}
        />
      </div>
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <SkillTileGrid badges={badges} activeCategory={activeId} />
        </div>
      </div>
    </div>
  );
}
