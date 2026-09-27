import { experience, sectionIntros } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { NetworkCanvas } from "@/components/network-canvas";

export default function ExperienceSection() {
  return (
    <section id="experience" className="border-t border-white/5 py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <Reveal className="lg:col-span-7">
          <SectionHeading title="Experience" description={sectionIntros.experience} />
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <NetworkCanvas className="mx-auto block aspect-square w-full max-w-[16rem] sm:max-w-xs lg:max-w-none" />
          </div>
        </div>

        <div className="lg:col-span-7 lg:row-start-2">
          <ExperienceTimeline items={experience} />
        </div>
      </Container>
    </section>
  );
}
