// Mirrors the tokens in app/globals.css for contexts that can't read CSS variables
// (next/og image generation). Keep the two in sync.
export const BRAND_COLORS = {
  background: "#0a0a0a",
  foreground: "#ededed",
  brand: "#14746f",
  muted: "#a1a1aa",
} as const;
