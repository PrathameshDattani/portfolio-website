import Link from "next/link";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { navItems } from "@/lib/nav";
import { pad } from "@/lib/utils";
import { socialLinks } from "./socialLinks";

const BUILD_DATE = new Date().toISOString().slice(0, 10);

export function Footer() {
  const links = socialLinks();
  return (
    <footer className="relative mt-16 border-t border-asphalt-800 bg-asphalt-950">
      <div aria-hidden className="chequered h-3 w-full opacity-[0.14]" />
      <div className="container-race grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <span className="skew-speed bg-livery px-2.5 py-1.5">
              <span className="unskew-speed block font-mono text-sm font-bold text-white">
                {pad(profile.driverNumber)}
              </span>
            </span>
            <span className="font-display text-xl font-black tracking-[0.08em] uppercase">
              {profile.fullName}
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-tyre-grey">{profile.bioShort}</p>
          <a
            href={profile.resumeUrl}
            download
            className="label-mono mt-6 inline-flex items-center gap-2 text-livery-ink transition-colors hover:text-kerb"
          >
            Download spec sheet →
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label-mono text-tyre-grey">Circuit map</p>
          <ul className="mt-5 grid gap-2.5">
            {navItems.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="group inline-flex items-baseline gap-2 text-sm text-kerb/80 transition-colors hover:text-kerb">
                  <span className="font-display font-bold tracking-wider uppercase">{n.label}</span>
                  <span className="text-xs text-tyre-grey">· {n.plain}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="label-mono text-tyre-grey">Radio channels</p>
          <ul className="mt-5 grid gap-2.5">
            {links.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-3 text-sm text-kerb/80 transition-colors hover:text-kerb"
                >
                  {Icon && <Icon size={16} />}
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-asphalt-800">
        <div className="container-race flex flex-col gap-3 py-6 text-xs text-tyre-grey sm:flex-row sm:items-center sm:justify-between">
          {site.showDisclaimer && (
            <p>Fan-made, motorsport-inspired design. Not affiliated with Formula 1 or any team.</p>
          )}
          <p className="font-mono tabular">
            © {new Date().getFullYear()} {profile.fullName} · Last updated: {BUILD_DATE}
          </p>
        </div>
      </div>
    </footer>
  );
}
