import type { Metadata } from "next";
import { projectCategories, sortedProjects } from "@/content/projects";
import { PageHeader } from "@/components/layout/PageHeader";
import { RaceIndex } from "@/components/races/RaceIndex";

export const metadata: Metadata = {
  title: "Race Calendar · Projects",
  description: "Every project, presented as a round of the championship.",
};

export default function RacesPage() {
  return (
    <>
      <PageHeader
        index="02"
        label="Race calendar"
        plain="Projects"
        title={`Calendar ${new Date().getFullYear()}`}
        intro="Every project is a Grand Prix, each raced on its own original circuit. Hover a round to fly over its track; open it for the full race report."
        aside={<p className="eyebrow leading-relaxed">{sortedProjects.length} rounds · {projectCategories.length} disciplines</p>}
      />
      <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-label="Projects">
        <RaceIndex projects={sortedProjects} categories={projectCategories} />
      </section>
    </>
  );
}
