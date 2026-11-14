import type { Metadata } from "next";
import { experience } from "@/content/experience";
import { CountUp } from "@/components/f1/CountUp";
import { PageHeader, SectionLabel } from "@/components/layout/PageHeader";
import { SeasonList } from "@/components/seasons/SeasonList";
import { Reveal } from "@/components/ui/Reveal";
import { monthsBetween } from "@/lib/utils";

export const metadata: Metadata = { title: "Career Seasons · Experience", description: "Work experience, one season at a time." };

export default function SeasonsPage() {
  const totals = [
    { label: "Seasons", plain: "Roles", value: experience.length },
    { label: "Teams", plain: "Companies", value: new Set(experience.map((e) => e.company)).size },
    { label: "Race results", plain: "Highlights", value: experience.reduce((a, e) => a + e.results.length, 0) },
    { label: "Laps", plain: "Months", value: experience.reduce((a, e) => a + monthsBetween(e.start, e.end), 0) },
  ];
  return (
    <>
      <PageHeader
        index="03"
        label="Career seasons"
        plain="Experience"
        title="Seasons"
        intro="Every role is a season with a team. The results below are the moments that defined each one."
      />
      <section className="wrap" aria-label="Timeline">
        <SeasonList seasons={experience} />
      </section>
      <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-labelledby="standings">
        <SectionLabel index="—">Championship standings</SectionLabel>
        <h2 id="standings" className="sr-only">
          Championship standings
        </h2>
        <dl className="mt-10 grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {totals.map((t, i) => (
            <Reveal key={t.label} delay={i * 0.06} className="border-b border-line py-8 pr-4">
              <dt className="flex flex-col gap-1">
                <span className="text-sm">{t.label}</span>
                <span className="eyebrow">{t.plain}</span>
              </dt>
              <dd className="display mt-8 text-[clamp(52px,6vw,96px)] font-[500]">
                <CountUp value={t.value} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>
    </>
  );
}
