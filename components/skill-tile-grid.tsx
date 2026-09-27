import type { SkillBadge } from "@/content/site";
import { readableOn, tileBackground, ToolIcon, withAlpha } from "@/components/ui/tool-icons";
import { cn } from "@/lib/cn";

export interface TileBadge extends SkillBadge {
  categoryId: string;
}

interface SkillTileGridProps {
  badges: TileBadge[];
  activeCategory: string | null;
}

/**
 * Every tool as its own colored tile — the icon's real brand color, or a plain wordmark
 * tile for the handful of vendors with no public logo. Selecting a category in the
 * accordion lights up its tiles and dims the rest; with none selected, every tile is lit.
 */
export function SkillTileGrid({ badges, activeCategory }: SkillTileGridProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 sm:p-6">
      <p className="mb-5 text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">Skill stack</p>
      <ul className="flex flex-wrap gap-3">
        {badges.map((badge) => (
          <SkillTile key={`${badge.categoryId}-${badge.name}`} badge={badge} lit={activeCategory === null || badge.categoryId === activeCategory} />
        ))}
      </ul>
    </div>
  );
}

function SkillTile({ badge, lit }: { badge: TileBadge; lit: boolean }) {
  const background = badge.icon ? tileBackground(badge.icon) : "#27272a";
  const foreground = readableOn(background);

  return (
    <li
      style={{
        backgroundColor: background,
        color: foreground,
        boxShadow: lit ? `0 10px 24px -10px ${withAlpha(background, 0.65)}` : undefined,
      }}
      className={cn(
        "flex items-center justify-center rounded-2xl border border-white/10 transition-[opacity,box-shadow,transform] duration-500 ease-out",
        badge.icon ? "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]" : "h-16 px-4 sm:h-[4.5rem]",
        lit ? "opacity-100 motion-safe:scale-100" : "opacity-25 motion-safe:scale-[0.96]",
      )}
    >
      <span className="sr-only">{badge.name}</span>
      {badge.icon ? (
        <ToolIcon name={badge.icon} className="h-7 w-7 sm:h-8 sm:w-8" style={{ color: foreground }} />
      ) : (
        <span aria-hidden="true" className="text-center text-xs leading-tight font-semibold text-balance">
          {badge.name}
        </span>
      )}
    </li>
  );
}
