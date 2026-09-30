import type { NextConfig } from "next";

// Browser features the site never uses, switched off for this page and anything it embeds.
// autoplay, encrypted-media, fullscreen and picture-in-picture are left alone: the demo video and
// the YouTube embed need them.
const DISABLED_FEATURES = [
  "accelerometer",
  "bluetooth",
  "browsing-topics",
  "camera",
  "display-capture",
  "geolocation",
  "gyroscope",
  "hid",
  "idle-detection",
  "local-fonts",
  "magnetometer",
  "microphone",
  "midi",
  "otp-credentials",
  "payment",
  "publickey-credentials-get",
  "screen-wake-lock",
  "serial",
  "usb",
  "window-management",
  "xr-spatial-tracking",
];

// The Content-Security-Policy is set per request (with a nonce) in proxy.ts.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: DISABLED_FEATURES.map((feature) => `${feature}=()`).join(", ") },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Other sites can link to these files but can't load them into their own pages.
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  // Produces .next/standalone: a self-contained server with only the deps actually used
  // (see Dockerfile), so the runtime image doesn't need node_modules or the source tree.
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // The contact form is the only Server Action: three short fields, well under 32 KB even at
      // the 5,000-character message limit. The default (1 MB) would let a bot post far more.
      bodySizeLimit: "32kb",
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Images, video and the résumé in /public aren't fingerprinted, so cache them for a day
        // (not forever) and let browsers keep showing the old copy while they re-check.
        source: "/:file*(jpg|jpeg|png|webp|avif|svg|ico|mp4|vtt|pdf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
