// content/homelab.ts
//
// Everything on the Homelab page (/projects/homelab), as typed data. Same rules as
// content/site.ts: components render this and never hard-code personal content, and
// placeholders are flagged `// TODO:`. Optional fields that are left out simply don't render,
// so a missing spec never shows up on the page as "TODO".
//
// OPSEC: this page is public and part of a security portfolio. It describes roles, design and
// reasoning only. Never add IP addresses, subnets, VLAN IDs, hostnames, internal domain names,
// port numbers or exact software versions here (see `omitted` below).

import type { PageSeo, ToolIconKey } from "@/content/site";

export type NodeKind = "router" | "hypervisor";

export interface HardwareNode {
  /** Stable id used by the topology diagram; never a real hostname. */
  id: string;
  /** Role-based display name, e.g. "Hypervisor 1". */
  name: string;
  kind: NodeKind;
  role: string;
  os: string;
  cpu?: string;
  memory?: string;
  storage?: string;
  /** What runs on the node, in plain words. */
  workloads: string[];
}

export interface NetworkSegment {
  /** Purpose-based name, e.g. "Lab". Never a VLAN ID or subnet. */
  name: string;
  purpose: string;
  contains: string[];
  /** What the segment may and may not reach. */
  rules: string;
}

export interface AccessPath {
  name: string;
  via: string;
  description: string;
}

export type LinkKind = "public" | "admin" | "internal";

export interface TopologyBox {
  id: string;
  label: string;
  detail: string;
  /** Emphasise the box that faces the internet. */
  highlight?: boolean;
}

export interface TopologyLink {
  from: string;
  to: string;
  kind: LinkKind;
  label?: string;
}

export interface Service {
  name: string;
  icon?: ToolIconKey;
  purpose: string;
  status: "Running" | "Planned";
}

export interface ServiceGroup {
  title: string;
  services: Service[];
}

export interface SecurityLayer {
  title: string;
  detail: string;
}

export interface HomelabContent {
  title: string;
  seo: PageSeo;
  status: string;
  summary: string;
  intro: string;
  /** Short facts shown under the title. The service count is added from `serviceGroups`. */
  facts: { label: string; value: string }[];
  nodes: HardwareNode[];
  segments: NetworkSegment[];
  accessPaths: AccessPath[];
  /** Top-down tiers of the topology diagram; each inner array is one row, left to right. */
  topology: { tiers: TopologyBox[][]; links: TopologyLink[] };
  serviceGroups: ServiceGroup[];
  security: SecurityLayer[];
  omitted: { items: string[]; reason: string };
  roadmap: string[];
}

