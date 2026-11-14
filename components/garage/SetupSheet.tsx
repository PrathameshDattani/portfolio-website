"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { skills, tyreMeta, zoneMeta, zoneOrder } from "@/content/skills";
import type { Skill, Tyre } from "@/content/types";
import { EASE } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";

const TYRE: Record<Tyre, string> = {
  soft: "#ef4444",
  medium: "#eab308",
  hard: "#ededed",
  inter: "#22c55e",
  wet: "#3b82f6",
};

function Compound({ tyre }: { tyre: Tyre }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm" title={tyreMeta[tyre].meaning}>
      <span aria-hidden className="size-3 rounded-full border-[2.5px] bg-ink-950" style={{ borderColor: TYRE[tyre] }} />
      {tyreMeta[tyre].label}
    </span>
  );
}

function Row({ s, i, showZone }: { s: Skill; i: number; showZone?: boolean }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE, delay: Math.min(i, 8) * 0.04 }}
      className="grid grid-cols-12 items-center gap-x-4 gap-y-2 border-b border-line py-5"
    >
      <span className="col-span-7 text-[17px] font-medium sm:col-span-4">
        {s.name}
        {showZone && <span className="ml-2 text-xs text-muted">{zoneMeta[s.zone].title}</span>}
      </span>
      <span className="col-span-5 sm:col-span-2">
        <Compound tyre={s.tyre} />
      </span>
      <span className="col-span-9 flex items-center sm:col-span-4">
        <span className="relative h-px w-full bg-line-strong">
          <motion.span
            className="absolute inset-y-0 left-0 w-full origin-left bg-fg"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: s.proficiency / 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.1 + Math.min(i, 8) * 0.04 }}
          />
          <motion.span
            aria-hidden
            className="absolute -top-[3px] size-[7px] -translate-x-1/2 rounded-full bg-livery"
            initial={{ left: "0%" }}
            whileInView={{ left: `${s.proficiency}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.1 + Math.min(i, 8) * 0.04 }}
          />
        </span>
      </span>
      <span className="col-span-3 flex justify-end gap-4 font-mono text-sm tabular sm:col-span-2">
        <span>
          {s.proficiency}
          <span className="sr-only"> out of 100</span>
        </span>
        <span className="hidden text-muted sm:inline">{s.years ? `${s.years}y` : "–"}</span>
      </span>
    </motion.li>
  );
}

export function SetupSheet() {
  const [view, setView] = useState<"zones" | "ranked">("zones");
  const ranked = [...skills].sort((a, b) => b.proficiency - a.proficiency);

  return (
    <div>
      <div className="flex flex-col gap-8 border-y border-line py-6 lg:flex-row lg:items-center lg:justify-between">
        <ul aria-label="Tyre legend" className="flex flex-wrap gap-x-8 gap-y-3">
          {(Object.keys(tyreMeta) as Tyre[]).map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Compound tyre={t} />
              <span className="text-xs text-muted">{tyreMeta[t].meaning}</span>
            </li>
          ))}
        </ul>
        <div role="group" aria-label="View" className="flex gap-6">
          {(
            [
              ["zones", "By component"],
              ["ranked", "Ranked"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              aria-pressed={view === k}
              onClick={() => setView(k)}
              className={cn("relative py-1 text-[15px] transition-colors", view === k ? "text-fg" : "text-muted hover:text-fg")}
            >
              {label}
              {view === k && <motion.span layoutId="garage-view" className="absolute -bottom-0.5 left-0 h-px w-full bg-livery" />}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {view === "zones" ? (
          <motion.div key="zones" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {zoneOrder.map((z, zi) => {
              const list = skills.filter((s) => s.zone === z).sort((a, b) => b.proficiency - a.proficiency);
              if (!list.length) return null;
              return (
                <section key={z} className="grid gap-6 pt-[clamp(56px,7vw,96px)] lg:grid-cols-12" aria-labelledby={`zone-${z}`}>
                  <div className="lg:col-span-4">
                    <p className="font-mono text-xs text-livery-ink tabular">({pad(zi + 1)})</p>
                    <h2 id={`zone-${z}`} className="display mt-3 text-[clamp(32px,3.6vw,52px)] font-[700]">
                      {zoneMeta[z].title}
                    </h2>
                    <p className="eyebrow mt-3">{zoneMeta[z].plain}</p>
                    <p className="mt-4 max-w-xs text-sm text-muted">{zoneMeta[z].description}</p>
                  </div>
                  <ul className="border-t border-line lg:col-span-8">
                    {list.map((s, i) => (
                      <Row key={s.name} s={s} i={i} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </motion.div>
        ) : (
          <motion.div key="ranked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="pt-12">
            <h2 className="sr-only">All skills ranked by proficiency</h2>
            <ul className="border-t border-line">
              {ranked.map((s, i) => (
                <Row key={s.name} s={s} i={i} showZone />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
