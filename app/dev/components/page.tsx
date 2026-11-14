import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CircuitMap } from "@/components/f1/CircuitMap";
import { LiveryCard } from "@/components/f1/LiveryCard";
import { RadioMessage } from "@/components/f1/RadioMessage";
import { SectionHeader } from "@/components/f1/SectionHeader";
import { SectorBar } from "@/components/f1/SectorBar";
import { SpeedometerGauge } from "@/components/f1/SpeedometerGauge";
import { TelemetryChart } from "@/components/f1/TelemetryChart";
import { TimingTower } from "@/components/f1/TimingTower";
import { TyreBadge } from "@/components/f1/TyreBadge";
import { StatusFlag } from "@/components/races/StatusFlag";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { FlagDemo } from "./FlagDemo";

export const metadata: Metadata = { title: "Component showcase", robots: { index: false } };

/** Hidden showcase (Phase 2). Only available in development. */
export default function ComponentsShowcase() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className="container-race grid gap-16 pt-[calc(var(--nav-h)+48px)] pb-24">
      <SectionHeader as="h1" sector="Dev" plain="Showcase" title="Components" subtitle="Every F1 and UI primitive." />

      <section className="grid gap-4">
        <h2 className="label-mono">Buttons & chips</h2>
        <div className="flex flex-wrap items-center gap-4 pl-2">
          <Button href="/">Primary</Button>
          <Button href="/" variant="ghost">
            Ghost
          </Button>
          <Chip>TypeScript</Chip>
          <Chip color="var(--livery)">With tick</Chip>
          <StatusFlag status="finished" />
          <StatusFlag status="in-progress" />
          <StatusFlag status="shipped" />
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="label-mono">Tyres</h2>
        <div className="flex flex-wrap gap-6">
          {(["soft", "medium", "hard", "inter", "wet"] as const).map((t) => (
            <TyreBadge key={t} tyre={t} showMeaning />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[3, 11, 64].map((seed) => (
          <LiveryCard key={seed} className="p-6">
            <p className="label-mono mb-4 text-tyre-grey">Seed {seed} · hover me</p>
            <CircuitMap seed={seed} showSectors={seed === 11} />
          </LiveryCard>
        ))}
      </section>

      <section className="grid gap-4">
        <h2 className="label-mono">Sector bar · gauges</h2>
        <SectorBar />
        <div className="flex flex-wrap gap-8">
          <SpeedometerGauge value={92} label="Purple" />
          <SpeedometerGauge value={72} label="Green" />
          <SpeedometerGauge value={40} label="Yellow" />
        </div>
      </section>

      <TelemetryChart seed={9} />

      <div className="grid gap-6 md:grid-cols-2">
        <TimingTower
          rows={[
            { id: "a", name: "Alpha", detail: "Sample", gap: "Leader" },
            { id: "b", name: "Beta", detail: "Sample", gap: "+1.204", color: "var(--sector-green)" },
            { id: "c", name: "Gamma", detail: "Sample", gap: "+3.881", color: "var(--sector-yellow)" },
          ]}
        />
        <div className="grid gap-4">
          <RadioMessage from="SMP" message="This is a sample team radio message." />
          <FlagDemo />
        </div>
      </div>
    </div>
  );
}
