import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { LiveryCard } from "@/components/f1/LiveryCard";
import { RadioMessage } from "@/components/f1/RadioMessage";
import { SectionHeader } from "@/components/f1/SectionHeader";
import { TelemetryChart } from "@/components/f1/TelemetryChart";
import { HomeHero } from "@/components/home/HomeHero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { RaceCard } from "@/components/races/RaceCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { formatRange } from "@/lib/utils";

export default function HomePage() {
  const current = experience[0];
  return (
    <>
      <HomeHero />
      <StatsStrip stats={profile.stats} />

      {/* Featured races */}
      <section className="section-y" aria-labelledby="featured">
        <div className="container-race">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeader
              sector="Sector 1"
              plain="Featured projects"
              title={<span id="featured">Featured races</span>}
              subtitle="A few of the Grands Prix I'm proudest of. Hover a card to send a car round its circuit."
            />
            <Reveal className="shrink-0">
              <Link
                href="/races"
                className="group label-mono inline-flex items-center gap-2 text-kerb/80 transition-colors hover:text-kerb"
              >
                Full race calendar
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
            </Reveal>
          </div>
          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.1} className="h-full">
                <RaceCard project={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Telemetry interlude */}
      <section aria-hidden className="container-race">
        <Reveal className="rounded-md border border-asphalt-800 bg-asphalt-900/40 p-6 sm:p-8">
          <TelemetryChart seed={profile.driverNumber} label="Lap telemetry · Speed trace" height={140} />
        </Reveal>
      </section>

      {/* Current season */}
      {current && (
        <section className="section-y" aria-labelledby="season">
          <div className="container-race grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                sector="Sector 2"
                plain="Current role"
                title={<span id="season">Current season</span>}
                subtitle="Where I'm racing right now."
              />
              <Reveal delay={0.1} className="mt-8">
                <Link
                  href="/seasons"
                  className="group label-mono inline-flex items-center gap-2 text-kerb/80 transition-colors hover:text-kerb"
                >
                  All career seasons
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </Link>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="lg:col-span-7">
              <LiveryCard color={current.color} interactive={false} className="p-7 sm:p-9">
                <div aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: current.color }} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="label-mono text-tyre-grey">{formatRange(current.start, current.end)}</span>
                  <Chip color={current.color}>{current.seat}</Chip>
                </div>
                <h3 className="mt-5 text-3xl font-black italic sm:text-4xl">{current.company}</h3>
                <p className="mt-2 font-display text-lg tracking-wide text-tyre-grey uppercase">{current.role}</p>
                <ul className="mt-6 grid gap-3">
                  {current.results.slice(0, 2).map((r, i) => (
                    <li key={r} className="flex gap-4 text-[15px] leading-relaxed text-kerb/90">
                      <span className="mt-0.5 font-mono text-xs font-bold text-livery-ink tabular">P{i + 1}</span>
                      {r}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-1.5">
                  {current.stack.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </LiveryCard>
            </Reveal>
          </div>
        </section>
      )}

      {/* Pit wall CTA */}
      <section className="container-race pb-8" aria-labelledby="cta">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900 px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
            <div aria-hidden className="carbon absolute inset-0 -z-10 opacity-70" />
            <div aria-hidden className="absolute -right-24 -bottom-24 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,var(--livery-glow),transparent)] opacity-60 blur-2xl" />
            <div aria-hidden className="livery-stripes absolute top-0 right-0 h-1.5 w-1/3 opacity-90" />
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="label-mono text-livery-ink">Sector 3 · Contact</p>
                <h2 id="cta" className="mt-5 text-4xl font-black italic sm:text-5xl lg:text-6xl">
                  Open the
                  <br />
                  pit wall radio
                </h2>
                <p className="mt-5 max-w-md text-tyre-grey">{profile.availabilityNote}</p>
                <div className="mt-8 pl-1.5">
                  <Button href="/pit-wall">Box box, let&apos;s talk</Button>
                </div>
              </div>
              <RadioMessage
                from="Pit wall"
                message={`${profile.shortName}, we're ready for you. Response time ${profile.responseTime}. Copy?`}
                speed={22}
              />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
