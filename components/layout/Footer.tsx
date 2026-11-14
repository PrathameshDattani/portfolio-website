import Link from "next/link";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { socials } from "@/content/socials";
import { navItems } from "@/lib/nav";
import { pad } from "@/lib/utils";
import { LocalClock } from "@/components/pitwall/LiveStatus";
import { socialLinks } from "./socialLinks";

const BUILD_DATE = new Date().toISOString().slice(0, 10);

export function Footer() {
  const links = socialLinks().filter((l) => l.label !== "Email");
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-950 pt-24">
      <div className="wrap">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow">Pit wall · open channel</p>
            <a
              href={`mailto:${socials.email}`}
              data-cursor="Write"
              className="group mt-6 inline-block text-[clamp(28px,4.4vw,64px)] leading-[1.05] font-medium tracking-[-0.03em]"
            >
              <span className="u-draw pb-1">{socials.email}</span>
            </a>
          </div>
          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="eyebrow">Index</p>
            <ul className="mt-6 grid gap-2">
              {navItems.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="group inline-flex items-baseline gap-2 text-[15px]">
                    <span className="u-draw">{n.label}</span>
                    <span className="text-xs text-muted">{n.plain}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-3">
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-6 grid gap-2">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="group text-[15px]">
                    <span className="u-draw">{label}</span> <span className="text-muted">↗</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.resumeUrl} download className="group text-[15px]">
                  <span className="u-draw">Spec sheet</span> <span className="text-muted">↓</span>
                </a>
              </li>
            </ul>
            <p className="mt-8 font-mono text-sm text-muted tabular">
              <LocalClock timezone={profile.timezone} />
            </p>
          </div>
        </div>
      </div>

      {/* oversized wordmark, cropped by the page edge */}
      <div aria-hidden className="wrap relative mt-24 select-none">
        {/* drawn as SVG so it scales to the column and stays purely decorative */}
        <svg viewBox="0 0 1000 200" className="block h-auto w-full overflow-visible" role="presentation">
          <text x="0" y="178" textLength="1000" lengthAdjust="spacingAndGlyphs" className="display" style={{ fontSize: 230, fontWeight: 800 }}>
            <tspan fill="rgba(237,237,237,0.06)">{profile.shortName} </tspan>
            <tspan fill="var(--livery)" fillOpacity="0.25">
              {pad(profile.driverNumber)}
            </tspan>
          </text>
        </svg>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          {site.showDisclaimer && <p>Fan-made, motorsport-inspired design. Not affiliated with Formula 1 or any team.</p>}
          <p className="font-mono tabular">
            © {new Date().getFullYear()} {profile.fullName} · Last updated {BUILD_DATE}
          </p>
        </div>
      </div>
    </footer>
  );
}