export const homelab: HomelabContent = {
  title: "Homelab",
  seo: {
    title: "Zero-Trust Homelab with Proxmox and Cloudflare",
    description:
      "A four-node zero-trust homelab with no inbound ports: Proxmox VE, Docker, Cloudflare Tunnels, Tailscale and WireGuard, Authentik SSO and Pi-hole.",
    keywords: [
      "homelab",
      "zero trust",
      "Proxmox VE",
      "Cloudflare Tunnel",
      "Tailscale",
      "WireGuard",
      "self-hosted",
      "Authentik",
    ],
  },
  status: "Ongoing",
  summary:
    "The physical infrastructure behind my other projects: a four-node, zero-trust homelab with no inbound ports exposed to the internet.",
  intro:
    "Three Proxmox VE hypervisors and a dedicated OpenWrt router, with every service running in Docker. Public services go out through Cloudflare Tunnels, admin access goes over Tailscale and WireGuard, and nothing on the router is port-forwarded. It's also where the AI-driven Cyber Range runs.",
  facts: [
    { label: "Physical nodes", value: "4" },
    { label: "Inbound ports open", value: "0" },
    { label: "Remote admin", value: "Tailscale + WireGuard" },
  ],
  nodes: [
    {
      id: "router",
      name: "Edge router",
      kind: "router",
      role: "Gateway for every node",
      os: "OpenWrt",
      // TODO: add the router's hardware model / specs (cpu, memory, storage) if you want them shown
      workloads: ["Routing and firewall for the lab"],
    },
    // TODO: fill in cpu / memory / storage for each hypervisor, and confirm the workloads line
    // (the Homelab card says "Proxmox VE hypervisors on Ubuntu Server").
    {
      id: "node-1",
      name: "Hypervisor 1",
      kind: "hypervisor",
      role: "Runs the lab's VMs and containers",
      os: "Proxmox VE",
      workloads: ["Ubuntu Server guests running Docker"],
    },
    {
      id: "node-2",
      name: "Hypervisor 2",
      kind: "hypervisor",
      role: "Runs the lab's VMs and containers",
      os: "Proxmox VE",
      workloads: ["Ubuntu Server guests running Docker"],
    },
    {
      id: "node-3",
      name: "Hypervisor 3",
      kind: "hypervisor",
      role: "Runs the lab's VMs and containers",
      os: "Proxmox VE",
      workloads: ["Ubuntu Server guests running Docker"],
    },
  ],
  // TODO: add your network segments by purpose (no VLAN IDs or subnets). The table appears once
  // this has entries. Example shape:
  // { name: "Lab", purpose: "Cyber Range services", contains: ["Authentik", "Zammad"], rules: "No route to management" },
  segments: [],
  accessPaths: [
    {
      name: "Public",
      via: "Cloudflare Tunnel",
      description:
        "Visitors reach services through Cloudflare's edge. The tunnels are opened outbound from inside the lab, so the router forwards no ports and nothing listens on the WAN. Services are published across two domains I own.",
    },
    {
      name: "Admin",
      via: "Tailscale and WireGuard",
      description: "Management access goes over encrypted Tailscale and WireGuard tunnels instead of open ports.",
    },
    {
      name: "DNS",
      via: "Pi-hole",
      description: "Every device on the network resolves through Pi-hole, which filters ads, trackers and unwanted domains.",
    },
  ],
  topology: {
    tiers: [
      [
        { id: "visitors", label: "Visitors", detail: "Public internet" },
        { id: "admin-devices", label: "My devices", detail: "Remote admin" },
      ],
      [
        { id: "cloudflare", label: "Cloudflare", detail: "Edge, DNS, Tunnels", highlight: true },
        { id: "overlay", label: "Tailscale · WireGuard", detail: "Encrypted overlay" },
      ],
      [{ id: "router", label: "Edge router", detail: "OpenWrt · no port forwards" }],
      [
        { id: "node-1", label: "Hypervisor 1", detail: "Proxmox VE" },
        { id: "node-2", label: "Hypervisor 2", detail: "Proxmox VE" },
        { id: "node-3", label: "Hypervisor 3", detail: "Proxmox VE" },
      ],
      [{ id: "workloads", label: "Docker workloads", detail: "Cyber Range, core services, this site" }],
    ],
    links: [
      { from: "visitors", to: "cloudflare", kind: "public", label: "HTTPS" },
      { from: "admin-devices", to: "overlay", kind: "admin", label: "Encrypted" },
      { from: "cloudflare", to: "router", kind: "public", label: "Tunnel, outbound only" },
      { from: "overlay", to: "router", kind: "admin" },
      { from: "router", to: "node-1", kind: "internal" },
      { from: "router", to: "node-2", kind: "internal" },
      { from: "router", to: "node-3", kind: "internal" },
      { from: "node-1", to: "workloads", kind: "internal" },
      { from: "node-2", to: "workloads", kind: "internal" },
      { from: "node-3", to: "workloads", kind: "internal" },
    ],
  },
  serviceGroups: [
    {
      title: "Identity and secrets",
      services: [
        {
          name: "Authentik",
          icon: "authentik",
          purpose: "OIDC single sign-on and MFA for the lab's apps, with bulk user provisioning through its REST API.",
          status: "Running",
        },
        {
          name: "Vaultwarden",
          icon: "vaultwarden",
          purpose: "Self-hosted password manager for centralized credential management.",
          status: "Running",
        },
      ],
    },
    {
      title: "Cyber Range",
      services: [
        {
          name: "Zammad",
          purpose: "Service desk where the generated tickets land and get worked.",
          status: "Running",
        },
        {
          name: "Nextcloud",
          icon: "nextcloud",
          purpose: "Files and collaboration for the simulated company, behind Authentik SSO.",
          status: "Running",
        },
        {
          name: "Nextcloud Talk",
          icon: "nextcloud",
          purpose: "Team chat, and a second channel generated requests arrive through.",
          status: "Running",
        },
        {
          name: "n8n",
          icon: "n8n",
          purpose: "Workflows that generate employee personas and 10–15 tickets a day.",
          status: "Running",
        },
        {
          name: "Ollama",
          icon: "ollama",
          purpose: "Locally hosted language model the n8n workflows query.",
          status: "Running",
        },
      ],
    },
    {
      title: "Network and access",
      services: [
        {
          name: "Cloudflare Tunnel",
          icon: "cloudflare",
          purpose: "Outbound-only tunnels that publish services without opening a single port.",
          status: "Running",
        },
        { name: "Tailscale", icon: "tailscale", purpose: "Mesh VPN for admin access.", status: "Running" },
        { name: "WireGuard", icon: "wireguard", purpose: "Encrypted tunnels for remote access.", status: "Running" },
        { name: "Pi-hole", icon: "pihole", purpose: "Network-wide DNS filtering.", status: "Running" },
      ],
    },
    {
      title: "Platform",
      services: [
        { name: "Proxmox VE", icon: "proxmox", purpose: "Hypervisor on all three compute nodes.", status: "Running" },
        { name: "Docker", icon: "docker", purpose: "Every service runs in a container.", status: "Running" },
        { name: "Portainer", icon: "portainer", purpose: "Container management across the nodes.", status: "Running" },
        { name: "OpenWrt", icon: "openwrt", purpose: "Operating system on the dedicated edge router.", status: "Running" },
        {
          name: "This portfolio",
          icon: "nextjs",
          purpose: "Next.js in Docker, published through a Cloudflare Tunnel like everything else.",
          status: "Running",
        },
      ],
    },
    {
      title: "Detection",
      services: [
        {
          name: "Wazuh",
          purpose: "Centralized log collection, alerting and detection-rule tuning against the Cyber Range's simulated attacks.",
          status: "Planned",
        },
      ],
    },
  ],
  security: [
    {
      title: "No inbound ports",
      detail: "Every public service is reached through an outbound-only Cloudflare Tunnel. The router forwards nothing.",
    },
    {
      title: "Encrypted admin access",
      detail: "Management goes over Tailscale and WireGuard, never over ports opened to the internet.",
    },
    {
      title: "Single sign-on with MFA",
      detail: "Authentik sits in front of Nextcloud, Vaultwarden and Zammad, so there's one identity and one MFA prompt.",
    },
    {
      title: "Filtered DNS",
      detail: "Pi-hole filters DNS for every device on the network.",
    },
    {
      title: "Centralized secrets",
      detail: "Credentials are managed in a self-hosted Vaultwarden instance.",
    },
    {
      title: "Detection, next",
      detail: "Wazuh will add log collection and alerting, so the lab can be watched the way a SOC watches a real network.",
    },
  ],
  omitted: {
    items: [
      "IP addresses, subnets and VLAN IDs",
      "Hostnames and internal domain names",
      "Port numbers",
      "Exact software versions",
    ],
    reason:
      "A map of addresses and versions is free reconnaissance for anyone scanning for a way in. The design and the reasoning behind it are the interesting part, so that's what this page shows.",
  },
  // TODO: add anything else you're planning for the lab
  roadmap: [
    "Wazuh for centralized log collection, alerting and detection-rule tuning against the Cyber Range's simulated attacks.",
  ],
};

/** Services that are up now, counted for the facts strip. */
export const runningServiceCount = homelab.serviceGroups.reduce(
  (count, group) => count + group.services.filter((service) => service.status === "Running").length,
  0,
);
