import { contact, socials } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/contact-form";

export default function ContactSection() {
  // External profiles (LinkedIn, GitHub); email is already shown above them.
  const profiles = socials.filter((social) => social.href.startsWith("https://"));

  return (
    <section id="contact" className="border-t border-line/50 py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading title="Contact" description={contact.intro} />
        </Reveal>

        <Reveal delay={0.1} className="grid gap-12 lg:grid-cols-[minmax(0,36rem)_16rem] lg:gap-20">
          <ContactForm
            successHeading={contact.successHeading}
            successMessage={contact.successMessage}
          />

          <aside
            aria-labelledby="contact-direct-heading"
            className="flex flex-col gap-3 border-t border-line pt-8 text-sm lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
          >
            <h3 id="contact-direct-heading" className="font-semibold text-foreground">
              Prefer email?
            </h3>
            <a
              href={`mailto:${contact.email}`}
              className="w-fit text-base text-foreground underline decoration-faint underline-offset-4 transition-colors hover:text-brand-text hover:decoration-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {contact.email}
            </a>
            {profiles.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-soft underline decoration-faint underline-offset-4 transition-colors hover:text-brand-text hover:decoration-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {label}
              </a>
            ))}
            <p className="mt-2 text-muted">{contact.responseTime}</p>
          </aside>
        </Reveal>
      </Container>
    </section>
  );
}
