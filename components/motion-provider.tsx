"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

/** Resolves once the browser is idle after load, so the features never compete with first paint. */
function whenIdle() {
  return new Promise<void>((resolve) => {
    const schedule = () =>
      "requestIdleCallback" in window ? requestIdleCallback(() => resolve(), { timeout: 1500 }) : setTimeout(resolve, 200);
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  });
}

const loadFeatures = () =>
  whenIdle()
    .then(() => import("@/components/motion-features"))
    .then((mod) => mod.default);

/**
 * Makes every `motion` animation honour the visitor's prefers-reduced-motion setting, and
 * lazy-loads the animation features so they stay out of the critical path (the hero entrance
 * is CSS, so it doesn't wait on this). `strict` makes any stray `motion.*` component (instead
 * of the slim `m.*`) throw during development.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
