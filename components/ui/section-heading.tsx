import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** A consistent title block used at the top of every page section. */
export function SectionHeading({ title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-base leading-7 text-muted">{description}</p> : null}
    </div>
  );
}
