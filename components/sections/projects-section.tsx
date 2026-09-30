import Image from "next/image";
import Link from "next/link";
import { cyberRange, projects, sectionIntros, type Project } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "@/components/ui/icons";
import { StackList, StatusLabel } from "@/components/ui/project-meta";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { YoutubeEmbed } from "@/components/youtube-embed";

const CASE_STUDY_BLOCKS = [
  { label: "Problem", text: cyberRange.problem },
  { label: "Approach", text: cyberRange.approach },
  { label: "Outcome", text: cyberRange.outcome },
] as const;

export default function ProjectsSection() {
  return (
    <section id="projects" className="border-t border-line/50 py-24 sm:py-32">
      <Container className="flex flex-col gap-16">
        <Reveal>
          <SectionHeading title="Projects" description={sectionIntros.projects} />
        </Reveal>

        <article id="cyber-range" aria-labelledby="cyber-range-heading" className="flex flex-col gap-10">
          <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="flex flex-col gap-4 lg:col-span-7">
              <StatusLabel status={cyberRange.status} />
              <h3
                id="cyber-range-heading"
                className="text-3xl font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-5xl"
              >
                {cyberRange.title}
              </h3>
            </div>
            <p className="text-base leading-7 text-muted lg:col-span-5">{cyberRange.summary}</p>
          </Reveal>

          <Reveal>
            <YoutubeEmbed
              youtubeId={cyberRange.youtubeId}
              poster={cyberRange.poster}
              title={`${cyberRange.title} demo video`}
            />
          </Reveal>

          <RevealGroup className="grid gap-10 md:grid-cols-3 md:gap-8">
            {CASE_STUDY_BLOCKS.map(({ label, text }) => (
              <RevealItem key={label} className="border-t border-line pt-6">
                <h4 className="text-sm font-semibold text-foreground">{label}</h4>
                <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="flex flex-col gap-6">
            {cyberRange.stack.length > 0 ? (
              <StackList stack={cyberRange.stack} label={`${cyberRange.title} tech stack`} />
            ) : null}

            {cyberRange.diagram ? (
              <Image
                src={cyberRange.diagram}
                alt={`${cyberRange.title} architecture diagram`}
                width={1200}
                height={675}
                className="w-full rounded-xl border border-line"
              />
            ) : null}

            {cyberRange.links.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {cyberRange.links.map(({ label, href }) => (
                  <Button key={label} href={href} external>
                    {label}
                  </Button>
                ))}
              </div>
            ) : null}
          </Reveal>
        </article>

        <RevealGroup as="ul" className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <RevealItem as="li" key={project.title} className="flex">
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex w-full flex-col gap-5 rounded-2xl border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-brand/40 hover:shadow-[0_16px_40px_-16px] hover:shadow-brand/40 motion-safe:hover:-translate-y-1 sm:p-8">
      <div className="flex flex-col gap-3">
        <StatusLabel status={project.status} />
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          {project.href ? (
            // Stretched link: its ::after covers the card, so the whole card opens the write-up.
            <Link
              href={project.href}
              className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand"
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <p className="text-sm leading-6 text-muted">{project.summary}</p>
      </div>

      <ul className="flex flex-col gap-3 text-sm leading-6 text-soft">
        {project.highlights.map((highlight) => (
          <li key={highlight} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
            <span aria-hidden="true" className="mt-2.5 h-px w-3 bg-brand" />
            {highlight}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-4 pt-2">
        <StackList stack={project.stack} label={`${project.title} tech stack`} />
        {project.links.length > 0 ? (
          <div className="relative z-10 flex flex-wrap gap-3">
            {project.links.map(({ label, href }) => (
              <Button key={label} href={href} external>
                {label}
              </Button>
            ))}
          </div>
        ) : null}
        {project.href ? (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-brand-text">
            View the full setup
            <ArrowDownIcon
              className="h-4 w-4 -rotate-90 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </p>
        ) : null}
      </div>
    </article>
  );
}
