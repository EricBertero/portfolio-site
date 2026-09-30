import { cn } from "@/lib/cn";

/** A project's status ("In progress", "Ongoing", "Planned") as small uppercase brand text. */
export function StatusLabel({ status, className }: { status: string; className?: string }) {
  return (
    <p className={cn("text-xs font-semibold tracking-[0.2em] text-brand-text uppercase", className)}>{status}</p>
  );
}

/** A project's tools as a row of outlined pills. */
export function StackList({ stack, label }: { stack: string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {stack.map((tech) => (
        <li key={tech} className="rounded-full border border-line px-3 py-1 text-xs text-soft">
          {tech}
        </li>
      ))}
    </ul>
  );
}
