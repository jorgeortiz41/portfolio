import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Grain } from "@/components/Grain";
import { ScrollDriver } from "@/components/motion/ScrollDriver";
import { PointerProvider } from "@/components/motion/PointerProvider";
import { MagneticCursor } from "@/components/motion/MagneticCursor";
import { Companion } from "@/components/companion/Companion";
import { site, getSiteUrl } from "@/lib/site";
import "./globals.css";

/* Display face. The `wdth` and `opsz` axes are what the kinetic type animates;
   `wght` is included automatically with a variable weight. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
  variable: "--font-bricolage",
});

/* Long-form prose. Character is wrong for 2,000 words of case study. */
const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-inter",
});

/* Everything machine-y: dates, stack chips, index labels, eyebrows. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s — ${site.shortTitle}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  keywords: [
    "Jorge Ortiz",
    "software engineer",
    "software architecture",
    "systems design",
    "AI systems",
    "full-stack developer",
    "backend engineer",
    "machine learning",
    "Python",
    "TypeScript",
    "Next.js",
    "portfolio",
  ],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/intern/feed.xml" },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  // Dark is the site default, so it is the unconditional theme colour.
  themeColor: "#08080a",
};

/* Runs before first paint so an explicit light choice never flashes dark.
   Dark needs no script — it is the default in CSS. Failure-tolerant: if storage
   throws (private mode, blocked site data), the default simply stands. */
const themeScript = `(function(){try{if(localStorage.getItem("theme")==="light"){document.documentElement.setAttribute("data-theme","light");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-bg-elevated focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <ScrollDriver />
        <PointerProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <MagneticCursor />
          <Companion />
        </PointerProvider>
        <Grain />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
