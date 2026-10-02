# Eric Bertero — Portfolio

A single-page portfolio site for a cybersecurity/IT professional, built with Next.js. Hero → About → Skills → Projects → Experience → Certifications → Contact, with a working contact form, security-hardened headers, and full SEO metadata.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (configured via `@theme` in `app/globals.css` — there's no `tailwind.config.ts`)
- [`motion`](https://motion.dev) for animation, [`simple-icons`](https://simpleicons.org) for tool logos
- [Resend](https://resend.com) for contact-form email, validated server-side with [Zod](https://zod.dev)
- Deploys as a Docker container reached only through a Cloudflare Tunnel — see `DEPLOY.md`

## Getting started

Requires **Node.js 20.9 or later**.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The page hot-reloads as you edit.

### Other scripts

```bash
npm run lint      # ESLint
npm run build     # Production build
npm run start     # Serve the production build (run `build` first)
```

## Environment variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
|---|---|---|
| `SITE_URL` | No (defaults to `http://localhost:3000`) | Public origin used for canonical URLs, the sitemap, robots.txt and social preview images. Set this to the real domain in production. |
| `RESEND_API_KEY` | No in development | Resend API key for sending contact-form emails. If unset in development, submissions are logged to the server console instead of sent. **Required in production.** |
| `CONTACT_TO_EMAIL` | Required in production | Inbox that contact-form messages are delivered to. |
| `CONTACT_FROM_EMAIL` | Required in production | Sender address — must be on a domain verified with Resend, e.g. `Portfolio <contact@example.com>`. |
| `TUNNEL_TOKEN` | Deployment only | Cloudflare Tunnel token, used by `docker-compose.yml`. Not needed for local dev. |

Never commit real values — `.env.local` and `.env` are git-ignored; only `.env.example` is tracked.

## Project structure

```
app/                  Routes, layout, metadata, robots/sitemap, the contact Server Action
components/
  sections/           One component per page section (hero, about, skills, …)
  ui/                 Shared primitives (Button, Container, icons, …)
content/site.ts        All copy, links, projects, and certifications — typed, in one place
lib/                   Small shared helpers (class-name join, brand colors, …)
proxy.ts               Middleware: nonce-based Content-Security-Policy + security headers
public/                Static assets (resume, certification badges, hero photo)
```

Site content — your name, bio, skills, projects, experience, and certifications — all lives in [`content/site.ts`](content/site.ts) as typed data. Components render that data; there's no personal content hard-coded elsewhere, so updating the site's copy usually means editing just that one file.

## Security

- Strict, nonce-based CSP and standard security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP) are set in `proxy.ts` and `next.config.ts`.
- Contact-form input is validated server-side with Zod, rate-limited per IP, and includes a honeypot field.
- No third-party trackers or analytics scripts.

## Deployment

Runs as a Docker container reached only through a Cloudflare Tunnel — nothing is ever exposed to the internet directly. See [`DEPLOY.md`](DEPLOY.md) for the full runbook (creating the tunnel, `docker compose up -d --build`, edge hardening, and updates).
