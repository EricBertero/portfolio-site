"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { navSections, profile, resume } from "@/content/site";
import { Container } from "@/components/ui/container";
import { CloseIcon, DownloadIcon, MenuIcon } from "@/components/ui/icons";
import { EASE_OUT_EXPO } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

const NAV_LINKS = navSections;

/** Scroll distance (px) before the bar starts hiding on scroll-down. */
const HIDE_AFTER = 240;

interface SiteNavProps {
  /**
   * True on the one-page home. Elsewhere (e.g. /projects/homelab) there's no photo hero to sit
   * over, so the bar is solid from the top and section links point back to the home page.
   */
  home?: boolean;
}

export function SiteNav({ home = true }: SiteNavProps) {
  const base = home ? "" : "/";
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(!home);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ x: number; width: number; opacity: 1 } | null>(null);
  const { scrollY, scrollYProgress } = useScroll();

  // Measure the active link so the underline can slide to it (inset by the link's px-3).
  useEffect(() => {
    const measure = () => {
      const link = activeId ? linkRefs.current[activeId] : null;
      setIndicator(link ? { x: link.offsetLeft + 12, width: link.offsetWidth - 24, opacity: 1 } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeId]);

  // Transparent over the hero, solid once past it; hide on scroll-down, show on scroll-up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const heroHeight = document.getElementById("home")?.offsetHeight ?? 0;
    setSolid(!home || y > Math.max(heroHeight - 96, 32));

    const previous = scrollY.getPrevious() ?? 0;
    const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
    if (y > previous && y > HIDE_AFTER && !menuOpen && !focusInside) setHidden(true);
    else if (y < previous) setHidden(false);
  });

  // Highlight whichever section crosses the middle of the viewport (none while in the hero).
  useEffect(() => {
    if (!home) return undefined;
    const ids = ["home", ...NAV_LINKS.map(({ id }) => id)];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const id = visible[visible.length - 1].target.id;
        setActiveId(id === "home" ? null : id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [home]);

  // Mobile overlay: lock page scroll, move focus in, close on Escape and return focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    firstMobileLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Close the overlay if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const query = window.matchMedia("(min-width: 48rem)");
    const onChange = () => query.matches && setMenuOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [menuOpen]);

  // Keep Tab cycling between the toggle and the overlay links while the menu is open.
  const onOverlayKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const links = event.currentTarget.querySelectorAll<HTMLElement>("a");
    const last = links[links.length - 1];
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      toggleRef.current?.focus();
    }
  };
  const onToggleKeyDown = (event: React.KeyboardEvent) => {
    if (!menuOpen || event.key !== "Tab") return;
    const links = document.querySelectorAll<HTMLElement>("#mobile-nav a");
    if (event.shiftKey) {
      event.preventDefault();
      links[links.length - 1]?.focus();
    } else {
      event.preventDefault();
      links[0]?.focus();
    }
  };

  const barVisible = !hidden || menuOpen;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[60] focus-visible:rounded-md focus-visible:bg-brand focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-on-brand"
      >
        Skip to content
      </a>

      <m.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-brand"
        style={{ scaleX: scrollYProgress }}
      />

      <m.header
        ref={headerRef}
        initial={false}
        animate={{ y: barVisible ? 0 : "-100%" }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        onFocusCapture={() => setHidden(false)}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          solid && !menuOpen
            ? "border-line bg-background/80 backdrop-blur-md"
            : "border-transparent bg-transparent",
          // Over the always-dark hero, the bar's text uses the dark tokens even in light mode.
          home && !solid && !menuOpen && "theme-dark",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          <a
            href={home ? "#home" : "/"}
            className="-mx-2 rounded-md px-2 py-2 text-sm font-semibold tracking-wide text-foreground transition-colors hover:text-brand-text"
          >
            {profile.name}
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="relative flex items-center gap-1 text-sm font-medium lg:gap-2">
              {NAV_LINKS.map(({ id, label }) => {
                const active = activeId === id;
                return (
                  <li key={id}>
                    <a
                      ref={(node) => {
                        linkRefs.current[id] = node;
                      }}
                      href={`${base}#${id}`}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-full px-3 transition-colors",
                        active ? "text-foreground" : "text-muted hover:text-foreground",
                      )}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
              {/* One underline that slides between links as the active section changes. */}
              <m.li
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2 left-0 h-px bg-brand"
                initial={false}
                animate={indicator ?? { opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 38 }}
              />
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={resume.href}
              download={resume.filename}
              className="hidden min-h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand-text md:inline-flex"
            >
              <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              Resume
            </a>

            <button
              ref={toggleRef}
              type="button"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground md:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? "mobile-nav" : undefined}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
              onKeyDown={onToggleKeyDown}
            >
              {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </Container>
      </m.header>

      <AnimatePresence>
        {menuOpen ? (
          <m.nav
            id="mobile-nav"
            aria-label="Primary"
            key="mobile-nav"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background px-6 pt-24 pb-10 md:hidden"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            onKeyDown={onOverlayKeyDown}
          >
            <m.ul
              className="flex flex-col"
              initial="hidden"
              animate="shown"
              variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
            >
              {NAV_LINKS.map(({ id, label }, index) => (
                <m.li
                  key={id}
                  className="border-b border-line"
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
                  }}
                >
                  <a
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                    href={`${base}#${id}`}
                    aria-current={activeId === id ? "true" : undefined}
                    className={cn(
                      "flex min-h-16 items-center text-3xl font-semibold tracking-tight transition-colors",
                      activeId === id ? "text-brand-text" : "text-foreground",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                </m.li>
              ))}
            </m.ul>

            <a
              href={resume.href}
              download={resume.filename}
              className="mt-10 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-brand px-5 text-base font-medium text-on-brand"
            >
              <DownloadIcon className="h-5 w-5" aria-hidden="true" />
              Download resume
            </a>
          </m.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
