import type { Metadata } from "next";
import Link from "next/link";
import { phishingAnalyzer as project } from "@/content/phishing-analyzer";
import { JsonLd, PERSON_ID, absoluteUrl, personNode, projectBreadcrumb, projectMetadata } from "@/lib/seo";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "@/components/ui/icons";
import { StackList } from "@/components/ui/project-meta";
import { Reveal } from "@/components/ui/reveal";
import { HomelabToc as PageToc } from "@/components/homelab/homelab-toc";
import { DemoVideo } from "@/components/phishing-analyzer/demo-video";
import { Pipeline } from "@/components/phishing-analyzer/pipeline";
import { RiskScale, ScoreExample } from "@/components/phishing-analyzer/risk-scale";

const path = "/projects/phishing-analyzer";

export const metadata: Metadata = projectMetadata(path, project.seo);

const graph = [
  {
    "@type": "TechArticle",
    "@id": absoluteUrl(`${path}#article`),
    url: absoluteUrl(path),
    headline: project.seo.title,
    description: project.seo.description,
    keywords: project.seo.keywords.join(", "),
    image: absoluteUrl(`${path}/opengraph-image`),
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    video: { "@id": absoluteUrl(`${path}#demo`) },
  },
  {
    "@type": "VideoObject",
    "@id": absoluteUrl(`${path}#demo`),
    name: `${project.title} demo`,
    description: project.demo.caption,
    thumbnailUrl: absoluteUrl(project.demo.poster),
    contentUrl: absoluteUrl(project.demo.video),
    uploadDate: project.demo.uploadDate,
    duration: project.demo.duration,
    inLanguage: "en",
  },
  personNode(),
  projectBreadcrumb(path, project.title),
];

const SECTIONS = [
  { id: "demo", label: "Demo" },
  { id: "pipeline", label: "How it works" },
  { id: "scoring", label: "Scoring" },
  { id: "checks", label: "Checks" },
  { id: "reports", label: "Reports" },
  { id: "security", label: "Security" },
  { id: "origins", label: "Origins" },
  { id: "roadmap", label: "Roadmap" },
];

const facts = [{ label: "Status", value: project.status }, ...project.facts];

function Marker() {
  return <span aria-hidden="true" className="mt-2.5 h-px w-3 bg-brand" />;
}

