import { certifications, sectionIntros } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { CertificationGrid } from "@/components/certification-grid";

export default function CertificationsSection() {
  return (
    <section id="certifications" className="border-t border-white/5 py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading title="Certifications" description={sectionIntros.certifications} />
        </Reveal>
        <CertificationGrid certifications={certifications} />
      </Container>
    </section>
  );
}
