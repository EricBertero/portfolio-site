import { profile } from "@/content/site";
import { OG_SIZE, ogImage } from "@/lib/og-image";

export const alt = `${profile.name} — ${profile.title}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogImage({ title: profile.name, subtitle: profile.title, body: profile.tagline });
}
