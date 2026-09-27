import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type ButtonAsAnchorProps = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    /** Opens in a new tab with `rel="noopener noreferrer"`. */
    external?: boolean;
  };

type ButtonAsButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export type ButtonProps = ButtonAsAnchorProps | ButtonAsButtonProps;

const BASE_CLASSES =
  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid: "bg-brand text-white hover:bg-brand/90",
  outline: "border border-white/10 text-foreground hover:border-brand hover:text-brand-text",
};

function omit<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) delete result[key];
  return result;
}

/** A link-styled button. Renders an `<a>` when `href` is given, otherwise a `<button>`. */
export function Button(props: ButtonProps) {
  const classes = cn(BASE_CLASSES, VARIANT_CLASSES[props.variant ?? "outline"], props.className);

  if ("href" in props) {
    const { href, external, target, rel, children } = props;
    const anchorRest = omit(props, [
      "variant",
      "className",
      "children",
      "href",
      "external",
      "target",
      "rel",
    ]);
    return (
      <a
        href={href}
        target={external ? "_blank" : target}
        rel={external ? "noopener noreferrer" : rel}
        className={classes}
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  const buttonRest = omit(props, ["variant", "className", "children"]);
  return (
    <button className={classes} {...buttonRest}>
      {props.children}
    </button>
  );
}
