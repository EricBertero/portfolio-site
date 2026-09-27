/** Joins truthy class names with a space. A minimal stand-in for `clsx`. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
