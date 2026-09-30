import type { LinkKind, TopologyBox, TopologyLink } from "@/content/homelab";
import { cn } from "@/lib/cn";

interface TopologyDiagramProps {
  tiers: TopologyBox[][];
  links: TopologyLink[];
}

interface Layout {
  width: number;
  boxHeight: number;
  gapY: number;
  gapX: number;
  maxBox: number;
  maxSingle: number;
  label: number;
  detail: number;
  linkLabel: number;
}

// Two layouts of the same diagram: a wide one, and a narrow one whose text stays legible on a
// phone instead of shrinking with a scaled-down wide drawing.
const WIDE: Layout = { width: 880, boxHeight: 60, gapY: 60, gapX: 28, maxBox: 230, maxSingle: 340, label: 15, detail: 12.5, linkLabel: 12 };
const NARROW: Layout = { width: 360, boxHeight: 56, gapY: 52, gapX: 10, maxBox: 170, maxSingle: 290, label: 12.5, detail: 11.5, linkLabel: 11.5 };
const PAD = 2;

const LINK_CLASSES: Record<LinkKind, string> = {
  public: "stroke-brand",
  admin: "stroke-muted",
  internal: "stroke-line-strong",
};

interface PlacedBox extends TopologyBox {
  x: number;
  y: number;
  w: number;
}

function place(tiers: TopologyBox[][], layout: Layout): Map<string, PlacedBox> {
  const placed = new Map<string, PlacedBox>();
  const available = layout.width - PAD * 2;

  tiers.forEach((tier, row) => {
    const count = tier.length;
    const w =
      count === 1
        ? Math.min(available, layout.maxSingle)
        : Math.min(layout.maxBox, (available - (count - 1) * layout.gapX) / count);
    const rowWidth = count * w + (count - 1) * layout.gapX;
    const x0 = (layout.width - rowWidth) / 2;
    const y = PAD + row * (layout.boxHeight + layout.gapY);
    tier.forEach((box, i) => placed.set(box.id, { ...box, x: x0 + i * (w + layout.gapX), y, w }));
  });

  return placed;
}

function Drawing({
  tiers,
  links,
  layout,
  idPrefix,
  className,
}: TopologyDiagramProps & { layout: Layout; idPrefix: string; className?: string }) {
  const boxes = place(tiers, layout);
  const height = PAD * 2 + tiers.length * layout.boxHeight + (tiers.length - 1) * layout.gapY;
  const centre = (box: PlacedBox) => box.x + box.w / 2;

  const description = links
    .map((link) => {
      const from = boxes.get(link.from)?.label ?? link.from;
      const to = boxes.get(link.to)?.label ?? link.to;
      return `${from} to ${to}${link.label ? ` (${link.label.toLowerCase()})` : ""}`;
    })
    .join("; ");

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${height}`}
      role="img"
      aria-labelledby={`${idPrefix}-title ${idPrefix}-desc`}
      className={cn("h-auto w-full font-sans", className)}
    >
      <title id={`${idPrefix}-title`}>Homelab network topology</title>
      <desc id={`${idPrefix}-desc`}>{description}.</desc>

      {/* Links first, so boxes sit on top of their ends. Orthogonal: down, across, down. */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {links.map((link) => {
          const from = boxes.get(link.from);
          const to = boxes.get(link.to);
          if (!from || !to) return null;
          const sx = centre(from);
          const sy = from.y + layout.boxHeight;
          const tx = centre(to);
          const ty = to.y;
          const midY = sy + (ty - sy) / 2;
          const d = sx === tx ? `M${sx} ${sy}V${ty}` : `M${sx} ${sy}V${midY}H${tx}V${ty}`;
          return (
            <path
              key={`${link.from}-${link.to}`}
              d={d}
              className={LINK_CLASSES[link.kind]}
              strokeWidth={link.kind === "public" ? 2 : 1.5}
              strokeDasharray={link.kind === "admin" ? "5 5" : undefined}
            />
          );
        })}
      </g>

      {links.map((link) => {
        const from = boxes.get(link.from);
        const to = boxes.get(link.to);
        if (!from || !to || !link.label) return null;
        const sy = from.y + layout.boxHeight;
        const labelY = sy + (to.y - sy) / 4 + layout.linkLabel / 2;
        return (
          <text
            key={`${link.from}-${link.to}-label`}
            x={centre(from) + 8}
            y={labelY}
            fontSize={layout.linkLabel}
            className={link.kind === "public" ? "fill-brand-text" : "fill-muted"}
          >
            {link.label}
          </text>
        );
      })}

      {[...boxes.values()].map((box) => (
        <g key={box.id}>
          <rect
            x={box.x}
            y={box.y}
            width={box.w}
            height={layout.boxHeight}
            rx={10}
            className={cn("fill-surface-2", box.highlight ? "stroke-brand" : "stroke-line-strong")}
            strokeWidth={box.highlight ? 1.5 : 1}
          />
          <text
            x={centre(box)}
            y={box.y + layout.boxHeight / 2 - 3}
            textAnchor="middle"
            fontSize={layout.label}
            fontWeight={600}
            className="fill-foreground"
          >
            {box.label}
          </text>
          <text
            x={centre(box)}
            y={box.y + layout.boxHeight / 2 + layout.detail + 1}
            textAnchor="middle"
            fontSize={layout.detail}
            className="fill-muted"
          >
            {box.detail}
          </text>
        </g>
      ))}
    </svg>
  );
}

const LEGEND: { kind: LinkKind; label: string }[] = [
  { kind: "public", label: "Public traffic" },
  { kind: "admin", label: "Admin access" },
  { kind: "internal", label: "Internal" },
];

/** The lab's topology, drawn from `content/homelab.ts`. Pure SVG, themed by the color tokens. */
export function TopologyDiagram({ tiers, links }: TopologyDiagramProps) {
  return (
    <figure className="rounded-2xl border border-line bg-surface p-4 sm:p-8">
      <Drawing tiers={tiers} links={links} layout={WIDE} idPrefix="topology-wide" className="hidden sm:block" />
      <Drawing tiers={tiers} links={links} layout={NARROW} idPrefix="topology-narrow" className="sm:hidden" />
      <figcaption className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-xs text-muted">
        {LEGEND.map(({ kind, label }) => (
          <span key={kind} className="inline-flex items-center gap-2">
            <svg viewBox="0 0 24 4" className="h-1 w-6" aria-hidden="true">
              <path
                d="M1 2H23"
                className={LINK_CLASSES[kind]}
                strokeWidth={kind === "public" ? 2.5 : 2}
                strokeDasharray={kind === "admin" ? "4 3" : undefined}
                strokeLinecap="round"
              />
            </svg>
            {label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
