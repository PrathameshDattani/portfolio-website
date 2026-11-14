import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { skills } from "@/content/skills";
import { Hero } from "@/components/hero/Hero";
import { StatsRow } from "@/components/home/StatsRow";
import { SectionLabel } from "@/components/layout/PageHeader";
import { Marquee } from "@/components/motion/Marquee";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { WorkList } from "@/components/races/WorkList";
import { ArrowLink, Button } from "@/components/ui/Button";
import { Reveal, Rule } from "@/components/ui/Reveal";
import { formatRange, yearOf } from "@/lib/utils";

export default function HomePage() {
  const current = experience[0];
  return (
    <>
      <Hero />

      {/* (01) Statement + numbers */}
      <section className="wrap section-y" aria-labelledby="intro">
        <SectionLabel index="01">Driver — About</SectionLabel>
        <h2 id="intro" className="sr-only">
          About
        </h2>
        <ScrollWords
          text={profile.bioShort}
          className="mt-10 max-w-[22ch] text-[clamp(30px,4.6vw,72px)] leading-[1.05] font-medium tracking-[-0.035em] md:max-w-[26ch]"
        />
        <div className="mt-14 flex flex-wrap gap-6 md:ml-[50%]">
          <ArrowLink href="/driver">Full driver profile</ArrowLink>
          <ArrowLink href={profile.resumeUrl}>Spec sheet (PDF)</ArrowLink>
        </div>
        <div className="mt-[clamp(80px,10vw,140px)]">
          <StatsRow stats={profile.stats} />
        </div>
      </section>

      {/* (02) Selected work */}
      <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-labelledby="work">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index="02">Races — Selected projects</SectionLabel>
            <SplitReveal as="h2" id="work" text="Selected races" className="display mt-6 text-[clamp(44px,8vw,128px)] font-[700]" />
          </div>
          <Reveal>
            <ArrowLink href="/races">Full calendar</ArrowLink>
          </Reveal>
        </div>
        <WorkList projects={featuredProjects} />
      </section>

      {/* Skills marquee */}
      <section aria-label="Toolkit" className="border-y border-line py-10">
        <Marquee duration={55}>
          {skills.map((s) => (
            <span key={s.name} className="flex items-center">
              <span className="display px-8 text-[clamp(40px,6vw,96px)] font-[600] text-fg/90">{s.name}</span>
              <span aria-hidden className="size-2.5 rounded-full bg-livery" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* (03) Current season */}
      {current && (
        <section className="wrap section-y" aria-labelledby="season">
          <SectionLabel index="03">Seasons — Current role</SectionLabel>
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <p className="display metal text-[clamp(72px,10.5vw,170px)] font-[800]">{yearOf(current.start)}</p>
            </Reveal>
            <div className="lg:col-span-7 lg:pt-6">
              <SplitReveal as="h2" id="season" text={current.company} className="display text-[clamp(36px,5vw,72px)] font-[650]" />
              <Reveal delay={0.15}>
                <p className="mt-4 text-lg text-fg/80">
                  {current.role} <span className="text-muted">· {current.seat}</span>
                </p>
                <p className="eyebrow mt-2">{formatRange(current.start, current.end)}</p>
              </Reveal>
              <Rule className="mt-10" />
              <ol className="mt-2">
                {current.results.map((r, i) => (
                  <Reveal as="li" key={r} delay={0.1 + i * 0.08} className="grid grid-cols-[48px_1fr] gap-4 border-b border-line py-5">
                    <span className="font-mono text-xs text-livery-ink tabular">P{i + 1}</span>
                    <span className="text-[15px] leading-relaxed text-fg/85">{r}</span>
                  </Reveal>
                ))}
              </ol>
              <Reveal className="mt-8">
                <ArrowLink href="/seasons">All seasons</ArrowLink>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-labelledby="cta">
        <div className="relative overflow-hidden rounded-[6px] border border-line bg-ink-900 px-[clamp(20px,5vw,80px)] py-[clamp(64px,10vw,140px)]">
          <div aria-hidden className="pointer-events-none absolute -right-1/4 -bottom-1/2 h-[140%] w-[90%] rounded-full bg-[radial-gradient(closest-side,var(--livery-glow),transparent)] opacity-40 blur-3xl" />
          <SectionLabel index="04">Pit wall — Contact</SectionLabel>
          <SplitReveal as="h2" id="cta" text="Box box." className="display mt-8 text-[clamp(72px,16vw,260px)] font-[800]" />
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <Reveal delay={0.2}>
              <p className="max-w-md text-lg text-fg/80">{profile.availabilityNote}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <Button href="/pit-wall">Start a conversation</Button>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
