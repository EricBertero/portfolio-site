import type { SVGProps } from "react";
import {
  siAuthentik,
  siCloudflare,
  siDocker,
  siGnubash,
  siLinux,
  siN8n,
  siOpenwrt,
  siPaloaltonetworks,
  siPihole,
  siProxmox,
  siPython,
  siSplunk,
  siSumologic,
  siTailscale,
  siUbuntu,
  siWireguard,
  siZoho,
} from "simple-icons";
import type { ToolIconKey } from "@/content/site";

// Microsoft marks are no longer in simple-icons; these glyphs come from Material Design Icons
// (mdi:microsoft-windows, mdi:microsoft-azure, mdi:microsoft-azure-devops), Apache License 2.0,
// https://github.com/Templarian/MaterialDesign. Colors are Microsoft's product blues.
const MDI_WINDOWS = "M3 12V6.75l6-1.32v6.48zm17-9v8.75l-10 .15V5.21zM3 13l6 .09v6.81l-6-1.15zm17 .25V22l-10-1.91V13.1z";
const MDI_AZURE = "M13.05 4.24L6.56 18.05L2 18l5.09-8.76zm.7 1.09L22 19.76H6.74l9.3-1.66l-4.87-5.79z";
const MDI_AZURE_DEVOPS =
  "m22 18l-5 4l-8-3v3l-4.19-5.75l12.91 1.05V6.34L22 5.65zM4.81 16.25V8.96l12.91-2.62L10.6 2v2.84L3.97 6.76L2 9.38v5.69z";

/**
 * SVG path (24×24) and the tool's own brand color. simple-icons marks are CC0; named imports
 * keep the bundle to just these.
 */
const TOOL_ICONS: Record<ToolIconKey, { path: string; hex: string }> = {
  authentik: siAuthentik,
  azure: { path: MDI_AZURE, hex: "0078D4" },
  azuredevops: { path: MDI_AZURE_DEVOPS, hex: "0078D7" },
  bash: siGnubash,
  cloudflare: siCloudflare,
  docker: siDocker,
  linux: siLinux,
  n8n: siN8n,
  openwrt: siOpenwrt,
  paloalto: siPaloaltonetworks,
  pihole: siPihole,
  proxmox: siProxmox,
  python: siPython,
  splunk: siSplunk,
  sumologic: siSumologic,
  tailscale: siTailscale,
  ubuntu: siUbuntu,
  windows: { path: MDI_WINDOWS, hex: "0078D4" },
  wireguard: siWireguard,
  zoho: siZoho,
};

/** The tool's brand color as `#rrggbb`. */
export function toolHex(name: ToolIconKey): string {
  return `#${TOOL_ICONS[name].hex}`;
}

export function ToolIcon({ name, ...props }: { name: ToolIconKey } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d={TOOL_ICONS[name].path} />
    </svg>
  );
}

/** WCAG relative luminance (0–1) of a `#rrggbb` color. */
function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Black or white, whichever reads clearly on the given `#rrggbb` background. */
export function readableOn(hex: string): string {
  return relativeLuminance(hex) > 0.5 ? "#0a0a0a" : "#ffffff";
}
