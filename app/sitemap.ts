import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl.href, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/projects/homelab", siteUrl).href, changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/projects/phishing-analyzer", siteUrl).href, changeFrequency: "monthly", priority: 0.7 },
  ];
}
