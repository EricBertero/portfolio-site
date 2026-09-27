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

/** SVG path + the tool's own brand color (CC0, from simple-icons); named imports keep the bundle to just these. */
const TOOL_ICONS: Record<ToolIconKey, { path: string; hex: string }> = {
  authentik: siAuthentik,
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
  wireguard: siWireguard,
  zoho: siZoho,
};

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

/**
 * The tile background for a tool badge: the tool's own brand color, or a neutral dark
 * surface when that color is too close to black to read as a distinct tile.
 */
export function tileBackground(name: ToolIconKey): string {
  const hex = toolHex(name);
  return relativeLuminance(hex) < 0.03 ? "#27272a" : hex;
}

/** Black or white, whichever reads clearly on the given `#rrggbb` background. */
export function readableOn(hex: string): string {
  return relativeLuminance(hex) > 0.5 ? "#0a0a0a" : "#ffffff";
}

/** `background` at the given alpha, as `rgba()`, for a glow that matches the tile. */
export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
