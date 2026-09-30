// content/phishing-analyzer.ts
//
// Everything on the Phishing Email Analyzer page (/projects/phishing-analyzer), as typed data.
// Same rules as content/site.ts: components render this and never hard-code personal content,
// and placeholders are flagged `// TODO:`.
//
// Every number and example here comes from the project itself (its scoring config, its test
// suite and the demo dataset the video was recorded from). The example email is synthetic.

export interface PipelineStep {
  name: string;
  detail: string;
}

export interface RiskLevel {
  name: string;
  /** Inclusive lower bound of the 0–100 score. */
  from: number;
  /** Inclusive upper bound. */
  to: number;
  outcome: string;
}

export interface ExampleFinding {
  points: number;
  finding: string;
}

export interface CheckGroup {
  title: string;
  summary: string;
  checks: string[];
}

export interface DesignNote {
  title: string;
  detail: string;
}

export interface PhishingAnalyzerContent {
  title: string;
  status: string;
  summary: string;
  intro: string;
  facts: { label: string; value: string }[];
  demo: { video: string; captions: string; poster: string; caption: string };
  pipeline: PipelineStep[];
  /** What runs after the first verdict: the sandbox loop. */
  pipelineAfter: string;
  levels: RiskLevel[];
  /** Findings that make an email Critical whatever the total. */
  overrides: string[];
  example: { subject: string; sender: string; findings: ExampleFinding[]; note: string };
  checkGroups: CheckGroup[];
  reports: DesignNote[];
  security: DesignNote[];
  origins: { summary: string; fixes: DesignNote[] };
  stack: string[];
  roadmap: string[];
}

