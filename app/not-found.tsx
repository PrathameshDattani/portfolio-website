import type { Metadata } from "next";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "DNF · Page not found" };

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-[clamp(48px,8vw,120px)]">
      {/* red-flag light washing in from above */}
      <div aria-hidden className="pulse-soft pointer-events-none absolute -top-1/3 left-1/2 h-[90vh] w-[120vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(239,68,68,.22),transparent)] blur-2xl" />
      <div className="wrap relative">
        <Reveal y={12} className="flex items-center gap-3">
          <span aria-hidden className="h-3 w-4 rounded-[1px] bg-red" />
          <span className="eyebrow">Red flag · Error 404</span>
        </Reveal>
        <SplitReveal as="h1" text="DNF" className="display mt-6 text-[clamp(120px,30vw,480px)] font-[800] leading-[0.8]" duration={1.3} />
        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal delay={0.3} className="md:col-span-6">
            <p className="text-[clamp(22px,2.4vw,34px)] leading-[1.2] font-medium tracking-[-0.03em]">This page retired from the race.</p>
            <p className="mt-3 max-w-md text-muted">It went off at the first corner and is beached in the gravel. Quicker to head back to the pits.</p>
          </Reveal>
          <Reveal delay={0.45} className="md:col-span-6 md:flex md:justify-end">
            <Button href="/">Return to pit lane</Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
