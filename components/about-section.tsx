const links = [
  {
    label: "GitHub",
    href: "https://github.com/your-username",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.17.69-3.84-1.34-3.84-1.34-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.05-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.81 1.17 3.05 0 4.37-2.67 5.34-5.21 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/your-username",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    ),
  },
  {
    label: "Resume (PDF)",
    href: "/resume.pdf",
    download: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </svg>
    ),
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 px-6 py-24 sm:flex-row sm:items-start sm:gap-12"
    >
      <div
        className="h-[200px] w-[200px] shrink-0 rounded-full border border-brand/60 bg-zinc-900"
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          About Me
        </h2>

        <div className="max-w-xl space-y-4 text-base leading-7 text-zinc-400">
          <p>
            I&apos;m an IT professional focused on cybersecurity, with a
            background spanning systems administration, network defense, and
            incident response. I enjoy working across the stack, from
            hardening infrastructure and managing identity and access
            controls to investigating alerts and closing the gaps attackers
            look for.
          </p>
          <p>
            My approach blends hands-on technical work with a security-first
            mindset: threat modeling new systems before they ship, automating
            repetitive defenses, and staying current with the evolving
            landscape of vulnerabilities and attacker tradecraft. I&apos;m
            always looking for ways to make systems more resilient without
            getting in the way of the people who rely on them.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          {links.map(({ label, href, icon, download }) => (
            <a
              key={label}
              href={href}
              download={download}
              target={download ? undefined : "_blank"}
              rel={download ? undefined : "noopener noreferrer"}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              {icon}
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
