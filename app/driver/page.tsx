import type { Metadata } from "next";
import Image from "next/image";
import { education } from "@/content/education";
import { profile } from "@/content/profile";
import { CountUp } from "@/components/f1/CountUp";
import { LiveryCard } from "@/components/f1/LiveryCard";
import { SectionHeader, SectorLabel } from "@/components/f1/SectionHeader";
import { Helmet } from "@/components/driver/Helmet";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Driver Profile · About",
  description: profile.bioShort,
};

const availability = {
  open: { label: "Available", color: "var(--sector-green)" },
  limited: { label: "Limited availability", color: "var(--sector-yellow)" },
  closed: { label: "Not available", color: "var(--flag-red)" },
} as const;

export default function DriverPage() {
  const avail = availability[profile.availability];
  return (
    <>
      {/* Driver card */}
      <section className="relative isolate overflow-hidden pt-[calc(var(--nav-h)+56px)] pb-20 lg:pt-[calc(var(--nav-h)+88px)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_30%_10%,black,transparent)]" />
          <span className="text-outline absolute -top-10 right-[-3vw] font-display text-[40vw] leading-none font-black italic lg:text-[28vw]">
            {pad(profile.driverNumber)}
          </span>
        </div>
        <div className="container-race grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto max-w-[420px]">
              <div
                className="relative overflow-hidden border border-asphalt-700 bg-asphalt-900"
                style={{ clipPath: "polygon(0 0, 88% 0, 100% 9%, 100% 100%, 12% 100%, 0 91%)" }}
              >
                <div aria-hidden className="carbon absolute inset-0" />
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--livery-glow),transparent_65%)] opacity-50" />
                <div className="relative aspect-[4/5]">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={`Portrait of ${profile.fullName}`}
                      fill
                      sizes="(min-width: 1024px) 420px, 90vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-10">
                      <Helmet number={profile.driverNumber} code={profile.shortName} />
                    </div>
                  )}
                  {/* visor tint band */}
                  <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-asphalt-950/70 to-transparent" />
                </div>
                <div className="relative flex items-center justify-between border-t border-asphalt-700 bg-asphalt-950/80 py-3 pr-6 pl-12">
                  <span className="label-mono text-tyre-grey">Car</span>
                  <span className="font-mono text-lg font-bold tabular">{pad(profile.driverNumber)}</span>
                  <span className="label-mono text-tyre-grey">Code</span>
                  <span className="font-display text-lg font-black tracking-[0.15em]">{profile.shortName}</span>
                </div>
              </div>
              <div aria-hidden className="livery-stripes absolute -bottom-3 left-8 h-1.5 w-32" />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <SectionHeader
              as="h1"
              sector="Driver profile"
              plain="About me"
              title={
                <>
                  {profile.fullName.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="text-livery">{profile.fullName.split(" ").slice(-1)}</span>
                </>
              }
              subtitle={profile.bioShort}
            />
            <Reveal delay={0.15}>
              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-700 sm:grid-cols-4">
                {[
                  ["Team", profile.teamName],
                  ["Seat", profile.roleTitle],
                  ["Home circuit", `${profile.locationFlag} ${profile.location}`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-asphalt-900 px-4 py-4">
                    <dt className="label-mono text-[10px] text-tyre-grey">{k}</dt>
                    <dd className="mt-2 font-display text-[15px] leading-tight font-bold tracking-wide uppercase">{v}</dd>
                  </div>
                ))}
                <div className="bg-asphalt-900 px-4 py-4">
                  <dt className="label-mono text-[10px] text-tyre-grey">Status</dt>
                  <dd className="mt-2 flex items-center gap-2 font-display text-[15px] leading-tight font-bold tracking-wide uppercase">
                    <span aria-hidden className="live-dot size-2 rounded-full" style={{ background: avail.color }} />
                    {avail.label}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Driver stats */}
      <section className="container-race" aria-labelledby="stats">
        <Reveal className="overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900">
          <div className="flex items-center justify-between border-b border-asphalt-700 bg-asphalt-800/60 px-5 py-3.5">
            <h2 id="stats" className="label-mono font-bold text-kerb">
              Driver stats
            </h2>
            <span className="label-mono text-tyre-grey">Career to date</span>
          </div>
          <dl className="grid grid-cols-2 gap-px bg-asphalt-700/70 md:grid-cols-3">
            {profile.driverStats.map((s) => (
              <div key={s.label} className="bg-asphalt-900 px-5 py-7 sm:px-7">
                <dt className="flex flex-col gap-1">
                  <span className="label-mono text-livery-ink">{s.f1Label ?? s.label}</span>
                  <span className="text-xs text-tyre-grey">{s.label}</span>
                </dt>
                <dd className="mt-4 font-mono text-4xl font-bold tabular sm:text-5xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Bio + highlights */}
      <section className="section-y container-race grid gap-16 lg:grid-cols-12" aria-labelledby="story">
        <div className="lg:col-span-7">
          <SectionHeader sector="Sector 1" plain="Biography" title={<span id="story">The story so far</span>} />
          <Reveal delay={0.1} className="mt-8 space-y-5 text-[17px] leading-[1.75] text-kerb/85">
            {profile.bioLong.split("\n\n").map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>
        </div>
        <div className="lg:col-span-5">
          <Reveal>
            <SectorLabel sector="Highlights" plain="Career timeline" />
          </Reveal>
          <ol className="relative mt-8 border-l border-asphalt-700 pl-8">
            {profile.careerHighlights.map((h, i) => (
              <Reveal as="li" key={h.year + h.title} delay={i * 0.08} className="relative pb-9 last:pb-0">
                <span
                  aria-hidden
                  className="absolute top-1 -left-[37px] size-2.5 rotate-45 border-2 border-asphalt-950 bg-livery outline outline-1 outline-livery"
                />
                <span className="font-mono text-sm font-bold text-livery-ink tabular">{h.year}</span>
                <p className="mt-1 font-display text-xl font-bold tracking-wide uppercase">{h.title}</p>
                {h.detail && <p className="mt-1 text-sm text-tyre-grey">{h.detail}</p>}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Junior formulae + off track */}
      <section className="container-race grid gap-16 pb-12 lg:grid-cols-12" aria-labelledby="junior">
        <div className="lg:col-span-8">
          <SectionHeader
            sector="Sector 2"
            plain="Education"
            title={<span id="junior">Junior formulae</span>}
            subtitle="The feeder series where the fundamentals were built."
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {education.map((e, i) => (
              <Reveal as="li" key={e.institution} delay={i * 0.08}>
                <LiveryCard interactive={false} className="h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="label-mono text-livery-ink">F{education.length - i + 1} series</span>
                    <span className="label-mono text-tyre-grey">
                      {e.start}–{e.end ?? "Now"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl leading-tight font-bold">{e.institution}</h3>
                  <p className="mt-2 text-sm text-kerb/85">{e.degree}</p>
                  {e.score && (
                    <p className="mt-4 font-mono text-sm text-purple tabular">
                      <span className="sr-only">Score: </span>
                      {e.score}
                    </p>
                  )}
                  {e.notes?.map((n) => (
                    <p key={n} className="mt-2 text-sm text-tyre-grey">
                      {n}
                    </p>
                  ))}
                </LiveryCard>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4">
          <Reveal>
            <SectorLabel sector="Off-track" plain="Interests" />
            <h2 className="mt-5 text-3xl font-black italic">Away from the circuit</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <li key={i}>
                  <Chip className="px-3 py-2 text-xs">{i}</Chip>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
