import { homelab } from "@/content/homelab";
import { profile } from "@/content/site";
import { OG_SIZE, ogImage } from "@/lib/og-image";

export const alt = `${homelab.title} — ${profile.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogImage({ title: homelab.title, subtitle: `A project by ${profile.name}`, body: homelab.summary });
}
