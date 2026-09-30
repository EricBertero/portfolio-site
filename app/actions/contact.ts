"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { contact } from "@/content/site";

export type ContactField = "name" | "email" | "message";

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      fieldErrors?: Partial<Record<ContactField, string[]>>;
      error?: string;
      /** Submitted values, echoed back so the form can repopulate after a failed attempt. */
      values?: Record<ContactField, string>;
    };

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const submissionsByIp = new Map<string, number[]>();

const SEND_FAILED = `Sorry, the message couldn't be sent. Please try again later, or email me at ${contact.email}.`;
const RATE_LIMITED = `You've reached the limit of ${RATE_LIMIT} messages an hour. Please try again later, or email me at ${contact.email}.`;

const contactSchema = z.object({
  name: z
    .string()
    .transform((value) => value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(1, "Please enter your name.")
        .max(100, "Name must be 100 characters or fewer."),
    ),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(254, "Email must be 254 characters or fewer.")
    .pipe(z.email("Please enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message must be 5,000 characters or fewer."),
});

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isRateLimited(ip: string, now: number): boolean {
  const recent = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    submissionsByIp.set(ip, recent);
    return true;
  }

  recent.push(now);
  submissionsByIp.set(ip, recent);

  // Keep the map from growing without bound on a long-running server.
  if (submissionsByIp.size > 1000) {
    for (const [key, times] of submissionsByIp) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) submissionsByIp.delete(key);
    }
  }

  return false;
}

async function clientIp(): Promise<string> {
  // The app is only reachable through the Cloudflare Tunnel (see DEPLOY.md) — never
  // directly — so CF-Connecting-IP, which Cloudflare's edge sets and a client can't
  // spoof, is trusted. X-Forwarded-For is the fallback for local dev and `npm start`.
  const requestHeaders = await headers();
  const cfConnectingIp = requestHeaders.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const forwarded = requestHeaders.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function sendContactMessage(
  _prevState: ContactResult | null,
  formData: FormData,
): Promise<ContactResult> {
  // Honeypot: bots that fill the hidden field get a fake success and no signal.
  if (field(formData, "website") !== "") {
    console.warn("[contact] Honeypot field was filled; message dropped.");
    return { ok: true };
  }

  const values = {
    name: field(formData, "name"),
    email: field(formData, "email"),
    message: field(formData, "message"),
  };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  if (isRateLimited(await clientIp(), Date.now())) {
    return { ok: false, error: RATE_LIMITED, values };
  }

  const { name, email, message } = parsed.data;
  const subject = `Portfolio contact: ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && process.env.NODE_ENV !== "production") {
    console.info(
      `[contact] RESEND_API_KEY not set; email not sent.\nSubject: ${subject}\nReply-To: ${email}\n\n${text}`,
    );
    return { ok: true };
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("[contact] Missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL.");
    return { ok: false, error: SEND_FAILED, values };
  }

  try {
    const { data, error } = await new Resend(apiKey).emails.send({ from, to, replyTo: email, subject, text });
    if (error) {
      console.error("[contact] Resend rejected the message:", error);
      return { ok: false, error: SEND_FAILED, values };
    }
    // Resend accepted it; delivery status for this id is in the Resend dashboard under Emails.
    console.info(`[contact] Accepted by Resend (id ${data?.id}).`);
  } catch (err) {
    console.error("[contact] Failed to send via Resend:", err);
    return { ok: false, error: SEND_FAILED, values };
  }

  return { ok: true };
}
