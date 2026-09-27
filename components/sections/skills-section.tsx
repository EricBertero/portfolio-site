import { defaultSkillCategory, sectionIntros, skillCategories } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { SkillsExplorer } from "@/components/skills-explorer";

export default function SkillsSection() {
  return (
    <section id="skills" className="border-t border-line/50 py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading title="Skills" description={sectionIntros.skills} />
        </Reveal>
        <Reveal delay={0.1}>
          <SkillsExplorer categories={skillCategories} defaultOpenId={defaultSkillCategory} />
        </Reveal>
      </Container>
    </section>
  );
}
