import { profile } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 id="about-heading" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              About
            </h2>
            <p className="mt-8 text-2xl leading-snug font-medium tracking-[-0.02em] text-balance text-foreground sm:text-3xl sm:leading-snug">
              {profile.lead}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 max-w-md space-y-5 text-base leading-7 text-zinc-400">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:pt-16">
          <RevealGroup as="div" className="border-t border-white/10">
            <dl>
              {profile.facts.map(({ label, value }) => (
                <RevealItem
                  key={label}
                  className="grid gap-1 border-b border-white/10 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="text-sm text-zinc-400">{label}</dt>
                  <dd className="text-sm text-foreground">{value}</dd>
                </RevealItem>
              ))}
            </dl>
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
