import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { connection } from "next/server";
import { homeSeo, profile } from "@/content/site";
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

const title = `${profile.name} — ${homeSeo.title}`;
const description = homeSeo.description;
const [firstName, ...lastNames] = profile.name.split(" ");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  // Project pages set their own title; the template adds the name after it.
  title: { default: title, template: `%s — ${profile.name}` },
  description,
  keywords: homeSeo.keywords,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  alternates: { canonical: "/" },
  // Let search engines show full snippets and large image and video previews.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  // Stops mobile browsers turning numbers and addresses in the text into links.
  formatDetection: { telephone: false, address: false, email: false },
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

// Browser chrome (mobile address bar etc.) matches the page background in each color scheme.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
