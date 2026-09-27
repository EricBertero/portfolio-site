import { Fragment } from "react";
import { hero, profile, resume } from "@/content/site";
import { HeroPhoto } from "@/components/hero-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, DownloadIcon } from "@/components/ui/icons";

/**
 * The page's one authored entrance, in CSS so it plays from first paint without waiting for
 * JavaScript: the name rises word by word through a mask, then the copy un-blurs into place.
 * `motion-safe:` drops every keyframe under prefers-reduced-motion.
 */
const WORD_DELAY_S = 0.12;
const FIRST_WORD_S = 0.15;

export default function HeroSection() {
  const words = profile.name.split(" ");
  const afterName = FIRST_WORD_S + words.length * WORD_DELAY_S + 0.15;
  const riseDelay = (step: number) => ({ animationDelay: `${afterName + step * 0.1}s` });

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative isolate flex h-svh min-h-[36rem] flex-col overflow-hidden"
    >
      <HeroPhoto src={hero.photo} alt={hero.photoAlt} />

      <Container className="relative flex flex-1 flex-col pt-28 sm:pt-36">
        <div className="flex max-w-3xl flex-col">
          <h1 className="text-[clamp(3.25rem,10vw,6rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-foreground">
            {words.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                {index > 0 ? " " : null}
                <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <span
                    className="inline-block motion-safe:animate-hero-word"
                    style={{ animationDelay: `${FIRST_WORD_S + index * WORD_DELAY_S}s` }}
                  >
                    {word}
                  </span>
                </span>
              </Fragment>
            ))}
          </h1>

          <p className="mt-6 text-2xl font-semibold text-balance text-brand-text motion-safe:animate-hero-rise" style={riseDelay(0)}>
            {profile.title}
          </p>
          <p
            className="mt-3 max-w-xl text-base leading-7 text-zinc-200 motion-safe:animate-hero-rise sm:text-lg"
            style={riseDelay(1)}
          >
            {profile.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-hero-rise" style={riseDelay(2)}>
            <Button href={resume.href} download={resume.filename} variant="solid">
              <DownloadIcon className="h-5 w-5" aria-hidden="true" />
              Download resume
            </Button>
            <Button href="#contact" className="border-white/25 bg-background/40 backdrop-blur-sm">
              Get in touch
            </Button>
          </div>
        </div>

        <a
          href="#about"
          className="group mt-auto mb-6 inline-flex min-h-11 w-fit items-center gap-3 self-center text-xs font-medium tracking-[0.2em] text-zinc-300 uppercase transition-colors hover:text-foreground sm:self-start"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 transition-colors group-hover:border-brand">
            <ArrowDownIcon className="h-4 w-4 motion-safe:animate-nudge" aria-hidden="true" />
          </span>
          Scroll
        </a>
      </Container>
    </section>
  );
}
