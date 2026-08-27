import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Grain } from "@/components/Grain";
import { ScrollDriver } from "@/components/motion/ScrollDriver";
import { PointerProvider } from "@/components/motion/PointerProvider";
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
    "AI engineer",
    "security engineer",
    "OSINT",
    "threat intelligence",
    "machine learning",
    "full-stack developer",
    "Next.js",
    "Python",
    "portfolio",
  ],
  alternates: { canonical: "/" },
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
};

/* Runs before first paint so an explicit theme choice never flashes the wrong
   background. Kept deliberately tiny and failure-tolerant: if storage throws
   (private mode, blocked site data) the system preference simply wins. */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

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
        </PointerProvider>
        <Grain />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
