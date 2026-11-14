import type { Metadata } from "next";
import { GarageExplorer } from "@/components/garage/GarageExplorer";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Garage · Skills",
  description: "Skills mapped onto an original car schematic: languages, frontend, backend, AI, DevOps and data.",
};

export default function GaragePage() {
  return (
    <>
      <PageHeader
        sector="Garage"
        plain="Skills"
        title={
          <>
            The <span className="text-livery">garage</span>
          </>
        }
        subtitle="Every skill is a component on the car. Pick a part to see what's fitted, or switch to the data view for a sortable table."
      />
      <section className="container-race pb-12" aria-label="Skills">
        <GarageExplorer />
      </section>
    </>
  );
}
