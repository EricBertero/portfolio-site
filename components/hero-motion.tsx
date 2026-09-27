"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Full-bleed monochrome photo that drifts slower than the page as you scroll.
 * The load-in settle is a CSS animation (`animate-hero-photo`) so it starts at first paint.
 */
export function HeroPhoto({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div ref={ref} className="absolute inset-0 -z-10">
      <m.div className="absolute inset-0" style={{ y: reduceMotion ? 0 : y }}>
        <div className="absolute inset-0 motion-safe:animate-hero-photo">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_80%] brightness-[0.55] contrast-[1.15] grayscale"
          />
        </div>
      </m.div>

      {/* Scrims keep the nav and copy at AA contrast over the photo. They resolve to dark in both
          color schemes (the hero is a .theme-dark scope), so in light mode the hero ends in a
          clean edge against the page rather than fading the photo out to white. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-background/90 via-background/75 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 hidden w-2/3 bg-gradient-to-r from-background/60 to-transparent lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
      />
    </div>
  );
}
