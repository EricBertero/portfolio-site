"use client";

import type { ReactNode } from "react";
import { m, type Variants } from "motion/react";

/** Exponential ease-out shared by every entrance on the page. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

function fadeUpVariants(delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: 24 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay } },
  };
}

const fadeUp = fadeUpVariants();

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Fades its children up into place the first time they scroll into view.
 * Under prefers-reduced-motion (see MotionProvider) only the fade remains.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={delay ? fadeUpVariants(delay) : fadeUp}
    >
      {children}
    </m.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each child's entrance. */
  stagger?: number;
  as?: "div" | "ul" | "ol";
}

/** Staggers the entrance of its `RevealItem` children. */
export function RevealGroup({ children, className, stagger = 0.08, as = "div" }: RevealGroupProps) {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Component = m[as];
  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}
