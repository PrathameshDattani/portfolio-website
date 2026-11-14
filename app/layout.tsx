import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import type { CSSProperties, ReactNode } from "react";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { socials } from "@/content/socials";
import { theme } from "@/content/theme";
import { Footer } from "@/components/layout/Footer";
import { NavBar } from "@/components/layout/NavBar";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${profile.fullName} · ${profile.roleTitle}`,
    template: `%s | ${profile.fullName}`,
  },
  description: profile.bioShort || site.description,
  authors: [{ name: profile.fullName }],
  openGraph: {
    type: "website",
    siteName: profile.fullName,
    title: `${profile.fullName} · ${profile.roleTitle}`,
    description: profile.bioShort,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#060607", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  jobTitle: profile.roleTitle,
  description: profile.bioShort,
  url: site.url,
  email: `mailto:${socials.email}`,
  address: { "@type": "PostalAddress", addressLocality: profile.location },
  sameAs: [socials.github, socials.linkedin, socials.x, ...(socials.other ?? []).map((o) => o.href)].filter(Boolean),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      style={{ "--livery": theme.livery, "--livery-2": theme.livery2 } as CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a
          href="#main"
          className="eyebrow fixed top-3 left-3 z-[200] -translate-y-20 rounded-full bg-fg px-4 py-3 !text-ink-950 transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <NavBar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
        <div aria-hidden className="grain" />
        {site.analyticsId && (
          <Script defer data-domain={site.analyticsId} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
