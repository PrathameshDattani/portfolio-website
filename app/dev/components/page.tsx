import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TelemetryChart } from "@/components/f1/TelemetryChart";
import { Marquee } from "@/components/motion/Marquee";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TrackRender } from "@/components/track/TrackRender";
import { ArrowLink, Button } from "@/components/ui/Button";
import { FlagDemo } from "./FlagDemo";

export const metadata: Metadata = { title: "Component showcase", robots: { index: false } };

/** Hidden showcase. Development only. */
export default function ComponentsShowcase() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className="wrap grid gap-20 pt-[calc(var(--nav-h)+64px)] pb-24">
      <SplitReveal as="h1" text="Components" className="display text-7xl font-[750]" />
      <div className="flex flex-wrap items-center gap-6">
        <Button href="/">Solid</Button>
        <Button href="/" variant="outline">
          Outline
        </Button>
        <ArrowLink href="/">Arrow link</ArrowLink>
        <FlagDemo />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[3, 11, 64].map((s) => (
          <div key={s} data-track-host className="overflow-hidden rounded-[6px]">
            <TrackRender seed={s} />
          </div>
        ))}
      </div>
      <TelemetryChart seed={9} />
      <Marquee>
        {["One", "Two", "Three", "Four"].map((w) => (
          <span key={w} className="display px-8 text-6xl">
            {w}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
