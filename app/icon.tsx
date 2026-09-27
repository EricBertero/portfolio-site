import { ImageResponse } from "next/og";
import { profile } from "@/content/site";
import { BRAND_COLORS } from "@/lib/brand-colors";
import { getInitials } from "@/lib/initials";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          border: `2px solid ${BRAND_COLORS.brand}`,
          background: BRAND_COLORS.background,
          color: BRAND_COLORS.brand,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {getInitials(profile.name)}
      </div>
    ),
    size,
  );
}
