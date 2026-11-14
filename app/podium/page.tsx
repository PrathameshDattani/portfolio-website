import { ArrowUpRight, Award, FileText, Medal, Trophy } from "lucide-react";
import type { Metadata } from "next";
import { achievements } from "@/content/achievements";
import { publications } from "@/content/publications";
import { LiveryCard } from "@/components/f1/LiveryCard";
import { SectionHeader } from "@/components/f1/SectionHeader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Podium } from "@/components/podium/Podium";
import { Reveal } from "@/components/ui/Reveal";
import { formatMonth, pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Trophy Cabinet · Achievements",
  description: "Hackathons, certifications, scholarships and publications.",
};

const POS_STYLE = {
  P1: { color: "var(--livery)", icon: Trophy, label: "P1 · Winner" },
  P2: { color: "#C9CBD1", icon: Trophy, label: "P2 · Runner-up" },
  P3: { color: "#C7884A", icon: Trophy, label: "P3 · Third" },
  Finisher: { color: "var(--sector-green)", icon: Medal, label: "Finisher" },
} as const;

export default function PodiumPage() {
  const featured = achievements.filter((a) => a.featured).slice(0, 3);
  return (
    <>
      <PageHeader
        sector="Trophy cabinet"
        plain="Achievements"
        title={
          <>
            The <span className="text-livery">podium</span>
          </>
        }
        subtitle="Silverware from hackathons, certifications, scholarships and more."
      />

      {featured.length > 0 && (
        <section className="container-race" aria-label="Top three">
          <div className="relative overflow-hidden rounded-md border border-asphalt-800 bg-gradient-to-b from-asphalt-950 to-asphalt-900 px-4 pt-16 sm:px-10">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,var(--livery-glow),transparent)] opacity-40" />
            <div className="relative">
              <Podium items={featured} />
            </div>
          </div>
        </section>
      )}

      <section className="section-y container-race" aria-labelledby="cabinet">
        <SectionHeader
          sector="Results"
          plain="All achievements"
          title={<span id="cabinet">Full results</span>}
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => {
            const st = POS_STYLE[a.position ?? "Finisher"];
            const Icon = st.icon;
            return (
              <Reveal as="li" key={a.title} delay={(i % 3) * 0.08}>
                <LiveryCard color={st.color} className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between">
                    <span
                      className="flex size-11 items-center justify-center rounded-full border"
                      style={{ borderColor: st.color, color: st.color }}
                    >
                      <Icon size={20} aria-hidden />
                    </span>
                    <span className="label-mono text-tyre-grey">{formatMonth(a.date)}</span>
                  </div>
                  <p className="label-mono mt-6" style={{ color: st.color }}>
                    {st.label}
                  </p>
                  <h3 className="mt-2 text-xl leading-tight font-bold">{a.event} Grand Prix</h3>
                  <p className="mt-1 text-sm text-kerb/80">{a.title}</p>
                  {a.description && <p className="mt-3 text-sm text-tyre-grey">{a.description}</p>}
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="stretched-link label-mono mt-auto inline-flex items-center gap-1.5 pt-6 text-kerb/80 transition-colors hover:text-kerb"
                    >
                      View proof <ArrowUpRight size={13} aria-hidden />
                      <span className="sr-only"> for {a.title}</span>
                    </a>
                  )}
                </LiveryCard>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {publications.length > 0 && (
        <section className="container-race pb-12" aria-labelledby="regs">
          <SectionHeader
            sector="Technical regulations"
            plain="Publications"
            title={<span id="regs">Technical regulations</span>}
            subtitle="Papers and articles, filed like rulebook articles."
          />
          <ol className="mt-12 grid gap-4">
            {publications.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.06}>
                <article className="group relative grid gap-4 rounded-md border border-asphalt-700 bg-asphalt-900/70 p-6 transition-colors duration-300 hover:border-asphalt-600 sm:grid-cols-[140px_1fr_auto] sm:items-center">
                  <span className="label-mono text-livery-ink">Article {pad(i + 1, 1)}.1</span>
                  <div>
                    <h3 className="text-lg leading-snug font-bold normal-case tracking-normal sm:text-xl">{p.title}</h3>
                    <p className="mt-1 text-sm text-tyre-grey">
                      {p.authors ? `${p.authors} · ` : ""}
                      {p.venue} · {p.date}
                    </p>
                  </div>
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="stretched-link label-mono inline-flex items-center gap-2 text-kerb/80 transition-colors group-hover:text-kerb"
                    >
                      <FileText size={14} aria-hidden /> Read
                      <span className="sr-only"> {p.title}</span>
                    </a>
                  ) : (
                    <Award size={18} className="text-tyre-grey" aria-hidden />
                  )}
                </article>
              </Reveal>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
