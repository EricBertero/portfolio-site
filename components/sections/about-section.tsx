import { profile } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 sm:py-32">
      <Container className="flex flex-col gap-14 sm:gap-20">
        <Reveal>
          <h2 id="about-heading" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            About
          </h2>
          <p className="mt-8 max-w-5xl text-2xl leading-snug font-medium tracking-[-0.02em] text-balance text-foreground sm:text-4xl sm:leading-snug">
            {profile.lead}
          </p>
        </Reveal>

        {/* Two balanced newspaper columns on wide screens (each ~60 characters a line). */}
        <Reveal delay={0.1} className="max-w-[62ch] text-base leading-7 text-muted lg:max-w-none lg:columns-2 lg:gap-16">
          {profile.bio.map((paragraph) => (
            <p key={paragraph} className="mb-5 last:mb-0">
              {paragraph}
            </p>
          ))}
        </Reveal>

        {/* Facts strip: stacked rows on small screens, one horizontal band of four on wide ones.
            The first column stays flush with the text above it. */}
        <Reveal delay={0.15} className="border-y border-line">
          <dl className="grid divide-y divide-line lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {profile.facts.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-2 py-6 lg:px-6 lg:first:pl-0 lg:last:pr-0">
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="text-base leading-snug text-balance text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
