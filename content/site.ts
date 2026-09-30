// content/site.ts
//
// All copy, links, certifications and project details for the site live
// here as typed data (see CLAUDE.md: "Content is data"). Components render
// this data and never hard-code personal content. Fields still holding
// placeholder content are flagged with a `// TODO:` comment so they can be
// found with a search; see the "Open items / owner TODO" list in PLAN.md.

export type SocialIconName = "github" | "linkedin" | "email" | "x";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconName;
}

/** Tools with an openly licensed glyph; see components/ui/tool-icons.tsx. */
export type ToolIconKey =
  | "authentik"
  | "azure"
  | "azuredevops"
  | "bash"
  | "cloudflare"
  | "docker"
  | "linux"
  | "microsoft"
  | "n8n"
  | "nextcloud"
  | "nextjs"
  | "ollama"
  | "openwrt"
  | "paloalto"
  | "pihole"
  | "portainer"
  | "proxmox"
  | "python"
  | "splunk"
  | "sumologic"
  | "tailscale"
  | "ubuntu"
  | "vaultwarden"
  | "windows"
  | "wireguard"
  | "zoho";

/**
 * A tile in the skill stack. It shows, in order of preference: `logo` (an official SVG file),
 * `icon` (a bundled glyph), or the name as a wordmark. The tile is filled with `color`, or
 * the icon's own brand color when `color` is omitted.
 */
export interface SkillBadge {
  name: string;
  icon?: ToolIconKey;
  /** Brand color as `#rrggbb`; required when there's no `icon`. */
  color?: string;
  /** Path to an official logo SVG under /public, e.g. "/logos/crowdstrike.svg". */
  logo?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  summary: string;
  groups: { title: string; items: string[] }[];
  /**
   * Tools shown as tiles in the skill stack grid. A `// TODO: logo` badge is a brand-color
   * wordmark until an official SVG is added under /public/logos and set as its `logo`.
   */
  badges: SkillBadge[];
}

export interface HeroContent {
  photo: string;
  photoAlt: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  title: string;
  status: string;
  summary: string;
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
  /** Internal page with the full write-up; makes the whole card a link to it. */
  href?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  team?: string;
  periods: string[];
  highlights: string[];
  tags: string[];
}

export interface Resume {
  href: string;
  filename: string;
}

export interface CyberRangeContent {
  title: string;
  status: string;
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
  youtubeId: string | null;
  /** Local image path, e.g. "/cyber-range/poster.png" */
  poster: string;
  links: ProjectLink[];
  /** Local image path, or null if no diagram exists yet */
  diagram: string | null;
}

export interface Certification {
  name: string;
  issuer: string;
  /** Omitted when `inProgress` is true. */
  year?: number;
  /** True when the credential is still being worked toward (shown instead of a year). */
  inProgress?: boolean;
  /** Local image path, e.g. "/badges/comptia-security-plus.png", or null for a generic placeholder badge. */
  badge: string | null;
  verifyUrl?: string;
  /** Code a visitor enters at `verifyUrl` when the issuer has no per-credential link. */
  verifyCode?: string;
}

export interface ContactContent {
  intro: string;
  /** Shown as a visible mailto link beside the form and used as the fallback in error messages. */
  email: string;
  responseTime: string;
  successHeading: string;
  successMessage: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location?: string;
  /** The About section's statement, set large above the certifications. */
  lead: string;
}

/**
 * What search engines and link previews see for a page. `title` is the page's own part (the
 * layout appends the name); keep it under ~60 characters with the name, and `description`
 * under ~160, or search results cut them off. Six to ten `keywords`: the terms someone would
 * actually search for, never a stuffed list.
 */
export interface PageSeo {
  title: string;
  description: string;
  keywords: string[];
}

export const profile: Profile = {
  name: "Eric Bertero",
  title: "Junior Cybersecurity Analyst · Security Operations",
  tagline:
    "Watching for threats, digging into what's actually going on, and closing the gaps before they turn into incidents.",
  location: "Oakville, ON",
  lead: "I'm a junior cybersecurity analyst who's happiest in the weeds of security operations: triaging alerts, investigating phishing attempts, tracking down vulnerabilities, and running SOC 2 access reviews.", // TODO: owner is rewording this
};