export const phishingAnalyzer: PhishingAnalyzerContent = {
  title: "Phishing Email Analyzer",
  status: "In progress",
  summary:
    "A local service that watches a Gmail inbox, scores every new email for phishing from 0 to 100, labels it, and writes an incident report when it's Critical.",
  intro:
    "It started as a hackathon project: a desktop app that scored a batch of emails once. I rebuilt it from scratch as a service that runs on its own. Each email is checked on its authentication, sender, wording, links and attachments, cross-checked against five threat-intelligence services, and every point of its score comes with the reason it was given.",
  facts: [
    { label: "Warning signs checked", value: "40+" },
    { label: "Threat-intel sources", value: "5" },
    { label: "Automated tests", value: "351" },
    { label: "Email bodies stored", value: "None" },
  ],
  demo: {
    video: "/projects/phishing-analyzer/demo.mp4",
    captions: "/projects/phishing-analyzer/demo.vtt",
    poster: "/projects/phishing-analyzer/poster.jpg",
    caption:
      "A one-minute tour of the dashboard, recorded automatically with Playwright against generated demo data. No real mail appears on screen.",
  },
  pipeline: [
    { name: "Watch", detail: "Polls Gmail's change history, so only new mail is fetched and a restart never rescans the inbox." },
    { name: "Parse", detail: "Reads the raw message: headers, the chain of relaying servers, links and attachments." },
    { name: "Analyze", detail: "Runs the checks and threat-intel lookups concurrently, with caching and per-service rate limits." },
    { name: "Score", detail: "Adds up the weighted findings into a 0–100 score and one of five risk levels." },
    { name: "Label", detail: "Tags the email in Gmail and shows the verdict, with every reason, on the dashboard." },
    { name: "Report", detail: "For Critical emails, writes an HTML and PDF incident report with an AI-written summary." },
  ],
  pipelineAfter:
    "Attachments no service has seen before wait for approval, then go to the Hybrid Analysis sandbox. When the verdict comes back, the email is re-scored, relabelled, and reported if it has become Critical.",
  levels: [
    { name: "Clean", from: 0, to: 19, outcome: "Labelled, nothing else." },
    { name: "Low", from: 20, to: 39, outcome: "Labelled; one or two weak signs." },
    { name: "Suspicious", from: 40, to: 59, outcome: "Worth a second look." },
    { name: "High", from: 60, to: 79, outcome: "Likely phishing." },
    { name: "Critical", from: 80, to: 100, outcome: "Incident report written automatically." },
  ],
  overrides: [
    "An attachment VirusTotal engines flag as malicious",
    "A malicious verdict from the Hybrid Analysis sandbox",
    "A link that URLhaus lists as live malware",
    "A sender domain on the Spamhaus blocklist that also fails DMARC",
  ],
  example: {
    subject: "Urgent: your account has been suspended",
    sender: "PayPal Security · alert@paypal-secure-login.com",
    findings: [
      { points: 30, finding: "DMARC failed: the From domain did not authenticate this message." },
      { points: 25, finding: "The sender calls itself “PayPal Security” but sends from a domain PayPal doesn't use." },
      { points: 20, finding: "A link displays paypal.com/signin but actually points to a bare IP address." },
      { points: 15, finding: "Replies go to a different organisation than the sender." },
      { points: 15, finding: "The message asks you to verify, unlock or update account or payment details." },
      { points: 15, finding: "A link points to a raw IP address instead of a domain name." },
      { points: 10, finding: "Sent from a residential or dynamic IP address, not a real mail server." },
    ],
    note: "130 points, capped at 100: Critical. A synthetic email from the demo dataset, scored with the network lookups off.",
  },
  checkGroups: [
    {
      title: "Authentication",
      summary: "Did the sending domain vouch for this message?",
      checks: ["SPF, DKIM and DMARC results", "DKIM signatures that don't match the visible sender", "No authentication at all"],
    },
    {
      title: "Sender and headers",
      summary: "Is the sender who they claim to be?",
      checks: [
        "Brand impersonation and look-alike domains",
        "Display names that spoof another address",
        "Reply-To and Return-Path mismatches",
        "Punycode, random-looking and high-risk domains",
        "Relayed from residential or dynamic IP addresses",
      ],
    },
    {
      title: "Content",
      summary: "Does the wording follow a phishing script?",
      checks: ["Credential and payment requests", "Urgency and threats", "Prizes and giveaways", "Forms embedded in the email"],
    },
    {
      title: "Links",
      summary: "Where do the links really go?",
      checks: [
        "Link text that shows one address but opens another",
        "Raw IP addresses, URL shorteners and hidden credentials in URLs",
        "Free hosting platforms popular with phishing kits",
      ],
    },
    {
      title: "Attachments",
      summary: "Is the file what it says it is?",
      checks: [
        "Executables and scripts, including inside archives",
        "Double extensions and a real type that doesn't match the name",
        "Office macros, HTML attachments and password-protected archives",
      ],
    },
    {
      title: "Threat intelligence",
      summary: "Has anyone seen this before?",
      checks: [
        "URLhaus for known malware links and hosts",
        "Spamhaus for blocklisted sending IPs and domains",
        "AbuseIPDB for reported IP addresses",
        "VirusTotal for links and attachment hashes",
        "Hybrid Analysis sandbox for files no one has seen",
      ],
    },
  ],
  reports: [
    {
      title: "Incident reports",
      detail:
        "Every Critical email gets an HTML and PDF report: the verdict, each finding, the delivery path, and the indicators of compromise, defanged so nothing in the report is clickable.",
    },
    {
      title: "AI summary, with guardrails",
      detail:
        "Claude writes a plain-language summary and next steps. It sees the findings and a short, redacted excerpt marked as untrusted, never attachments, and identical findings are never billed twice.",
    },
    {
      title: "Local dashboard",
      detail:
        "A FastAPI dashboard with a 14-day chart by verdict, search and filters, the reasons behind every score, the sandbox approval queue, and on-demand checks of saved .eml files.",
    },
  ],
  security: [
    {
      title: "Links are never opened",
      detail: "Reputation checks are lookups only, so a one-time phishing link or tracking pixel is never triggered.",
    },
    {
      title: "Sandbox uploads are opt-in",
      detail:
        "Uploading a file makes it visible to other sandbox users, so uploads are off by default and each one can require approval. Hash lookups stay private.",
    },
    {
      title: "Minimal data kept",
      detail: "The database holds headers, scores and findings. Message bodies and attachments are never stored.",
    },
    {
      title: "Least-privilege Gmail access",
      detail: "One scope, to read mail and change labels. It can't send or delete anything.",
    },
    {
      title: "A dashboard that stays local",
      detail:
        "Bound to this computer only, with a Host allowlist against DNS rebinding, CSRF tokens and Origin checks on every action, and a strict Content-Security-Policy.",
    },
    {
      title: "Built to fail safe",
      detail:
        "If a service is down or rate-limited, the email is marked partial and re-checked later rather than skipped. Its place in the inbox only moves forward once every new message has been fetched.",
    },
  ],
  origins: {
    summary:
      "The hackathon version was a Tkinter app that scored an inbox once. Rebuilding it meant fixing what made its scores unreliable:",
    fixes: [
      {
        title: "Authentication parsed properly",
        detail: "The prototype's SPF check could never pass, so every email lost points for it.",
      },
      {
        title: "Words, not substrings",
        detail: "Keywords like “user” or “update” matched inside other words and flagged nearly everything. Phrases are now weighted and matched on word boundaries.",
      },
      {
        title: "Every attachment checked",
        detail: "Only the last file in an email used to be inspected. Now each one is, by its real file type as well as its name.",
      },
      {
        title: "Outages don't crash it",
        detail: "A failed lookup used to stop the scan. Now it's recorded as unavailable and retried.",
      },
    ],
  },
  stack: [
    "Python",
    "Gmail API",
    "FastAPI",
    "SQLite",
    "Claude API",
    "VirusTotal",
    "Hybrid Analysis",
    "URLhaus",
    "Spamhaus",
    "AbuseIPDB",
    "pytest",
    "GitHub Actions",
    "Playwright",
  ],
  // TODO: confirm or reword these; they come from the project plan
  roadmap: [
    "Package it as a Docker container and run it on the homelab, watching the inbox around the clock.",
    "Replace the test fixtures with synthetic emails so the repository can be made public.",
  ],
};
