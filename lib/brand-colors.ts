// Mirrors dark-mode values from app/brand.css (the ebertero-brand kit) for contexts that can't read CSS variables
// (next/og image generation). Keep the two in sync.
export const BRAND_COLORS = {
  background: "#0a0a0a",
  foreground: "#ededed",
  brand: "#14746f",
  /** Teal for text on the dark background (the brand teal itself is only 3.5:1 there). */
  brandText: "#2ea39b",
  muted: "#a1a1aa",
} as const;
