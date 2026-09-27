import { ImageResponse } from "next/og";
import { profile } from "@/content/site";
import { BRAND_COLORS } from "@/lib/brand-colors";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        <div style={{ display: "flex", marginTop: 48, fontSize: 92, fontWeight: 700, letterSpacing: "-0.03em" }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", marginTop: 12, fontSize: 40, fontWeight: 600, color: BRAND_COLORS.brand }}>
          {profile.title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            maxWidth: 920,
            fontSize: 32,
            lineHeight: 1.4,
            color: BRAND_COLORS.muted,
          }}
        >
          {profile.tagline}
        </div>
      </div>
    ),
    size,
  );
}
