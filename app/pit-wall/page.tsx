import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { RadioMessage } from "@/components/f1/RadioMessage";
import { socialLinks } from "@/components/layout/socialLinks";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/pitwall/ContactForm";
import { LocalClock } from "@/components/pitwall/LiveStatus";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Pit Wall Radio · Contact",
  description: "Get in touch: hiring, collaborations, or just saying hi.",
};

const STATUS = {
  open: { label: "Green flag · Open", color: "var(--sector-green)" },
  limited: { label: "Yellow flag · Limited", color: "var(--sector-yellow)" },
  closed: { label: "Red flag · Closed", color: "var(--flag-red)" },
} as const;

export default function PitWallPage() {
  const status = STATUS[profile.availability];
  const channels = socialLinks();
  return (
    <>
      <PageHeader
        sector="Pit wall"
        plain="Contact"
        title={
          <>
            Pit wall <span className="text-livery">radio</span>
          </>
        }
        subtitle="Hiring, collaborating or just saying hi? Open a channel and I'll come back on the radio."
      />

      <section className="container-race pb-12" aria-label="Contact">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Monitor: live status */}
          <Reveal className="lg:col-span-4">
            <div className="flex h-full flex-col overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900">
              <div className="flex items-center gap-3 border-b border-asphalt-700 bg-asphalt-800/60 px-5 py-3.5">
                <span aria-hidden className="live-dot size-2 rounded-full bg-livery" />
                <h2 className="label-mono font-bold text-kerb">Live status</h2>
              </div>
              <dl className="divide-y divide-asphalt-700/70">
                <div className="px-5 py-5">
                  <dt className="label-mono text-[10px] text-tyre-grey">Availability</dt>
                  <dd className="mt-2 flex items-center gap-2.5 font-display text-lg font-bold tracking-wide uppercase">
                    <span aria-hidden className="h-3.5 w-5 rounded-[1px]" style={{ background: status.color }} />
                    {status.label}
                  </dd>
                  <dd className="mt-2 text-sm text-tyre-grey">{profile.availabilityNote}</dd>
                </div>
                <div className="px-5 py-5">
                  <dt className="label-mono text-[10px] text-tyre-grey">Local time · {profile.location}</dt>
                  <dd className="mt-2 font-mono text-2xl font-bold tabular">
                    <LocalClock timezone={profile.timezone} />
                  </dd>
                </div>
                <div className="px-5 py-5">
                  <dt className="label-mono text-[10px] text-tyre-grey">Typical response</dt>
                  <dd className="mt-2 font-mono text-2xl font-bold text-green tabular">{profile.responseTime}</dd>
                </div>
              </dl>
              <div className="mt-auto border-t border-asphalt-700">
                <p className="label-mono px-5 pt-5 text-[10px] text-tyre-grey">Radio channels</p>
                <ul className="p-2">
                  {channels.map(({ label, href, icon: Icon, handle }) => (
                    <li key={label}>
                      <a
                        href={href}
                        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center gap-3 rounded-[4px] px-3 py-3 transition-colors duration-300 hover:bg-asphalt-800"
                      >
                        <span className="flex size-8 items-center justify-center rounded-full border border-asphalt-700 text-kerb/80 transition-colors group-hover:border-livery group-hover:text-kerb">
                          {Icon && <Icon size={15} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-sm font-bold tracking-wider uppercase">{label}</span>
                          <span className="block truncate text-xs text-tyre-grey">{handle}</span>
                        </span>
                        <ArrowUpRight size={15} className="text-tyre-grey transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Radio form */}
          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="relative h-full overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900">
              <div aria-hidden className="carbon absolute inset-0 opacity-50" />
              <div className="relative flex items-center justify-between border-b border-asphalt-700 bg-asphalt-800/60 px-5 py-3.5">
                <h2 className="label-mono font-bold text-kerb">Team radio · New transmission</h2>
                <span className="label-mono text-tyre-grey">CH 01</span>
              </div>
              <div className="relative grid gap-8 p-5 sm:p-8">
                <RadioMessage
                  from={profile.shortName}
                  message="Radio check. Leave your message after the beep and I'll box for it."
                  speed={24}
                />
                <ContactForm shortName={profile.shortName} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
