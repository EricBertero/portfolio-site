import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Generated at build time, so lastModified is the date of the deployed build.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl.href, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/projects/homelab", siteUrl).href, lastModified, changeFrequency: "monthly", priority: 0.7 },
    {
      url: new URL("/projects/phishing-analyzer", siteUrl).href,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      videos: [
        {
          title: "Phishing Email Analyzer demo",
          thumbnail_loc: new URL("/projects/phishing-analyzer/poster.jpg", siteUrl).href,
          description: "A one-minute tour of the Phishing Email Analyzer dashboard, recorded against generated demo data.",
          content_loc: new URL("/projects/phishing-analyzer/demo.mp4", siteUrl).href,
          duration: 60,
        },
      ],
    },
  ];
}
