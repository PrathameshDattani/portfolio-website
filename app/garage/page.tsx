import type { Metadata } from "next";
import { SetupSheet } from "@/components/garage/SetupSheet";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Garage · Skills",
  description: "The setup sheet: languages, frontend, backend, AI, DevOps and data.",
};

export default function GaragePage() {
  return (
    <>
      <PageHeader
        index="04"
        label="Garage"
        plain="Skills"
        title="Setup sheet"
        intro="Each component of the car is a part of the stack. Tyre compounds show how I run each one, from daily-driver soft to experimental wet."
      />
      <section className="wrap pb-[clamp(96px,12vw,180px)]" aria-label="Skills">
        <SetupSheet />
      </section>
    </>
  );
}
