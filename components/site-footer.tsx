import { navSections, profile, socials } from "@/content/site";
import { Container } from "@/components/ui/container";
import { ArrowDownIcon, SOCIAL_ICONS } from "@/components/ui/icons";

const LINK_CLASSES =
  "inline-flex min-h-11 items-center rounded-md transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-12 text-sm text-muted">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {navSections.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className={LINK_CLASSES}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a href="#home" className={`${LINK_CLASSES} group w-fit gap-2 text-soft`}>
            <ArrowDownIcon
              className="h-4 w-4 rotate-180 transition-transform motion-safe:group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
            Back to top
          </a>
        </div>

        <div className="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>

          <ul className="-ml-3 flex items-center gap-1 sm:ml-0 sm:-mr-3">
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
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted transition-colors hover:text-brand-text"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
