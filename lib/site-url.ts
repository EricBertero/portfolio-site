// Public origin used for canonical URLs, the sitemap, robots.txt and social previews.
// TODO: set SITE_URL (e.g. https://example.com) at build time once the domain exists.
export const siteUrl = new URL(process.env.SITE_URL ?? "http://localhost:3000");
