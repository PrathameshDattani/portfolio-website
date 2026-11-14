import type { Metadata } from "next";
import { experience } from "@/content/experience";
import { SectionHeader } from "@/components/f1/SectionHeader";
import { TimingTower } from "@/components/f1/TimingTower";
import { CountUp } from "@/components/f1/CountUp";
import { PageHeader } from "@/components/layout/PageHeader";
import { SeasonsTimeline } from "@/components/seasons/SeasonsTimeline";
import { Reveal } from "@/components/ui/Reveal";
import { formatRange, monthsBetween } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Career Seasons · Experience",
  description: "Work experience, one season at a time.",
};

export default function SeasonsPage() {
  const months = experience.map((e) => monthsBetween(e.start, e.end));
  const totalMonths = months.reduce((a, b) => a + b, 0);
  const totals = [
    { label: "Seasons", plain: "Roles", value: experience.length },
    { label: "Teams", plain: "Companies", value: new Set(experience.map((e) => e.company)).size },
    { label: "Race results", plain: "Highlights", value: experience.reduce((a, e) => a + e.results.length, 0) },
    { label: "Laps", plain: "Months", value: totalMonths },
  ];

  return (
    <>
      <PageHeader
        sector="Career seasons"
        plain="Experience"
        title={
          <>
            Career <span className="text-livery">seasons</span>
          </>
        }
        subtitle="Each role is a season with a team. Scroll and the car runs down the timeline."
      />

      <section className="container-race" aria-label="Timeline">
        <SeasonsTimeline seasons={experience} />
      </section>

      <section className="section-y container-race" aria-labelledby="standings">
        <SectionHeader
          sector="Standings"
          plain="Summary"
          title={<span id="standings">Championship standings</span>}
          subtitle="The season totals at a glance."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <dl className="grid h-full grid-cols-2 gap-px overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-700">
              {totals.map((t) => (
                <div key={t.label} className="bg-asphalt-900 p-6">
                  <dt className="flex flex-col gap-1">
                    <span className="label-mono text-livery-ink">{t.label}</span>
                    <span className="text-xs text-tyre-grey">{t.plain}</span>
                  </dt>
                  <dd className="mt-4 font-mono text-4xl font-bold tabular">
                    <CountUp value={t.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <TimingTower
              title="Constructors"
              gapLabel="Duration"
              rows={experience.map((e, i) => ({
                id: e.company + e.start,
                name: e.company,
                detail: `${e.role} · ${formatRange(e.start, e.end)}`,
                color: e.color,
                gap: `${months[i]} mo`,
              }))}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
