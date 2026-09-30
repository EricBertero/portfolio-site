import type { Metadata } from "next";
import { profile, socials, type PageSeo } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

/** Absolute URL on this site, for structured data (which, unlike metadata, has no base URL). */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).href;
}

/** Stable id of the site owner in structured data, so every page points at the same person. */
export const PERSON_ID = absoluteUrl("/#person");

/**
 * Metadata for a project write-up page. The layout's title template appends the name, and the
 * page's own opengraph-image.tsx supplies the preview image.
 */
export function projectMetadata(path: string, seo: PageSeo): Metadata {
  const fullTitle = `${seo.title} — ${profile.name}`;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName: profile.name,
      locale: "en_CA",
      title: fullTitle,
      description: seo.description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: seo.description },
  };
}

/** The person every page is about or written by. */
export function personNode() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    jobTitle: profile.title,
    url: siteUrl.href,
    sameAs: socials.filter((social) => social.href.startsWith("https://")).map((social) => social.href),
  };
}

/** Home › Projects › page, for the breadcrumb trail search results can show. */
export function projectBreadcrumb(path: string, name: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl.href },
      { "@type": "ListItem", position: 2, name: "Projects", item: absoluteUrl("/#projects") },
      { "@type": "ListItem", position: 3, name, item: absoluteUrl(path) },
    ],
  };
}

/**
 * Structured data for search engines. `application/ld+json` is data, never executed, and `<` is
 * escaped so content can't close the script element early (the pattern in Next's JSON-LD guide).
 */
export function JsonLd({ graph }: { graph: object[] }) {
  const data = { "@context": "https://schema.org", "@graph": graph };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