/** The home page in search results. Its title is used as is, with the name in front. */
export const homeSeo: PageSeo = {
  title: "Junior Cybersecurity Analyst (SOC)",
  description:
    "Eric Bertero, junior cybersecurity analyst in Oakville, Ontario: SOC alert triage, phishing investigation, vulnerability management and security projects.",
  keywords: [
    "Eric Bertero",
    "cybersecurity analyst",
    "SOC analyst",
    "security operations",
    "phishing investigation",
    "vulnerability management",
    "Oakville Ontario",
    "cybersecurity portfolio",
  ],
};

export const hero: HeroContent = {
  photo: "/hero/empire-state.jpg",
  photoAlt:
    "Eric Bertero on the Empire State Building observation deck, with the Manhattan skyline and East River behind the safety fence.",
};

export const skillCategories: SkillCategory[] = [
  {
    id: "it-operations",
    title: "IT Operations, Service Desk & Infrastructure",
    summary: "Keeping users productive and systems documented, from ticket intake to hardware lifecycle.",
    groups: [
      { title: "Ticketing & ITSM", items: ["ServiceNow", "Zoho Help Desk", "SLA adherence"] },
      {
        title: "Operating Systems & Administration",
        items: ["Windows 10/11", "Windows Server 2025", "Ubuntu Server", "Linux CLI", "OS imaging and deployment"],
      },
      {
        title: "Support & Hardware",
        items: [
          "Remote and on-site troubleshooting",
          "User onboarding and offboarding",
          "Hardware lifecycle and inventory management",
          "Printers and peripherals",
          "Conference-room A/V technology",
        ],
      },
      {
        title: "Documentation & Governance",
        items: ["SOP and knowledge-base documentation", "SOC 2 access reviews"],
      },
    ],
    badges: [
      { name: "ServiceNow", color: "#62D84E" }, // TODO: logo
      { name: "Zoho Desk", icon: "zoho" },
      { name: "Windows", icon: "windows" },
      { name: "Ubuntu", icon: "ubuntu" },
      { name: "Linux", icon: "linux" },
    ],
  },
  {
    id: "systems-identity",
    title: "Systems, Identity & Virtualization",
    summary: "Directory services, single sign-on, and the hypervisors and containers underneath.",
    groups: [
      {
        title: "Identity & Access Management (IAM)",
        items: ["Active Directory", "Microsoft Entra ID", "Microsoft Intune", "Authentik (OIDC, SSO/MFA)"],
      },
      { title: "Virtualization, Storage & Containers", items: ["Proxmox VE", "Docker", "RAID configuration"] },
    ],
    badges: [
      { name: "Microsoft 365", icon: "microsoft" },
      { name: "Entra ID", color: "#0078D4" }, // TODO: logo
      { name: "Intune", color: "#0078D4" }, // TODO: logo
      { name: "Authentik", icon: "authentik" },
      { name: "Proxmox", icon: "proxmox" },
      { name: "Docker", icon: "docker" },
    ],
  },
  {
    id: "networking",
    title: "Networking, Firewalls & Cloud",
    summary: "Zero-trust access, overlay networks, and the physical layer they run on.",
    groups: [
      { title: "Cloud Platforms", items: ["Microsoft Azure"] },
      { title: "Network Administration & Protocols", items: ["Network troubleshooting", "DNS", "VPN administration"] },
      {
        title: "Zero Trust, Overlays & Edge",
        items: ["Cloudflare (Zero Trust Tunnels, DNS)", "WireGuard", "Tailscale", "Pi-hole (DNS filtering)", "OpenWrt"],
      },
      {
        title: "Firewalls & Physical Infrastructure",
        items: ["Next-generation firewall evaluation (Palo Alto)", "Structured cabling and server-rack installation"],
      },
    ],
    badges: [
      { name: "Azure", icon: "azure" },
      { name: "Cloudflare", icon: "cloudflare" },
      { name: "WireGuard", icon: "wireguard" },
      { name: "Tailscale", icon: "tailscale" },
      { name: "Pi-hole", icon: "pihole" },
      { name: "OpenWrt", icon: "openwrt" },
      { name: "Palo Alto", icon: "paloalto" },
    ],
  },
  {
    id: "security-operations",
    title: "Cybersecurity & Security Operations",
    summary: "Detecting, investigating, and hardening against threats across endpoints, logs, and email.",
    groups: [
      { title: "Endpoint & Threat Hunting", items: ["CrowdStrike Falcon (EDR)", "FlareVM", "IOC threat hunting"] },
      { title: "SIEM & Log Analytics", items: ["Splunk Enterprise", "Sumo Logic (SIEM)"] },
      {
        title: "Vulnerability & System Defense",
        items: ["Tenable Nessus", "Vulnerability management", "System hardening and security baselines"],
      },
      {
        title: "Email & Phishing Security",
        items: [
          "Phishing investigation",
          "Email header analysis (SPF, DKIM, DMARC)",
          "Mimecast",
          "End-user security awareness training",
        ],
      },
    ],
    badges: [
      { name: "CrowdStrike", color: "#EC0000" }, // TODO: logo
      { name: "Splunk", icon: "splunk" },
      { name: "Sumo Logic", icon: "sumologic" },
      { name: "Tenable", color: "#E7FF00" }, // TODO: logo
      { name: "Mimecast", color: "#000129" }, // TODO: logo
      { name: "FlareVM", color: "#1AE86A" }, // TODO: logo
    ],
  },
  {
    id: "automation",
    title: "Scripting, Automation & DevOps",
    summary: "Turning recurring security and IT work into scripts, integrations, and workflows.",
    groups: [
      { title: "Languages & Scripting", items: ["Python", "Bash"] },
      { title: "APIs, Integration & Workflows", items: ["REST API integrations", "n8n workflow orchestration"] },
      { title: "CI/CD & DevOps", items: ["Azure DevOps"] },
    ],
    badges: [
      { name: "Python", icon: "python" },
      { name: "Bash", icon: "bash" },
      { name: "n8n", icon: "n8n" },
      { name: "Azure DevOps", icon: "azuredevops" },
    ],
  },
];

