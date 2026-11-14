import type { Metadata } from "next";
import { education } from "@/content/education";
import { profile } from "@/content/profile";
import { CountUp } from "@/components/f1/CountUp";
import { Portrait } from "@/components/driver/Portrait";
import { SectionLabel } from "@/components/layout/PageHeader";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal, Rule } from "@/components/ui/Reveal";
import { fitDisplay } from "@/lib/fit";
import { pad } from "@/lib/utils";

export const metadata: Metadata = { title: "Driver Profile · About", description: profile.bioShort };

const AVAIL = {
  open: { label: "Available for new seats", color: "var(--green)" },
  limited: { label: "Limited availability", color: "var(--yellow)" },
  closed: { label: "Not available", color: "var(--red)" },
} as const;

export default function DriverPage() {
  const avail = AVAIL[profile.availability];
  return (
    <>
      <section className="wrap pt-[calc(var(--nav-h)+clamp(56px,10vw,140px))]">
        <Reveal y={12} className="flex items-center gap-3">
          <span className="eyebrow !text-livery-ink">(01)</span>
          <span className="eyebrow">Driver profile — About</span>
        </Reveal>
        <SplitReveal as="h1" text={profile.fullName} className="display mt-6 font-[750]" style={{ fontSize: fitDisplay(profile.fullName, 11, 180) }} duration={1.25} />
        <Rule className="mt-[clamp(32px,5vw,64px)]" delay={0.3} />

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Portrait src={profile.profileImage} alt={`Portrait of ${profile.fullName}`} number={profile.driverNumber} />
          </div>
          <div className="flex flex-col lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="text-[clamp(22px,2.4vw,34px)] leading-[1.2] font-medium tracking-[-0.03em]">{profile.bioShort}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 flex items-center gap-2.5 text-sm">
                <span aria-hidden className="pulse-soft size-2 rounded-full" style={{ background: avail.color }} />
                {avail.label}
              </p>
            </Reveal>
            <dl className="mt-auto grid grid-cols-2 border-t border-line pt-2 lg:mt-16">
              {[
                ["Number", pad(profile.driverNumber)],
                ["Code", profile.shortName],
                ["Team", profile.teamName],
                ["Seat", profile.roleTitle],
                ["Home circuit", `${profile.location}`],
                ["Local time zone", profile.timezone.replace("_", " ")],
              ].map(([k, v], i) => (
                <Reveal key={k} delay={0.1 + i * 0.05} className="border-b border-line py-5 pr-4">
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-2 text-[15px]">{v}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Driver stats */}
      <section className="wrap section-y" aria-labelledby="stats">
        <SectionLabel index="02">Driver stats</SectionLabel>
        <h2 id="stats" className="sr-only">
          Driver stats
        </h2>
        <dl className="mt-10 grid grid-cols-2 border-t border-line md:grid-cols-3">
          {profile.driverStats.map((s, i) => (
            <Reveal key={s.label} delay={(i % 3) * 0.08} className="border-b border-line py-8 pr-4">
              <dt className="flex flex-col gap-1">
                <span className="text-sm">{s.f1Label ?? s.label}</span>
                <span className="eyebrow">{s.label}</span>
              </dt>
              <dd className="display mt-8 text-[clamp(52px,6vw,96px)] font-[500]">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Story + highlights */}
      <section className="wrap grid gap-16 pb-[clamp(96px,12vw,180px)] lg:grid-cols-12" aria-labelledby="story">
        <div className="lg:col-span-6">
          <SectionLabel index="03">The story so far</SectionLabel>
          <h2 id="story" className="sr-only">
            The story so far
          </h2>
          <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-fg/80">
            {profile.bioLong.split("\n\n").map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <SectionLabel index="04">Career highlights</SectionLabel>
          <ol className="mt-10 border-t border-line">
            {profile.careerHighlights.map((h, i) => (
              <Reveal as="li" key={h.year + h.title} delay={i * 0.06} className="grid grid-cols-[72px_1fr] gap-4 border-b border-line py-6">
                <span className="font-mono text-sm text-livery-ink tabular">{h.year}</span>
                <span>
                  <span className="block text-[17px] font-medium">{h.title}</span>
                  {h.detail && <span className="mt-1 block text-sm text-muted">{h.detail}</span>}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Junior formulae + off track */}
      <section className="wrap grid gap-16 pb-[clamp(96px,12vw,180px)] lg:grid-cols-12" aria-labelledby="junior">
        <div className="lg:col-span-7">
          <SectionLabel index="05">Junior formulae — Education</SectionLabel>
          <h2 id="junior" className="sr-only">
            Education
          </h2>
          <ol className="mt-10 border-t border-line">
            {education.map((e, i) => (
              <Reveal as="li" key={e.institution} delay={i * 0.08} className="grid gap-3 border-b border-line py-8 md:grid-cols-[120px_1fr_auto]">
                <span className="font-mono text-sm text-muted tabular">
                  {e.start}–{e.end ?? "now"}
                </span>
                <span>
                  <span className="display-narrow block text-2xl font-[600]">{e.institution}</span>
                  <span className="mt-1 block text-fg/80">{e.degree}</span>
                  {e.notes?.map((n) => (
                    <span key={n} className="mt-2 block text-sm text-muted">
                      {n}
                    </span>
                  ))}
                </span>
                {e.score && <span className="font-mono text-sm tabular">{e.score}</span>}
              </Reveal>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <SectionLabel index="06">Off-track</SectionLabel>
          <Reveal delay={0.1}>
            <p className="mt-10 text-[clamp(22px,2.2vw,30px)] leading-[1.3] tracking-[-0.02em]">
              {profile.interests.map((it, i) => (
                <span key={it}>
                  {it}
                  {i < profile.interests.length - 1 && <span className="text-livery">, </span>}
                </span>
              ))}
              <span className="text-livery">.</span>
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <ArrowLink href={profile.resumeUrl}>Download spec sheet</ArrowLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
