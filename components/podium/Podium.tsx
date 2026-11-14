"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Achievement } from "@/content/types";
import { EASE } from "@/lib/motion";
import { formatMonth } from "@/lib/utils";

const STEP = {
  P1: { height: "h-44 sm:h-56", color: "var(--livery)", order: "order-2", delay: 0.35, label: "1" },
  P2: { height: "h-32 sm:h-40", color: "#C9CBD1", order: "order-1", delay: 0.15, label: "2" },
  P3: { height: "h-24 sm:h-28", color: "#C7884A", order: "order-3", delay: 0.5, label: "3" },
} as const;

/** P2 · P1 · P3 podium. Steps rise from the floor, then the trophies drop in. */
export function Podium({ items }: { items: Achievement[] }) {
  const ranked = (["P1", "P2", "P3"] as const)
    .map((p, i) => ({ pos: p, item: items.find((a) => a.position === p) ?? items[i] }))
    .filter((x): x is { pos: "P1" | "P2" | "P3"; item: Achievement } => !!x.item);

  return (
    <motion.ol
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      className="mx-auto grid max-w-4xl grid-cols-3 items-end gap-2 sm:gap-4"
      aria-label="Top three achievements"
    >
      {ranked.map(({ pos, item }) => {
        const s = STEP[pos];
        return (
          <li key={pos} className={`${s.order} flex flex-col items-stretch`}>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: s.delay + 0.5 } },
              }}
              className="mb-4 flex flex-col items-center text-center"
            >
              <span
                className="flex size-11 items-center justify-center rounded-full border sm:size-14"
                style={{ borderColor: s.color, color: s.color, boxShadow: `0 0 40px -8px ${s.color}` }}
              >
                <Trophy size={pos === "P1" ? 24 : 20} aria-hidden />
              </span>
              <p className="mt-3 font-display text-sm leading-tight font-bold tracking-wide uppercase sm:text-lg">
                {item.event}
              </p>
              <p className="mt-1 hidden text-xs text-tyre-grey sm:block">{item.title}</p>
              <p className="label-mono mt-2 text-[10px] text-tyre-grey">{formatMonth(item.date)}</p>
            </motion.div>
            <motion.div
              variants={{
                hidden: { scaleY: 0 },
                show: { scaleY: 1, transition: { duration: 0.8, ease: EASE, delay: s.delay } },
              }}
              className={`relative origin-bottom overflow-hidden rounded-t-[4px] border border-b-0 border-asphalt-700 bg-asphalt-900 ${s.height}`}
            >
              <div aria-hidden className="carbon absolute inset-0" />
              <div aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: s.color }} />
              <span
                className="absolute inset-0 flex items-center justify-center font-display text-6xl font-black italic sm:text-8xl"
                style={{ color: s.color }}
              >
                <span className="sr-only">Position </span>
                {s.label}
              </span>
            </motion.div>
          </li>
        );
      })}
    </motion.ol>
  );
}
