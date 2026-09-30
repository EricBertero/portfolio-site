import { phishingAnalyzer } from "@/content/phishing-analyzer";
import { profile } from "@/content/site";
import { OG_SIZE, ogImage } from "@/lib/og-image";

export const alt = `${phishingAnalyzer.title} — ${profile.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogImage({
    title: phishingAnalyzer.title,
    subtitle: `A project by ${profile.name}`,
    body: phishingAnalyzer.summary,
  });
}
