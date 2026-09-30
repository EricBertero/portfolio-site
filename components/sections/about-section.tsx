import { certifications, profile } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CertificationGrid } from "@/components/certification-grid";

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 sm:py-32">
      <Container className="flex flex-col gap-14 sm:gap-16">
        <Reveal>
          <h2 id="about-heading" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            About
          </h2>
          <p className="mt-8 max-w-5xl text-2xl leading-snug font-medium tracking-[-0.02em] text-balance text-foreground sm:text-4xl sm:leading-snug">
            {profile.lead}
          </p>
        </Reveal>

        {/* Credentials sit right under the statement; the id keeps old #certifications links landing here. */}
        <div id="certifications">
          <Reveal>
            <h3 id="certifications-heading" className="mb-6 text-xs font-medium tracking-[0.2em] text-muted uppercase">
              Certifications
            </h3>
          </Reveal>
          <CertificationGrid certifications={certifications} />
        </div>
      </Container>
    </section>
  );
}
