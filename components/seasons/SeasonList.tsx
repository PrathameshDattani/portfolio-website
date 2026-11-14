"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import type { Experience } from "@/content/types";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { formatRange, yearOf } from "@/lib/utils";

/** Seasons with a sticky year and a progress rail that fills as you read. */
export function SeasonList({ seasons }: { seasons: Experience[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div className="relative">
      <div aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-line md:left-[calc(33.333%-1px)]">
        <motion.div className="h-full w-full origin-top bg-livery" style={{ scaleY: fill }} />
      </div>
      <ol ref={ref}>
        {seasons.map((s) => (
          <li key={s.company + s.start} className="grid gap-6 pb-[clamp(72px,9vw,140px)] pl-6 md:grid-cols-3 md:gap-0 md:pl-0">
            <div className="md:pr-10">
              <div className="md:sticky md:top-[calc(var(--nav-h)+32px)]">
                <p className="eyebrow">Season</p>
                <p className="display metal mt-2 text-[clamp(64px,9vw,150px)] font-[800]">{yearOf(s.start)}</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <span aria-hidden className="h-[3px] w-5" style={{ background: s.color }} />
                  {formatRange(s.start, s.end)}
                </p>
              </div>
            </div>
            <div className="md:col-span-2 md:pl-12">
              <SplitReveal as="h2" text={s.company} className="display text-[clamp(36px,5vw,80px)] font-[700]" />
              <Reveal delay={0.1}>
                <p className="mt-4 text-lg">
                  {s.role}
                  <span className="text-muted"> · Seat: {s.seat}</span>
                </p>
                {s.location && <p className="eyebrow mt-2">{s.location}</p>}
              </Reveal>
              <h3 className="eyebrow mt-12">Race results</h3>
              <ol className="mt-4 border-t border-line">
                {s.results.map((r, i) => (
                  <Reveal as="li" key={r} delay={i * 0.06} className="grid grid-cols-[48px_1fr] gap-4 border-b border-line py-5">
                    <span className="font-mono text-xs tabular" style={{ color: s.color }}>
                      R{i + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed text-fg/85">{r}</span>
                  </Reveal>
                ))}
              </ol>
              <Reveal className="mt-6">
                <p className="text-sm text-muted">{s.stack.join("  ·  ")}</p>
              </Reveal>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
