import type { Metadata } from "next";
import Link from "next/link";
import { homelab, runningServiceCount } from "@/content/homelab";
import { JsonLd, PERSON_ID, absoluteUrl, personNode, projectBreadcrumb, projectMetadata } from "@/lib/seo";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { HomelabToc } from "@/components/homelab/homelab-toc";
import { TopologyDiagram } from "@/components/homelab/topology-diagram";
import { HardwareTable } from "@/components/homelab/hardware-table";
import { ServiceGroups } from "@/components/homelab/service-groups";

const path = "/projects/homelab";

export const metadata: Metadata = projectMetadata(path, homelab.seo);

const graph = [
  {
    "@type": "TechArticle",
    "@id": absoluteUrl(`${path}#article`),
    url: absoluteUrl(path),
    headline: homelab.seo.title,
    description: homelab.seo.description,
    keywords: homelab.seo.keywords.join(", "),
    image: absoluteUrl(`${path}/opengraph-image`),
    inLanguage: "en",
    author: { "@id": PERSON_ID },
  },
  personNode(),
  projectBreadcrumb(path, homelab.title),
];

const SECTIONS = [
  { id: "topology", label: "Topology" },
  { id: "hardware", label: "Hardware" },
  { id: "network", label: "Network" },
  { id: "services", label: "Services" },
  { id: "security", label: "Security" },
  { id: "roadmap", label: "Roadmap" },
];

const facts = [
  { label: "Status", value: homelab.status },
  ...homelab.facts.slice(0, 1),
  { label: "Services running", value: String(runningServiceCount) },
  ...homelab.facts.slice(1),
];

function Marker() {
  return <span aria-hidden="true" className="mt-2.5 h-px w-3 bg-brand" />;
}

export default function HomelabPage() {
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
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-6xl">
                {homelab.title}
              </h1>
              <p className="mt-6 max-w-4xl text-xl leading-snug font-medium tracking-[-0.01em] text-balance text-foreground sm:text-2xl">
                {homelab.summary}
              </p>
              <p className="mt-5 max-w-[65ch] text-base leading-7 text-muted">{homelab.intro}</p>
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
          </Container>
        </header>

        <Container className="grid gap-10 pt-16 pb-24 sm:pt-20 sm:pb-32 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16">
          <HomelabToc sections={SECTIONS} />

          <div className="flex min-w-0 flex-col gap-24">
            <section id="topology" aria-labelledby="topology-heading" className="flex flex-col gap-8">
              <Heading
                id="topology-heading"
                title="Topology"
                description="How traffic gets in, how I get in, and what sits behind the router."
              />
              <Reveal>
                <TopologyDiagram tiers={homelab.topology.tiers} links={homelab.topology.links} />
              </Reveal>
            </section>

            <section id="hardware" aria-labelledby="hardware-heading" className="flex flex-col gap-8">
              <Heading id="hardware-heading" title="Hardware" description="Four physical machines: one router and three hypervisors." />
              <HardwareTable nodes={homelab.nodes} />
            </section>

            <section id="network" aria-labelledby="network-heading" className="flex flex-col gap-8">
              <Heading
                id="network-heading"
                title="Network"
                description="Three ways into the lab, each with one job and no open ports."
              />
              <dl className="grid gap-8 md:grid-cols-3 md:gap-8">
                {homelab.accessPaths.map(({ name, via, description }) => (
                  <div key={name} className="border-t border-line pt-5">
                    <dt>
                      <span className="block text-base font-semibold text-foreground">{name}</span>
                      <span className="mt-1 block text-sm font-medium text-brand-text">{via}</span>
                    </dt>
                    <dd className="mt-3 text-sm leading-6 text-muted">{description}</dd>
                  </div>
                ))}
              </dl>

              {homelab.segments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-left text-sm">
                    <caption className="sr-only">Network segments by purpose</caption>
                    <thead>
                      <tr className="border-b border-line-strong text-muted">
                        <th scope="col" className="py-3 pr-6 font-medium">Segment</th>
                        <th scope="col" className="py-3 pr-6 font-medium">Purpose</th>
                        <th scope="col" className="py-3 pr-6 font-medium">What lives there</th>
                        <th scope="col" className="py-3 font-medium">Rules</th>
                      </tr>
                    </thead>
                    <tbody>
                      {homelab.segments.map((segment) => (
                        <tr key={segment.name} className="border-b border-line align-top">
                          <th scope="row" className="py-4 pr-6 font-medium text-foreground">{segment.name}</th>
                          <td className="py-4 pr-6 text-soft">{segment.purpose}</td>
                          <td className="py-4 pr-6 text-soft">{segment.contains.join(", ")}</td>
                          <td className="py-4 text-soft">{segment.rules}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>

            <section id="services" aria-labelledby="services-heading" className="flex flex-col gap-8">
              <Heading
                id="services-heading"
                title="Services"
                description="Everything runs in Docker. Grouped by what it's for."
              />
              <ServiceGroups groups={homelab.serviceGroups} />
            </section>

            <section id="security" aria-labelledby="security-heading" className="flex flex-col gap-8">
              <Heading id="security-heading" title="Security" description="The layers, from the edge inward." />
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {homelab.security.map(({ title: layer, detail }) => (
                  <li key={layer} className="border-t border-line py-5">
                    <p className="font-medium text-foreground">{layer}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{detail}</p>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl bg-surface-2 p-6 sm:p-8">
                <h3 className="text-base font-semibold text-foreground">What this page leaves out</h3>
                <ul className="mt-4 grid gap-2 text-sm text-soft sm:grid-cols-2">
                  {homelab.omitted.items.map((item) => (
                    <li key={item} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
                      <Marker />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 max-w-[65ch] text-sm leading-6 text-muted">{homelab.omitted.reason}</p>
              </div>
            </section>

            <section id="roadmap" aria-labelledby="roadmap-heading" className="flex flex-col gap-8">
              <Heading id="roadmap-heading" title="Roadmap" description="What's next for the lab." />
              <ul className="flex flex-col gap-3 text-base leading-7 text-soft">
                {homelab.roadmap.map((item) => (
                  <li key={item} className="grid max-w-[65ch] grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
                    <Marker />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button href="/#cyber-range">See the Cyber Range it runs</Button>
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
