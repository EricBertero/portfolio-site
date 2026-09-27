# DEPLOY.md: running the site behind a Cloudflare Tunnel

Deploys the site as a Docker container with no inbound ports ever exposed to the
internet: a `cloudflared` connector container makes an outbound-only connection to
Cloudflare's edge, which proxies public traffic to the site container over an internal
Docker network. This matches how the homelab in the site's own Projects section is run.

Any Docker host works — a VPS, a Proxmox VM/LXC, or a home server. The steps below don't
assume which.

## 0. Prerequisites

- Docker Engine + the Compose plugin installed on the host (`docker compose version`).
- A domain added to a Cloudflare account (Cloudflare doesn't need to be your registrar —
  just your DNS).
- This repo cloned onto the host.

## 1. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env` on the host:

| Variable | Value |
|---|---|
| `SITE_URL` | The real `https://` URL you're deploying to |
| `RESEND_API_KEY` | From [resend.com/api-keys](https://resend.com/api-keys) |
| `CONTACT_TO_EMAIL` | Inbox the contact form delivers to |
| `CONTACT_FROM_EMAIL` | A sender address on a domain verified in Resend |
| `TUNNEL_TOKEN` | From the tunnel you create in step 2 |

`.env` is git-ignored — it never leaves the host.

## 2. Create the Cloudflare Tunnel

1. In the Cloudflare dashboard, open **Zero Trust** (or go directly to
   [one.dash.cloudflare.com](https://one.dash.cloudflare.com)).
2. **Networks → Tunnels → Create a tunnel.**
3. Connector type: **Cloudflared** → **Next**.
4. Name it (e.g. `portfolio`) → **Save tunnel**.
5. On the "Install and run a connector" page, choose the **Docker** tab. It shows a
   command containing `--token eyJh...` — copy just that token into `TUNNEL_TOKEN` in
   `.env`. (You won't run that command directly; `docker-compose.yml` runs the same
   connector image for you.)

## 3. Build and start the stack

```bash
docker compose up -d --build
docker compose ps
```

Both containers should show as running/healthy. Back in the Zero Trust dashboard, the
tunnel's connector status should flip to **Healthy**.

## 4. Route the domain to the container

Still in the tunnel's configuration, under **Public Hostnames**:

1. **Add a public hostname.**
2. **Subdomain:** blank for the root domain, or e.g. `www`.
3. **Domain:** your domain, from the dropdown.
4. **Service → Type:** `HTTP`. **URL:** `portfolio:3000` — the Docker service name and
   port from `docker-compose.yml`, resolved over the internal `webnet` bridge network,
   never the host's network.
5. **Save hostname.**

The site should now load at your domain with a valid certificate, automatically.

## 5. Harden the Cloudflare edge

In the main dashboard for the domain:

- **SSL/TLS:** encryption mode **Full** or **Full (strict)**.
- **SSL/TLS → Edge Certificates:** enable **Always Use HTTPS** and **Automatic HTTPS
  Rewrites**.
- **Security → Bots:** enable **Bot Fight Mode**.
- **Speed → Optimization:** enable **Brotli** compression.

## 6. Verify the isolation

```bash
dig yourdomain.com +short
```

The returned addresses belong to Cloudflare's edge network, not your host — its real IP
stays hidden. On the host's own firewall/router, confirm **no** inbound ports (80, 443,
or anything else) are forwarded: every connection is initiated outbound by the
`cloudflared` container, over TLS, to Cloudflare.

## Updating a deployed site

```bash
git pull
docker compose up -d --build
```

`--build` re-runs the Dockerfile, so a new image is built and the container replaced;
`cloudflared` keeps the tunnel up throughout since it's a separate container.

## Logs

```bash
docker compose logs -f portfolio   # the Next.js server
docker compose logs -f tunnel      # the Cloudflare connector
```
