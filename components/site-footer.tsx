import { profile, socials } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SOCIAL_ICONS } from "@/components/ui/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-10">
      <Container className="flex flex-col items-center gap-4 text-sm text-zinc-400 sm:flex-row sm:justify-between">
        <p>
          © {year} {profile.name}. All rights reserved.
        </p>

        <ul className="flex items-center gap-1 sm:-mr-3">
          {socials.map(({ label, href, icon }) => {
            const Icon = SOCIAL_ICONS[icon];
            const external = href.startsWith("http");
            return (
              <li key={label}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-zinc-400 transition-colors hover:text-brand-text"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
    </footer>
  );
}
