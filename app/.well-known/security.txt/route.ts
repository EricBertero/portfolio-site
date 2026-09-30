import { contact } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

// RFC 9116: tells security researchers how to report a vulnerability. Generated at build time;
// it expires a year after the build, so a rebuild at least once a year keeps it valid.
export const dynamic = "force-static";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function GET() {
  const expires = new Date(Date.now() + YEAR_MS).toISOString();
  const body = [
    `Contact: mailto:${contact.email}`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Canonical: ${new URL("/.well-known/security.txt", siteUrl).href}`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
