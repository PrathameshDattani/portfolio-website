"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { LayoutGrid, ListOrdered } from "lucide-react";
import { useMemo, useState } from "react";
import type { Project } from "@/content/types";
import { TimingTower } from "@/components/f1/TimingTower";
import { EASE } from "@/lib/motion";
import { cn, formatMonth, roundLabel } from "@/lib/utils";
import { RaceCard } from "./RaceCard";
import { StatusFlag } from "./StatusFlag";

const TYRE_CYCLE = [
  "var(--tyre-soft)",
  "var(--tyre-medium)",
  "var(--tyre-hard)",
  "var(--tyre-inter)",
  "var(--tyre-wet)",
];

export function RaceCalendar({ projects, categories }: { projects: Project[]; categories: string[] }) {
  const [filter, setFilter] = useState<string>("All");
  const [view, setView] = useState<"grid" | "tower">("grid");

  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category.includes(filter))),
    [filter, projects],
  );

  const chips = ["All", ...categories];

  return (
    <div>
      <div className="flex flex-col gap-5 border-y border-asphalt-800 py-5 md:flex-row md:items-center md:justify-between">
        <LayoutGroup id="filters">
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            {chips.map((c, i) => {
              const active = filter === c;
              const color = i === 0 ? "var(--kerb-white)" : TYRE_CYCLE[(i - 1) % TYRE_CYCLE.length];
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-1.5 transition-colors duration-300",
                    active ? "border-transparent text-asphalt-950" : "border-asphalt-700 text-kerb/80 hover:border-asphalt-600 hover:text-kerb",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-kerb"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span
                    aria-hidden
                    className="relative size-5 rounded-full border-[3px] bg-asphalt-950"
                    style={{ borderColor: color }}
                  />
                  <span className="label-mono relative">{c}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div className="flex items-center gap-4">
          <span className="label-mono text-tyre-grey" aria-live="polite">
            {visible.length} {visible.length === 1 ? "round" : "rounds"}
          </span>
          <div role="group" aria-label="View" className="flex rounded-[4px] border border-asphalt-700 p-1">
            {(
              [
                ["grid", "Calendar", LayoutGrid],
                ["tower", "Timing tower", ListOrdered],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                onClick={() => setView(key)}
                className={cn(
                  "relative flex items-center gap-2 rounded-[2px] px-3 py-1.5 transition-colors duration-300",
                  view === key ? "text-kerb" : "text-tyre-grey hover:text-kerb",
                )}
              >
                {view === key && (
                  <motion.span
                    layoutId="view-pill"
                    className="absolute inset-0 rounded-[2px] bg-asphalt-700"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon size={14} className="relative" aria-hidden />
                <span className="label-mono relative">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait" initial={false}>
          {view === "grid" ? (
            <motion.ul
              key="grid"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {visible.map((p) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <RaceCard project={p} headingLevel="h2" />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <motion.div
              key="tower"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <TimingTower
                key={filter}
                title="Race calendar · Classification"
                gapLabel="Status"
                rows={visible.map((p, i) => ({
                  id: p.slug,
                  position: roundLabel(p.round),
                  name: `${p.name} GP`,
                  detail: `${p.category.join(" · ")} · ${formatMonth(p.start)}`,
                  color: TYRE_CYCLE[i % TYRE_CYCLE.length],
                  gap: <StatusFlag status={p.status} />,
                  href: `/races/${p.slug}`,
                }))}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {visible.length === 0 && (
          <p className="py-20 text-center text-tyre-grey">No rounds in this category yet.</p>
        )}
      </div>
    </div>
  );
}