/** Page sections in order, as linked from the nav and the footer (ids match the section anchors). */
export const navSections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/** Intro line under each section heading. */
export const sectionIntros = {
  skills: "Five areas, from the service desk to the SOC. Open one to see the tools and skills behind it.",
  projects: "What I build outside of work to practise detection, response, and secure infrastructure.",
  experience: "Two co-op placements across IT support and security operations.",
} as const;

/** The skill category open when the page loads. */
export const defaultSkillCategory = "security-operations";

export const socials: SocialLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com/in/ericbertero", icon: "linkedin" },
  { label: "Email", href: "mailto:eric@ebertero.com", icon: "email" },
  // TODO: add a GitHub link here if/when one should be public
];

export const resume: Resume = {
  href: "/resume.pdf",
  filename: "Eric_Bertero_Resume.pdf",
};

export const cyberRange: CyberRangeContent = {
  title: "AI-Driven Cyber Range",
  status: "In progress",
  summary:
    "An autonomous corporate IT simulator that generates its own users, tickets, and incidents for hands-on detection-and-response and identity administration practice.",
  problem:
    "I wanted a realistic environment to practice SOC and service-desk work without waiting for real incidents — one that generates its own tickets and identities instead of relying on canned tutorials.",
  approach:
    "I'm building an autonomous training environment that simulates a 50-100 user company across 4 physical nodes and 8+ containerized services. Authentik provides OIDC single sign-on and MFA across Nextcloud, Vaultwarden, and a Zammad service desk, with bulk user provisioning through its REST API. n8n workflows query a locally hosted Ollama model to generate realistic employee personas and 10-15 tickets a day across four scenario categories — credential resets, shared-resource access requests, phishing reports, and software faults — delivered through the Zammad and Nextcloud Talk APIs.",
  outcome:
    "Every generated scenario demands real remediation: group and ACL troubleshooting, investigating suspicious email against DNS and endpoint logs, and privileged credential provisioning — reproducing the daily workflow of a service desk and a SOC. Next up is integrating Wazuh for centralized log collection, alerting, and detection-rule tuning against the simulated attacks.",
  stack: ["Authentik (OIDC)", "n8n", "Ollama", "Zammad", "Docker", "Proxmox VE"],
  youtubeId: null, // TODO: set once a demo video is recorded
  poster: "/cyber-range/poster.png", // TODO: replace with a real poster screenshot in /public/cyber-range
  links: [], // TODO: add a repo/write-up link if one becomes public
  diagram: null, // TODO: add an architecture diagram image if available
};

