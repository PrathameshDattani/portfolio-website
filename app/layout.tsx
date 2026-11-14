import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Titillium_Web } from "next/font/google";
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

const display = Titillium_Web({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-titillium",
  display: "swap",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

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

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

// Runs before paint: hide the start-lights overlay if already seen this session (no flash).
const introScript = `try{if(sessionStorage.getItem('lights-out')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('intro-seen')}catch(e){}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  jobTitle: profile.roleTitle,
  description: profile.bioShort,
  url: site.url,
  email: `mailto:${socials.email}`,
  address: { "@type": "PostalAddress", addressLocality: profile.location },
  sameAs: [socials.github, socials.linkedin, socials.x, ...(socials.other ?? []).map((o) => o.href)].filter(
    Boolean,
  ),
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
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{`.start-lights{display:none!important}[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="label-mono fixed top-3 left-3 z-[200] -translate-y-20 rounded-[3px] bg-livery px-4 py-3 text-white transition-transform focus:translate-y-0"
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
          <Script
            defer
            data-domain={site.analyticsId}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
