import type { Metadata } from "next";
import { projectCategories, sortedProjects } from "@/content/projects";
import { PageHeader } from "@/components/layout/PageHeader";
import { RaceCalendar } from "@/components/races/RaceCalendar";

export const metadata: Metadata = {
  title: "Race Calendar · Projects",
  description: "Every project, presented as a round of the championship.",
};

export default function RacesPage() {
  const year = new Date().getFullYear();
  return (
    <>
      <PageHeader
        sector="Race calendar"
        plain="Projects"
        title={
          <>
            {year} race <span className="text-livery">calendar</span>
          </>
        }
        subtitle="Every project is a Grand Prix with its own original circuit. Filter by category, or switch to the timing tower for the ranked view."
      />
      <section className="container-race pb-12" aria-label="Projects">
        <RaceCalendar projects={sortedProjects} categories={projectCategories} />
      </section>
    </>
  );
}
