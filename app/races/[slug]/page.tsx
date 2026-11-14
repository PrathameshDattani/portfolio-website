import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sortedProjects } from "@/content/projects";
import { CountUp } from "@/components/f1/CountUp";
import { TelemetryChart } from "@/components/f1/TelemetryChart";
import { SectionLabel } from "@/components/layout/PageHeader";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TrackRender } from "@/components/track/TrackRender";
import { Button } from "@/components/ui/Button";
import { Reveal, Rule } from "@/components/ui/Reveal";
import { formatRange, pad, roundLabel } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return sortedProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = sortedProjects.find((x) => x.slug === slug);
  return p ? { title: `${p.name} Grand Prix · Project`, description: p.summary } : {};
}

const STATUS = { finished: "Finished", "in-progress": "In progress", shipped: "Shipped" } as const;
const SETUP = [
  { key: "engine", title: "Engine", plain: "Backend" },
  { key: "aero", title: "Aero", plain: "Frontend" },
  { key: "electronics", title: "Electronics", plain: "Infra & AI" },
] as const;

export default async function RaceReport({ params }: Params) {
  const { slug } = await params;
  const index = sortedProjects.findIndex((p) => p.slug === slug);
  const project = sortedProjects[index];
  if (!project) notFound();
  const next = sortedProjects[(index + 1) % sortedProjects.length];
  const seed = project.circuitSeed ?? project.round;

  const links: [string, string][] = [];
  for (const [label, href] of [
    ["Source", project.links?.github],
    ["Live", project.links?.live],
    ["Demo", project.links?.demo],
    ["Paper", project.links?.paper],
  ] as const) {
    if (href) links.push([label, href]);
  }

  const sectors = [
    { title: "Problem & research", body: project.problem, color: "var(--purple)" },
    { title: "Architecture & build", body: project.solution, color: "var(--green)" },
    { title: "Result", body: project.result, color: "var(--yellow)" },
  ];

  return (
    <article>
      {/* Title */}
      <header className="wrap pt-[calc(var(--nav-h)+clamp(48px,8vw,120px))]">
        <Reveal y={12} className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/races" className="eyebrow group !text-fg">
            <span className="u-draw">← Calendar</span>
          </Link>
          <span className="eyebrow !text-livery-ink">Round {pad(project.round)}</span>
          <span className="eyebrow">{project.category.join(" · ")}</span>
        </Reveal>
        <SplitReveal as="h1" text={project.name} className="display mt-6 text-[clamp(48px,10vw,168px)] font-[750]" duration={1.25} />
        <Reveal delay={0.3}>
          <p className="display-narrow mt-3 text-[clamp(18px,2vw,28px)] tracking-[0.3em] text-muted uppercase">Grand Prix</p>
        </Reveal>
      </header>

      {/* Aerial */}
      <Reveal delay={0.2} className="wrap mt-[clamp(40px,6vw,80px)]">
        <div className="relative overflow-hidden rounded-[6px] ring-1 ring-white/10">
          <TrackRender seed={seed} mode="always" aspect={21 / 9} lapTime={14} label={`Aerial view of the original circuit for ${project.name}`} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-[clamp(16px,3vw,32px)] pt-24">
            <span className="eyebrow !text-fg">Circuit {roundLabel(project.round)} · Night session</span>
            <span className="eyebrow hidden sm:inline">Original layout · seed {seed}</span>
          </div>
        </div>
      </Reveal>

      {/* Meta row */}
      <section className="wrap mt-16" aria-label="Race facts">
        <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
          {[
            ["Role", project.role],
            ["Race weekend", formatRange(project.start, project.end)],
            ["Classification", STATUS[project.status]],
            ["Discipline", project.category.join(", ")],
          ].map(([k, v], i) => (
            <Reveal key={k} delay={i * 0.06} className="border-b border-line py-6 pr-4">
              <dt className="eyebrow">{k}</dt>
              <dd className="mt-2 text-[15px]">{v}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Summary + links */}
      <section className="wrap section-y grid gap-12 lg:grid-cols-12" aria-labelledby="summary">
        <div className="lg:col-span-4">
          <SectionLabel index="01">Race summary</SectionLabel>
        </div>
        <div className="lg:col-span-8">
          <h2 id="summary" className="sr-only">
            Summary
          </h2>
          <Reveal>
            <p className="text-[clamp(24px,3vw,44px)] leading-[1.15] font-medium tracking-[-0.03em]">{project.summary}</p>
          </Reveal>
          {links.length > 0 && (
            <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-3">
              {links.map(([label, href], i) => (
                <Button key={label} href={href} external variant={i === 0 ? "solid" : "outline"}>
                  {label}
                </Button>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {/* Sectors */}
      <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-labelledby="sectors">
        <SectionLabel index="02">Three sectors</SectionLabel>
        <h2 id="sectors" className="sr-only">
          Three sectors
        </h2>
        <ol className="mt-10 border-t border-line">
          {sectors.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="grid gap-4 border-b border-line py-10 md:grid-cols-12">
              <div className="flex items-center gap-3 md:col-span-4">
                <span aria-hidden className="h-[3px] w-8" style={{ background: s.color }} />
                <span className="eyebrow">Sector {i + 1}</span>
              </div>
              <h3 className="display-narrow text-2xl font-[600] md:col-span-3">{s.title}</h3>
              <p className="leading-relaxed text-fg/80 md:col-span-5">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Telemetry */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-labelledby="telemetry">
          <SectionLabel index="03">Telemetry</SectionLabel>
          <h2 id="telemetry" className="sr-only">
            Telemetry
          </h2>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-[6px] border border-line bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            {project.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08} className="bg-ink-950 p-8">
                <dt className="eyebrow">{m.label}</dt>
                <dd className="display mt-8 flex items-baseline gap-2 text-[clamp(56px,6vw,96px)] font-[500]">
                  <CountUp value={m.value} />
                  {m.unit && <span className="font-mono text-base font-normal tracking-normal text-muted normal-case">{m.unit}</span>}
                </dd>
                {m.max !== undefined && (
                  <dd aria-hidden className="mt-6 h-px bg-line-strong">
                    <span className="block h-px bg-livery" style={{ width: `${Math.min(100, (m.value / m.max) * 100)}%` }} />
                  </dd>
                )}
              </Reveal>
            ))}
          </dl>
          <Reveal className="mt-12">
            <TelemetryChart seed={seed} label={`${project.name} · Lap trace`} />
          </Reveal>
        </section>
      )}

      {/* Car setup */}
      <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-labelledby="setup">
        <SectionLabel index="04">Car setup — Stack</SectionLabel>
        <h2 id="setup" className="sr-only">
          Tech stack
        </h2>
        <div className="mt-10 grid border-t border-line md:grid-cols-3">
          {SETUP.map(({ key, title, plain }, i) => {
            const items = project.stack[key];
            if (!items?.length) return null;
            return (
              <Reveal key={key} delay={i * 0.08} className="border-b border-line py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
                <h3 className="flex items-baseline justify-between">
                  <span className="display-narrow text-xl font-[600]">{title}</span>
                  <span className="eyebrow">{plain}</span>
                </h3>
                <ul className="mt-6 grid gap-2 text-[15px] text-fg/85">
                  {items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Media (only when provided) */}
      {(project.archDiagram || project.media?.length) && (
        <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-label="Media">
          <div className="grid gap-6 md:grid-cols-2">
            {project.archDiagram && (
              <Reveal className="md:col-span-2">
                <Image src={project.archDiagram} alt={`Architecture diagram for ${project.name}`} width={1600} height={900} sizes="100vw" className="h-auto w-full rounded-[6px]" />
              </Reveal>
            )}
            {project.media?.map((m) => (
              <Reveal key={m.src}>
                {m.type === "image" ? (
                  <Image src={m.src} alt={m.alt} width={1200} height={750} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full rounded-[6px]" />
                ) : (
                  <video src={m.src} controls muted playsInline className="w-full rounded-[6px]" aria-label={m.alt} />
                )}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Debrief */}
      {project.learnings?.length ? (
        <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-labelledby="debrief">
          <SectionLabel index="05">Post-race debrief</SectionLabel>
          <h2 id="debrief" className="sr-only">
            Learnings
          </h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-2">
            {project.learnings.map((l, i) => (
              <Reveal as="li" key={l} delay={i * 0.08}>
                <span className="font-mono text-xs text-livery-ink tabular">{pad(i + 1)}</span>
                <p className="mt-3 text-[clamp(20px,2vw,28px)] leading-snug tracking-[-0.02em]">{l}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      ) : null}

      {/* Next race */}
      {next && next.slug !== project.slug && (
        <nav aria-label="Next race" className="border-t border-line">
          <Link href={`/races/${next.slug}`} data-cursor="Next" className="group wrap block py-[clamp(64px,10vw,140px)]">
            <span className="eyebrow">Next round · {roundLabel(next.round)}</span>
            <span className="display mt-6 block text-[clamp(44px,9vw,150px)] font-[750] transition-transform duration-700 ease-out group-hover:translate-x-6">
              {next.name}
            </span>
            <Rule className="mt-8" />
          </Link>
        </nav>
      )}
    </article>
  );
}
