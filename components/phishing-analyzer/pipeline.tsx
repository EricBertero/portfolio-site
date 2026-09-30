import type { PipelineStep } from "@/content/phishing-analyzer";

/**
 * The scan pipeline as an ordered list: a vertical track on small screens, two rows of three on
 * wide ones. The track and the list order carry the sequence, so the steps aren't numbered.
 */
export function Pipeline({ steps, after }: { steps: PipelineStep[]; after: string }) {
  return (
    <div className="flex flex-col gap-10">
      <ol className="grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
        {steps.map((step) => (
          <li
            key={step.name}
            className="relative border-l border-line pb-9 pl-7 last:border-l-transparent last:pb-0 lg:border-t lg:border-l-0 lg:pt-6 lg:pb-0 lg:pl-0 lg:last:border-l-0"
          >
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-brand ring-4 ring-background lg:-top-[5px] lg:left-0"
            />
            <h3 className="text-lg font-semibold tracking-tight text-foreground">{step.name}</h3>
            <p className="mt-2 max-w-[42ch] text-sm leading-6 text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>

      <div className="flex gap-4 rounded-2xl bg-surface-2 p-6 sm:p-8">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 shrink-0 text-brand-text"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
          <path d="M4 3v5h5" />
          <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
          <path d="M20 21v-5h-5" />
        </svg>
        <div>
          <h3 className="text-base font-semibold text-foreground">Then, for unknown attachments</h3>
          <p className="mt-2 max-w-[65ch] text-sm leading-6 text-soft">{after}</p>
        </div>
      </div>
    </div>
  );
}
