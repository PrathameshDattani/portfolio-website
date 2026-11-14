import { ArrowLeft, ArrowRight, ExternalLink, FileText, PlayCircle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { profile } from "@/content/profile";
import { sortedProjects } from "@/content/projects";
import { CircuitMap } from "@/components/f1/CircuitMap";
import { LiveryCard } from "@/components/f1/LiveryCard";
import { SectionHeader } from "@/components/f1/SectionHeader";
import { SectorBar } from "@/components/f1/SectorBar";
import { SpeedometerGauge } from "@/components/f1/SpeedometerGauge";
import { TelemetryChart } from "@/components/f1/TelemetryChart";
import { StatusFlag } from "@/components/races/StatusFlag";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { formatRange, pad, roundLabel } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return sortedProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = sortedProjects.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.name} Grand Prix · Project`, description: p.summary };
}

const SETUP = [
  { key: "engine", title: "Engine", plain: "Backend" },
  { key: "aero", title: "Aero", plain: "Frontend" },
  { key: "electronics", title: "Electronics", plain: "Infra & AI" },
] as const;

export default async function RaceReportPage({ params }: Params) {
  const { slug } = await params;
  const index = sortedProjects.findIndex((p) => p.slug === slug);
  const project = sortedProjects[index];
  if (!project) notFound();

  const prev = sortedProjects[index - 1];
  const next = sortedProjects[index + 1];
  const seed = project.circuitSeed ?? project.round;

  const sectors = [
    { title: "Problem & research", body: project.problem },
    { title: "Architecture & build", body: project.solution },
    { title: "Results & learnings", body: project.result },
  ];

  const links = [
    project.links?.github && { href: project.links.github, label: "Source", icon: <GithubIcon size={16} /> },
    project.links?.live && { href: project.links.live, label: "Live", icon: <ExternalLink size={16} aria-hidden /> },
    project.links?.demo && { href: project.links.demo, label: "Demo", icon: <PlayCircle size={16} aria-hidden /> },
    project.links?.paper && { href: project.links.paper, label: "Paper", icon: <FileText size={16} aria-hidden /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <article>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-[calc(var(--nav-h)+48px)] pb-16 lg:pt-[calc(var(--nav-h)+80px)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_70%_30%,black,transparent)]" />
          <div className="absolute top-0 right-0 h-[520px] w-[720px] rounded-full bg-[radial-gradient(closest-side,var(--livery-glow),transparent)] opacity-25 blur-3xl" />
        </div>
        <div className="container-race">
          <Reveal>
            <Link
              href="/races"
              className="group label-mono inline-flex items-center gap-2 text-tyre-grey transition-colors hover:text-kerb"
            >
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
              Race calendar
            </Link>
          </Reveal>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeader
                as="h1"
                sector={`Round ${pad(project.round)}`}
                plain={`Race report · ${project.category.join(" · ")}`}
                title={
                  <>
                    {project.name}
                    <span className="mt-2 block text-[0.5em] tracking-[0.12em] text-livery">Grand Prix</span>
                  </>
                }
                subtitle={project.summary}
              />
              <Reveal delay={0.15}>
                <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-700 sm:grid-cols-3">
                  <div className="bg-asphalt-900 px-4 py-4">
                    <dt className="label-mono text-[10px] text-tyre-grey">Driver role</dt>
                    <dd className="mt-2 font-display font-bold tracking-wide uppercase">{project.role}</dd>
                  </div>
                  <div className="bg-asphalt-900 px-4 py-4">
                    <dt className="label-mono text-[10px] text-tyre-grey">Race weekend</dt>
                    <dd className="mt-2 font-mono text-sm tabular">{formatRange(project.start, project.end)}</dd>
                  </div>
                  <div className="col-span-2 bg-asphalt-900 px-4 py-4 sm:col-span-1">
                    <dt className="label-mono text-[10px] text-tyre-grey">Classification</dt>
                    <dd className="mt-2">
                      <StatusFlag status={project.status} />
                    </dd>
                  </div>
                </dl>
              </Reveal>
              {links.length > 0 && (
                <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3 pl-1.5">
                  {links.map((l, i) => (
                    <Button key={l.label} href={l.href} external variant={i === 0 ? "primary" : "ghost"} icon={l.icon}>
                      {l.label}
                    </Button>
                  ))}
                </Reveal>
              )}
            </div>
            <Reveal delay={0.1} className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900/70 backdrop-blur">
                <div aria-hidden className="carbon absolute inset-0 opacity-60" />
                <div className="relative flex items-center justify-between border-b border-asphalt-700 px-5 py-3.5">
                  <span className="label-mono font-bold">Circuit {roundLabel(project.round)}</span>
                  <span className="label-mono text-tyre-grey">Original layout · seed {seed}</span>
                </div>
                <div className="relative p-6 sm:p-10">
                  <CircuitMap
                    seed={seed}
                    mode="always"
                    showSectors
                    strokeWidth={2.8}
                    lapTime={8}
                    title={`Stylised original circuit for ${project.name}`}
                  />
                </div>
                <div className="relative border-t border-asphalt-700 px-5 py-4">
                  <SectorBar />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="section-y container-race" aria-labelledby="sectors">
        <SectionHeader
          sector="Race summary"
          plain="Problem · Build · Result"
          title={<span id="sectors">Three sectors</span>}
          subtitle="How the race unfolded, sector by sector."
        />
        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {sectors.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1}>
              <LiveryCard interactive={false} className="h-full p-6 sm:p-7">
                <SectorBar active={i as 0 | 1 | 2} showLabels={false} />
                <p className="label-mono mt-6 text-tyre-grey">Sector {i + 1}</p>
                <h3 className="mt-2 text-2xl font-bold">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-kerb/85">{s.body}</p>
              </LiveryCard>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Telemetry */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="container-race pb-24 lg:pb-32" aria-labelledby="telemetry">
          <SectionHeader
            sector="Telemetry"
            plain="Metrics"
            title={<span id="telemetry">Race telemetry</span>}
            subtitle="The numbers that came out of the data."
          />
          <Reveal delay={0.1} className="mt-12 overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900">
            <div className="flex flex-wrap justify-around gap-8 border-b border-asphalt-700 px-6 py-10">
              {project.metrics.map((m) => (
                <SpeedometerGauge key={m.label} value={m.value} max={m.max ?? 100} unit={m.unit} label={m.label} size={170} />
              ))}
            </div>
            <div className="p-6 sm:p-8">
              <TelemetryChart seed={seed} label={`${project.name} · Lap trace`} height={130} />
            </div>
          </Reveal>
        </section>
      )}

      {/* Car setup */}
      <section className="container-race pb-24 lg:pb-32" aria-labelledby="setup">
        <SectionHeader
          sector="Car setup"
          plain="Tech stack"
          title={<span id="setup">Car setup</span>}
          subtitle="What was bolted on to make it go."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SETUP.map(({ key, title, plain }, i) => {
            const items = project.stack[key];
            if (!items?.length) return null;
            return (
              <Reveal key={key} delay={i * 0.08}>
                <div className="h-full rounded-md border border-asphalt-700 bg-asphalt-900/60 p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <span className="label-mono text-tyre-grey">{plain}</span>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {items.map((s) => (
                      <li key={s}>
                        <Chip color="var(--livery)">{s}</Chip>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Architecture + gallery (only when provided) */}
      {(project.archDiagram || (project.media && project.media.length > 0)) && (
        <section className="container-race pb-24 lg:pb-32" aria-labelledby="media">
          <SectionHeader sector="Garage cam" plain="Architecture & media" title={<span id="media">Garage cam</span>} />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {project.archDiagram && (
              <Reveal className="md:col-span-2">
                <figure className="overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900 p-4">
                  <Image
                    src={project.archDiagram}
                    alt={`Architecture diagram for ${project.name}`}
                    width={1600}
                    height={900}
                    sizes="(min-width: 1280px) 1232px, 100vw"
                    className="h-auto w-full rounded-[4px]"
                  />
                  <figcaption className="label-mono mt-3 text-tyre-grey">Architecture</figcaption>
                </figure>
              </Reveal>
            )}
            {project.media?.map((m) => (
              <Reveal key={m.src}>
                {m.type === "image" ? (
                  <Image
                    src={m.src}
                    alt={m.alt}
                    width={1200}
                    height={750}
                    sizes="(min-width: 768px) 616px, 100vw"
                    className="h-auto w-full rounded-md border border-asphalt-700"
                  />
                ) : (
                  <video src={m.src} controls muted playsInline className="w-full rounded-md border border-asphalt-700" aria-label={m.alt} />
                )}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Debrief */}
      {project.learnings && project.learnings.length > 0 && (
        <section className="container-race pb-24 lg:pb-32" aria-labelledby="debrief">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                sector="Debrief"
                plain="Learnings"
                title={<span id="debrief">Post-race debrief</span>}
                subtitle={`What ${profile.shortName} takes into the next round.`}
              />
            </div>
            <ol className="grid gap-4 lg:col-span-7">
              {project.learnings.map((l, i) => (
                <Reveal as="li" key={l} delay={i * 0.08} className="flex gap-5 rounded-md border border-asphalt-700 bg-asphalt-900/60 p-5">
                  <span className="font-mono text-sm font-bold text-livery-ink tabular">{pad(i + 1)}</span>
                  <p className="leading-relaxed text-kerb/90">{l}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Prev / next */}
      <nav aria-label="More races" className="container-race">
        <div className="grid gap-px overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-700 sm:grid-cols-2">
          {[prev, next].map((p, i) =>
            p ? (
              <Link
                key={p.slug}
                href={`/races/${p.slug}`}
                className={`group flex flex-col gap-2 bg-asphalt-900 p-6 transition-colors duration-300 hover:bg-asphalt-800 sm:p-8 ${i === 1 ? "sm:items-end sm:text-right" : ""}`}
              >
                <span className="label-mono flex items-center gap-2 text-tyre-grey">
                  {i === 0 && <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />}
                  {i === 0 ? "Previous round" : "Next round"} · {roundLabel(p.round)}
                  {i === 1 && <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />}
                </span>
                <span className="font-display text-xl font-bold tracking-wide uppercase sm:text-2xl">{p.name} GP</span>
              </Link>
            ) : (
              <div key={i} className="hidden bg-asphalt-900 sm:block" />
            ),
          )}
        </div>
      </nav>
    </article>
  );
}