export default function PhishingAnalyzerPage() {
  return (
    <>
      <JsonLd graph={graph} />
      <SiteNav home={false} />
      <main id="main-content" className="flex flex-1 flex-col">
        <header className="pt-28 sm:pt-36">
          <Container>
            <Reveal>
              <Link
                href="/#projects"
                className="group -ml-1 inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm text-muted transition-colors hover:text-foreground"
              >
                <ArrowDownIcon
                  className="h-4 w-4 rotate-90 transition-transform motion-safe:group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                Projects
              </Link>
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-4xl text-xl leading-snug font-medium tracking-[-0.01em] text-balance text-foreground sm:text-2xl">
                {project.summary}
              </p>
              <p className="mt-5 max-w-[65ch] text-base leading-7 text-muted">{project.intro}</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12 border-y border-line">
              <dl className="grid grid-cols-2 gap-x-4 sm:grid-cols-5 sm:gap-x-0 sm:divide-x sm:divide-line">
                {facts.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1.5 border-line py-5 nth-[n+3]:border-t sm:px-5 sm:first:pl-0 sm:nth-[n+3]:border-t-0"
                  >
                    <dt className="text-sm text-muted">{label}</dt>
                    <dd className="mt-auto text-base font-medium text-foreground tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.15} className="mt-8">
              <StackList stack={project.stack} label={`${project.title} tech stack`} />
            </Reveal>
          </Container>
        </header>

        <Container className="grid gap-10 pt-16 pb-24 sm:pt-20 sm:pb-32 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16">
          <PageToc sections={SECTIONS} />

          <div className="flex min-w-0 flex-col gap-24">
            <section id="demo" aria-labelledby="demo-heading" className="flex flex-col gap-8">
              <Heading id="demo-heading" title="Demo" description="The dashboard, from the overview to a finished report." />
              <Reveal>
                <DemoVideo
                  video={project.demo.video}
                  captions={project.demo.captions}
                  poster={project.demo.poster}
                  title={`${project.title} demo video`}
                  caption={project.demo.caption}
                />
              </Reveal>
            </section>

            <section id="pipeline" aria-labelledby="pipeline-heading" className="flex flex-col gap-8">
              <Heading
                id="pipeline-heading"
                title="How it works"
                description="What happens to each email between arriving in the inbox and getting its label."
              />
              <Pipeline steps={project.pipeline} after={project.pipelineAfter} />
            </section>

            <section id="scoring" aria-labelledby="scoring-heading" className="flex flex-col gap-8">
              <Heading
                id="scoring-heading"
                title="Scoring"
                description="Every finding adds points, and every point comes with its reason. The total, capped at 100, sets the level."
              />
              <RiskScale levels={project.levels} />

              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
                <ScoreExample
                  subject={project.example.subject}
                  sender={project.example.sender}
                  findings={project.example.findings}
                  note={project.example.note}
                />
                <div>
                  <h3 className="text-base font-semibold text-foreground">Always Critical</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Some findings are decisive on their own, whatever the rest of the score says:
                  </p>
                  <ul className="mt-4 flex flex-col gap-3 text-sm leading-6 text-soft">
                    {project.overrides.map((item) => (
                      <li key={item} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
                        <Marker />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section id="checks" aria-labelledby="checks-heading" className="flex flex-col gap-8">
              <Heading
                id="checks-heading"
                title="Checks"
                description="The questions it asks of every email, grouped by what they look at."
              />
              <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {project.checkGroups.map((group) => (
                  <div key={group.title} className="border-t border-line pt-5">
                    <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
                    <p className="mt-1 text-sm font-medium text-brand-text">{group.summary}</p>
                    <ul className="mt-4 flex flex-col gap-2 text-sm leading-6 text-muted">
                      {group.checks.map((check) => (
                        <li key={check} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
                          <Marker />
                          {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section id="reports" aria-labelledby="reports-heading" className="flex flex-col gap-8">
              <Heading
                id="reports-heading"
                title="Reports and dashboard"
                description="What you get to read once an email has been scored."
              />
              <dl className="grid gap-8 md:grid-cols-3">
                {project.reports.map(({ title: name, detail }) => (
                  <div key={name} className="border-t border-line pt-5">
                    <dt className="text-base font-semibold text-foreground">{name}</dt>
                    <dd className="mt-3 text-sm leading-6 text-muted">{detail}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section id="security" aria-labelledby="security-heading" className="flex flex-col gap-8">
              <Heading
                id="security-heading"
                title="Security and privacy"
                description="A tool that reads your mail has to be careful with it. These are the defaults."
              />
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {project.security.map(({ title: rule, detail }) => (
                  <li key={rule} className="border-t border-line py-5">
                    <p className="font-medium text-foreground">{rule}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{detail}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section id="origins" aria-labelledby="origins-heading" className="flex flex-col gap-8">
              <Heading id="origins-heading" title="Origins" description={project.origins.summary} />
              <div className="rounded-2xl bg-surface-2 p-6 sm:p-8">
                <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                  {project.origins.fixes.map(({ title: fix, detail }) => (
                    <li key={fix}>
                      <p className="font-medium text-foreground">{fix}</p>
                      <p className="mt-1 text-sm leading-6 text-soft">{detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="roadmap" aria-labelledby="roadmap-heading" className="flex flex-col gap-8">
              <Heading id="roadmap-heading" title="Roadmap" description="What's next for the analyzer." />
              <ul className="flex flex-col gap-3 text-base leading-7 text-soft">
                {project.roadmap.map((item) => (
                  <li key={item} className="grid max-w-[65ch] grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
                    <Marker />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button href="/#projects">See my other projects</Button>
                <Button href="/#contact" variant="solid">
                  Get in touch
                </Button>
              </div>
            </section>
          </div>
        </Container>
      </main>
      <SiteFooter home={false} />
    </>
  );
}

function Heading({ id, title, description }: { id: string; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-muted">{description}</p>
    </div>
  );
}
