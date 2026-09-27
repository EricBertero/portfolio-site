import Image from "next/image";
import type { SkillBadge } from "@/content/site";
import { readableOn, toolHex, ToolIcon } from "@/components/ui/tool-icons";
import { cn } from "@/lib/cn";

export interface TileBadge extends SkillBadge {
  categoryId: string;
}

interface SkillTileGridProps {
  badges: TileBadge[];
  activeCategory: string | null;
}

/** "CrowdStrike" → "CS", "Active Directory" → "AD", "FlareVM" → "FV", "Intune" → "In". */
function monogram(name: string): string {
  const parts = name.split(/\s+|(?=[A-Z])/).filter(Boolean);
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2);
}

/**
 * Every tool as a tile in its real brand color, captioned with its name. The tile shows the
 * official logo when one is supplied, else the bundled glyph, else a monogram. Selecting a
 * category in the accordion lights up its tiles and dims the rest; with none selected,
 * every tile is lit.
 */
export function SkillTileGrid({ badges, activeCategory }: SkillTileGridProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <p className="mb-5 text-xs font-medium tracking-[0.2em] text-muted uppercase">Skill stack</p>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-x-2 gap-y-4">
        {badges.map((badge) => (
          <SkillTile
            key={`${badge.categoryId}-${badge.name}`}
            badge={badge}
            lit={activeCategory === null || badge.categoryId === activeCategory}
          />
        ))}
      </ul>
    </div>
  );
}

function SkillTile({ badge, lit }: { badge: TileBadge; lit: boolean }) {
  const background = badge.color ?? (badge.icon ? toolHex(badge.icon) : "#ffffff");
  const foreground = readableOn(background);

  return (
    <li className="flex flex-col items-center gap-2 text-center">
      <span
        aria-hidden="true"
        style={{ backgroundColor: background, color: foreground }}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl border border-line transition-[opacity,transform] duration-500 ease-out sm:h-14 sm:w-14 sm:rounded-2xl",
          lit ? "opacity-100 motion-safe:scale-100" : "opacity-25 motion-safe:scale-[0.94]",
        )}
      >
        {badge.logo ? (
          <Image src={badge.logo} alt="" width={28} height={28} unoptimized className="h-7 w-7 object-contain" />
        ) : badge.icon ? (
          <ToolIcon name={badge.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
        ) : (
          <span className="text-sm font-bold tracking-tight sm:text-base">{monogram(badge.name)}</span>
        )}
      </span>
      <span className="text-xs leading-tight text-balance text-muted">{badge.name}</span>
    </li>
  );
}
