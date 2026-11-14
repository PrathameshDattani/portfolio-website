import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import { socialLinks } from "@/components/layout/socialLinks";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ContactForm } from "@/components/pitwall/ContactForm";
import { LocalClock } from "@/components/pitwall/LiveStatus";
import { Reveal, Rule } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Pit Wall Radio · Contact",
  description: "Get in touch: hiring, collaborations, or just saying hi.",
};

const STATUS = {
  open: { label: "Open to new seats", color: "var(--green)" },
  limited: { label: "Limited availability", color: "var(--yellow)" },
  closed: { label: "Not available right now", color: "var(--red)" },
} as const;

export default function PitWallPage() {
  const status = STATUS[profile.availability];
  const links = socialLinks().filter((l) => l.label !== "Email");
  return (
    <section className="wrap pt-[calc(var(--nav-h)+clamp(56px,10vw,140px))] pb-[clamp(96px,12vw,180px)]">
      <Reveal y={12} className="flex items-center gap-3">
        <span className="eyebrow !text-livery-ink">(06)</span>
        <span className="eyebrow">Pit wall radio — Contact</span>
      </Reveal>
      <SplitReveal as="h1" text="Let's talk." className="display mt-6 text-[clamp(64px,13vw,220px)] font-[750]" duration={1.25} />
      <Rule className="mt-[clamp(32px,5vw,64px)]" delay={0.3} />

      <div className="mt-14 grid gap-16 lg:grid-cols-12">
        <aside className="lg:col-span-4" aria-label="Status and channels">
          <Reveal className="grid gap-10">
            <div>
              <p className="eyebrow">Status</p>
              <p className="mt-3 flex items-center gap-2.5 text-[17px]">
                <span aria-hidden className="pulse-soft size-2 rounded-full" style={{ background: status.color }} />
                {status.label}
              </p>
              <p className="mt-2 text-sm text-muted">{profile.availabilityNote}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="eyebrow">Local time</p>
                <p className="mt-3 font-mono text-[17px] tabular">
                  <LocalClock timezone={profile.timezone} />
                </p>
              </div>
              <div>
                <p className="eyebrow">Replies</p>
                <p className="mt-3 font-mono text-[17px] tabular">{profile.responseTime}</p>
              </div>
            </div>
            <div>
              <p className="eyebrow">Direct</p>
              <a href={`mailto:${socials.email}`} className="group mt-3 inline-block text-[17px]">
                <span className="u-draw">{socials.email}</span>
              </a>
            </div>
            <div>
              <p className="eyebrow">Radio channels</p>
              <ul className="mt-3 grid gap-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="group text-[17px]">
                      <span className="u-draw">{l.label}</span> <span className="text-muted">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </aside>
        <Reveal delay={0.15} className="lg:col-span-7 lg:col-start-6">
          <ContactForm shortName={profile.shortName} />
        </Reveal>
      </div>
    </section>
  );
}
