# syntax=docker/dockerfile:1
#
# Multi-stage build for the standalone Next.js output (next.config.ts: output: "standalone").
# Build with: docker compose build (passes SITE_URL as a build arg — see docker-compose.yml).

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# robots.ts and sitemap.ts are statically generated at build time, so SITE_URL must be
# present here — a runtime-only env var would be too late for those two routes.
ARG SITE_URL
ENV SITE_URL=${SITE_URL}
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# The app's own files stay owned by root, so the server process can read them but never
# rewrite them. Its one writable spot is Next's cache (a tmpfs in docker-compose.yml).
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN mkdir -p .next/cache && chown nextjs:nodejs .next/cache

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