export const projects: Project[] = [
  {
    title: "Homelab",
    status: "Ongoing",
    summary:
      "The physical infrastructure behind my other projects: a four-node, zero-trust homelab with no inbound ports exposed to the internet.",
    highlights: [
      "Three Proxmox VE hypervisors on Ubuntu Server and a dedicated OpenWrt router, with every service running in Docker and managed through Portainer.",
      "Services published across two owned domains through Cloudflare Tunnels, with no port-forwarding or direct WAN exposure; admin access over Tailscale and WireGuard.",
      "Network-wide DNS filtering with Pi-hole and centralized credential management in a self-hosted Vaultwarden instance.",
    ],
    stack: ["Proxmox VE", "Docker", "Cloudflare Zero Trust", "OpenWrt", "Tailscale", "WireGuard", "Pi-hole"],
    links: [],
    href: "/projects/homelab",
  },
  {
    title: "Phishing Email Analyzer",
    status: "In progress",
    summary:
      "A local service that watches a Gmail inbox, scores every new email for phishing from 0 to 100, labels it, and writes an incident report when it's Critical.",
    highlights: [
      "40+ checks across authentication (SPF, DKIM, DMARC), sender spoofing, wording, links and attachments, each explaining the points it adds.",
      "Cross-checks links, IPs and attachment hashes against URLhaus, Spamhaus, AbuseIPDB and VirusTotal, with opt-in Hybrid Analysis sandboxing.",
      "HTML/PDF incident reports with a Claude-written summary, and a local FastAPI dashboard locked down against DNS rebinding and CSRF.",
    ],
    stack: ["Python", "Gmail API", "FastAPI", "SQLite", "Claude API", "VirusTotal"],
    links: [], // TODO: add a repo link if one becomes public
    href: "/projects/phishing-analyzer",
  },
];

export const experience: ExperienceItem[] = [
  {
    role: "IT Support Specialist (Co-op)",
    company: "United Van Lines",
    location: "Mississauga, ON",
    periods: ["Apr 2026 – Aug 2026", "Sept 2024 – Jan 2025"],
    highlights: [
      "Ran user access reviews across ~100 employee accounts for a SOC 2 audit, flagging stale accounts and excessive permissions and compiling evidence for auditors.",
      "Investigated phishing, managed quarantined email, and built a company-wide security awareness program delivered to 100 employees.",
      "Evaluated Palo Alto next-generation firewalls and Splunk with leadership, and led a 100-user migration to Foxit at a 50% licensing saving.",
      "Enrolled devices in Intune and deployed 50+ Windows 11 workstations; racked a server, configured RAID 6, and deployed Windows Server 2025.",
    ],
    tags: ["SOC 2", "Intune", "Windows Server 2025", "Phishing response"],
  },
  {
    role: "Jr. Security Administrator (Co-op)",
    company: "MCAP",
    location: "Waterloo, ON",
    team: "Security Operations team",
    periods: ["Jan 2025 – Apr 2025"],
    highlights: [
      "Monitored CrowdStrike Falcon, Tenable Nessus, Mimecast, and Sumo Logic daily for threat detection, vulnerability scanning, and incident response.",
      "Built scheduled CrowdStrike searches and Sumo Logic lookup-table queries for proactive IOC threat hunting.",
      "Automated quarterly system-hardening audits in Python through the Azure DevOps API, calculating compliance across operating systems.",
      "Investigated phishing alerts by detonating artifacts in an isolated FlareVM environment, escalating confirmed incidents.",
    ],
    tags: ["CrowdStrike Falcon", "Sumo Logic", "Tenable Nessus", "Python"],
  },
];

export const certifications: Certification[] = [
  {
    name: "CompTIA CySA+",
    issuer: "CompTIA",
    year: 2025,
    badge: "/badges/comptia-cysa-plus.png",
    verifyUrl: "https://verify.comptia.org",
    verifyCode: "7Q0C0VE542VQSK0J",
  },
  {
    name: "CompTIA Security+",
    issuer: "CompTIA",
    year: 2024,
    badge: "/badges/comptia-security-plus.png",
    verifyUrl: "https://verify.comptia.org",
    verifyCode: "LC53F1363NQ1QEWF",
  },
  {
    name: "Prompt Engineering for ChatGPT",
    issuer: "Vanderbilt University (Coursera)",
    year: 2026,
    badge: "/badges/coursera-prompt-engineering.png",
    verifyUrl: "https://coursera.org/verify/K6MQ5MJUGMVK",
  },
  { name: "Splunk Core Certified Power User", issuer: "Splunk", inProgress: true, badge: null }, // TODO: add a badge image and verification link once earned
];

export const contact: ContactContent = {
  intro: "Hiring for a SOC or security role, or have a question about my work? Send a message below.",
  email: "eric@ebertero.com",
  responseTime: "I usually reply within a few days.",
  successHeading: "Message sent",
  successMessage: "Thanks for reaching out. I'll get back to you within a few days.",
};
