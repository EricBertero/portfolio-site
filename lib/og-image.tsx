import { ImageResponse } from "next/og";
import { BRAND_COLORS } from "@/lib/brand-colors";

/** Size every social preview image is rendered at (the Open Graph / X large-card ratio). */
export const OG_SIZE = { width: 1200, height: 630 };

interface OgImageProps {
  /** Large first line: a name or a page title. */
  title: string;
  /** Teal second line. */
  subtitle: string;
  /** Muted paragraph underneath. */
  body: string;
}

/** The site's social preview card: dark, a teal rule, then title, subtitle and body. */
export function ogImage({ title, subtitle, body }: OgImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: BRAND_COLORS.background,
          color: BRAND_COLORS.foreground,
        }}
      >
        <div style={{ display: "flex", width: 96, height: 6, background: BRAND_COLORS.brand }} />
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: title.length > 20 ? 76 : 92,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 12, fontSize: 40, fontWeight: 600, color: BRAND_COLORS.brandText }}>
          {subtitle}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            maxWidth: 960,
            fontSize: 32,
            lineHeight: 1.4,
            color: BRAND_COLORS.muted,
          }}
        >
          {body}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
