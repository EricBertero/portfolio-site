import type { ExampleFinding, RiskLevel } from "@/content/phishing-analyzer";
import { cn } from "@/lib/cn";

// The analyzer dashboard's verdict scale (defined in globals.css): neutral for mail that needs
// nothing, the brand's reds for threats, so teal stays the page's one accent. Clean is a solid
// neutral and Low an outlined one, as in the dashboard. Level names always sit next to it.
const LEVEL_FILL = [
  "bg-(--verdict-clean)",
  "ring-1 ring-inset ring-(--verdict-clean)",
  "bg-(--verdict-suspicious)",
  "bg-(--verdict-high)",
  "bg-(--verdict-critical)",
];
const LEVEL_DOT = [
  "bg-(--verdict-clean)",
  "ring-[1.5px] ring-inset ring-(--verdict-clean)",
  "bg-(--verdict-suspicious)",
  "bg-(--verdict-high)",
  "bg-(--verdict-critical)",
];

/** The five risk levels: a proportional 0–100 bar, then what each level means. */
export function RiskScale({ levels }: { levels: RiskLevel[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div aria-hidden="true">
        <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
          {levels.map((level, index) => (
            <span
              key={level.name}
              className={cn("h-full", LEVEL_FILL[index])}
              style={{ flexGrow: level.to - level.from + 1 }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted tabular-nums">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Risk levels by score</caption>
          <thead>
            <tr className="border-b border-line-strong text-muted">
              <th scope="col" className="py-3 pr-6 font-medium">Level</th>
              <th scope="col" className="py-3 pr-6 font-medium">Score</th>
              <th scope="col" className="py-3 font-medium">What happens</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level, index) => (
              <tr key={level.name} className="border-b border-line">
                <th scope="row" className="py-4 pr-6 font-medium text-foreground">
                  <span className="inline-flex items-center gap-3">
                    <span aria-hidden="true" className={cn("h-2.5 w-2.5 rounded-full", LEVEL_DOT[index])} />
                    {level.name}
                  </span>
                </th>
                <td className="py-4 pr-6 text-soft tabular-nums">
                  {level.from}–{level.to}
                </td>
                <td className="py-4 text-soft">{level.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ScoreExampleProps {
  subject: string;
  sender: string;
  findings: ExampleFinding[];
  note: string;
}

/** A real score breakdown, laid out the way the analyzer's own dashboard shows it. */
export function ScoreExample({ subject, sender, findings, note }: ScoreExampleProps) {
  const total = findings.reduce((sum, finding) => sum + finding.points, 0);
  const score = Math.min(total, 100);

  return (
    <figure className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <p className="text-lg font-semibold tracking-tight text-foreground">{subject}</p>
          <p className="mt-1 text-sm break-words text-muted">{sender}</p>
        </div>
        <p className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold tracking-[-0.03em] text-foreground tabular-nums">{score}</span>
          <span className="text-sm text-muted">/ 100</span>
          <span className="ml-2 inline-flex items-center gap-2 self-center rounded-full border border-line-strong px-3 py-1 text-xs font-semibold text-foreground">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-(--verdict-critical)" />
            Critical
          </span>
        </p>
      </div>

      <table className="mt-6 w-full text-left text-sm">
        <caption className="sr-only">Findings behind the score, with the points each one added</caption>
        <thead>
          <tr className="border-b border-line-strong text-muted">
            <th scope="col" className="w-16 py-3 pr-4 text-right font-medium">Points</th>
            <th scope="col" className="py-3 font-medium">Finding</th>
          </tr>
        </thead>
        <tbody>
          {findings.map((finding) => (
            <tr key={finding.finding} className="border-b border-line align-top">
              <td className="py-3 pr-4 text-right font-semibold text-foreground tabular-nums">+{finding.points}</td>
              <td className="py-3 leading-6 text-soft">{finding.finding}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-4 text-sm leading-6 text-muted">{note}</figcaption>
    </figure>
  );
}
