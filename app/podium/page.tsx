import type { Metadata } from "next";
import { achievements } from "@/content/achievements";
import { publications } from "@/content/publications";
import { PageHeader, SectionLabel } from "@/components/layout/PageHeader";
import { TrophyCard } from "@/components/podium/TrophyCard";
import { Reveal } from "@/components/ui/Reveal";
import { formatMonth, pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Trophy Cabinet · Achievements",
  description: "Hackathons, certifications, scholarships and publications.",
};

/* Brushed metals for the numerals */
const METAL = {
  P1: "linear-gradient(180deg,#fff6d8 0%,#e9c46a 30%,#8a6420 52%,#f3d98c 70%,#a77a26 100%)",
  P2: "linear-gradient(180deg,#ffffff 0%,#d4d6db 32%,#6f737b 52%,#e2e4e8 70%,#8d9199 100%)",
  P3: "linear-gradient(180deg,#ffe2c8 0%,#d08a52 32%,#6b3a17 52%,#e1a272 70%,#8f5428 100%)",
} as const;

export default function PodiumPage() {
  const top = (["P2", "P1", "P3"] as const)
    .map((p) => ({ p, a: achievements.find((x) => x.featured && x.position === p) }))
    .filter((x) => x.a);

  return (
    <>
      <PageHeader
        index="05"
        label="Trophy cabinet"
        plain="Achievements"
        title="Podium"
        intro="Silverware from hackathons, certifications and scholarships, plus the papers filed as technical regulations."
      />

      {top.length > 0 && (
        <section className="wrap" aria-label="Top three">
          <ol className="grid items-end gap-5 md:grid-cols-3">
            {top.map(({ p, a }, i) => (
              <Reveal as="li" key={p} delay={[0.15, 0, 0.3][i]} className={p === "P1" ? "md:-mb-0" : "md:mb-0"}>
                <TrophyCard
                  className={`relative flex flex-col overflow-hidden rounded-[6px] border border-line bg-[linear-gradient(180deg,#141417,#0a0a0c)] p-8 ${p === "P1" ? "md:min-h-[520px]" : p === "P2" ? "md:min-h-[440px]" : "md:min-h-[380px]"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">{formatMonth(a!.date)}</span>
                    <span className="eyebrow">{p === "P1" ? "Winner" : p === "P2" ? "Runner-up" : "Third"}</span>
                  </div>
                  <span
                    className="display mt-auto block bg-clip-text pt-10 text-[clamp(110px,13vw,200px)] font-[800] text-transparent"
                    style={{ backgroundImage: METAL[p] }}
                  >
                    {p}
                  </span>
                  <h2 className="display-narrow mt-6 text-2xl font-[600]">{a!.event}</h2>
                  <p className="mt-2 text-sm text-muted">{a!.description ?? a!.title}</p>
                </TrophyCard>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      <section className="wrap section-y" aria-labelledby="results">
        <SectionLabel index="—">Full results</SectionLabel>
        <h2 id="results" className="sr-only">
          Full results
        </h2>
        <ol className="mt-10 border-t border-line">
          {achievements.map((a, i) => (
            <Reveal as="li" key={a.title} delay={Math.min(i, 6) * 0.05}>
              <div className="group relative grid grid-cols-12 items-baseline gap-4 border-b border-line py-7">
                <span className="col-span-2 font-mono text-sm tabular md:col-span-1">{a.position ?? "—"}</span>
                <span className="col-span-10 md:col-span-6">
                  <span className="display-narrow block text-[clamp(20px,2.2vw,30px)] font-[600]">{a.event}</span>
                  <span className="mt-1 block text-sm text-muted">{a.title}</span>
                </span>
                <span className="col-span-8 col-start-3 text-sm text-muted md:col-span-3 md:col-start-auto">{a.description}</span>
                <span className="col-span-2 flex justify-end gap-4 text-sm md:col-span-2">
                  <span className="font-mono text-muted tabular">{formatMonth(a.date)}</span>
                  {a.link && (
                    <a href={a.link} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
                      ↗<span className="sr-only">View proof for {a.title}</span>
                    </a>
                  )}
                </span>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {publications.length > 0 && (
        <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-labelledby="regs">
          <SectionLabel index="—">Technical regulations — Publications</SectionLabel>
          <h2 id="regs" className="sr-only">
            Publications
          </h2>
          <ol className="mt-10 border-t border-line">
            {publications.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.05}>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Read"
                  className="group grid gap-3 border-b border-line py-8 md:grid-cols-12"
                >
                  <span className="eyebrow !text-livery-ink md:col-span-2">Art. {pad(i + 1)}.1</span>
                  <span className="text-[clamp(20px,2vw,28px)] leading-snug tracking-[-0.02em] md:col-span-7">
                    <span className="u-draw">{p.title}</span>
                  </span>
                  <span className="text-sm text-muted md:col-span-3 md:text-right">
                    {p.venue} · {p.date}
                  </span>
                </a>
              </Reveal>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
