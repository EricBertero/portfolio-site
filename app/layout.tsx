import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { connection } from "next/server";
import { profile } from "@/content/site";
import { MotionProvider } from "@/components/motion-provider";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${profile.name} — ${profile.title}`;
const description = `${profile.title}${profile.location ? ` based in ${profile.location}` : ""}. ${profile.tagline}`;
const [firstName, ...lastNames] = profile.name.split(" ");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  authors: [{ name: profile.name, url: siteUrl }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title,
    description,
    locale: "en_CA",
    firstName,
    lastName: lastNames.join(" "),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The CSP nonce from proxy.ts is per request, so every page must render at request time.
  await connection();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
