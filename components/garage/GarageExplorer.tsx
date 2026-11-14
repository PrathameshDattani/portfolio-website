"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Car, Table2 } from "lucide-react";
import { useMemo, useState } from "react";
import { skills, tyreMeta, zoneMeta, zoneOrder } from "@/content/skills";
import type { Skill, SkillZone } from "@/content/types";
import { proficiencyColor, SpeedometerGauge } from "@/components/f1/SpeedometerGauge";
import { TyreBadge } from "@/components/f1/TyreBadge";
import { EASE } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";
import { CarSchematic } from "./CarSchematic";

type SortKey = "name" | "zone" | "tyre" | "proficiency" | "years";
const TYRE_RANK = { soft: 0, medium: 1, hard: 2, inter: 3, wet: 4 } as const;

export function GarageExplorer() {
  const [view, setView] = useState<"car" | "data">("car");
  const [zone, setZone] = useState<SkillZone>("power-unit");

  return (
    <div>
      <div className="flex flex-col gap-6 border-y border-asphalt-800 py-5 lg:flex-row lg:items-center lg:justify-between">
        <TyreLegend />
        <div role="group" aria-label="View" className="flex w-fit rounded-[4px] border border-asphalt-700 p-1">
          {(
            [
              ["car", "Car view", Car],
              ["data", "Data view", Table2],
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
                  layoutId="garage-view"
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

      <AnimatePresence mode="wait" initial={false}>
        {view === "car" ? (
          <motion.div
            key="car"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-10 grid gap-10 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900/60 p-6 sm:p-10">
                <div aria-hidden className="grid-lines absolute inset-0 opacity-60 [background-size:32px_32px]" />
                <div className="relative">
                  <CarSchematic active={zone} onSelect={setZone} />
                </div>
              </div>
              {/* zone list: also the primary control on small screens */}
              <div role="group" aria-label="Car components" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {zoneOrder.map((z) => (
                  <button
                    key={z}
                    type="button"
                    aria-pressed={zone === z}
                    onClick={() => setZone(z)}
                    className={cn(
                      "rounded-[4px] border px-3 py-2.5 text-left transition-colors duration-300",
                      zone === z
                        ? "border-livery bg-livery-soft"
                        : "border-asphalt-700 hover:border-asphalt-600 hover:bg-asphalt-900",
                    )}
                  >
                    <span className="block font-display text-[13px] font-bold tracking-wider uppercase">{zoneMeta[z].title}</span>
                    <span className="block text-[11px] text-tyre-grey">{zoneMeta[z].plain}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={zone}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <ZonePanel zone={zone} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-10"
          >
            <DataView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ZonePanel({ zone }: { zone: SkillZone }) {
  const meta = zoneMeta[zone];
  const list = skills.filter((s) => s.zone === zone).sort((a, b) => b.proficiency - a.proficiency);
  const idx = zoneOrder.indexOf(zone);
  return (
    <div>
      <p className="label-mono text-livery-ink">
        Component {pad(idx + 1)} / {pad(zoneOrder.length)} · {meta.plain}
      </p>
      <h2 className="mt-3 text-4xl font-black italic sm:text-5xl">{meta.title}</h2>
      <p className="mt-3 max-w-lg text-tyre-grey">{meta.description}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {list.map((s, i) => (
          <motion.li
            key={s.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.06 }}
            className="flex items-center gap-4 rounded-md border border-asphalt-700 bg-asphalt-900/70 p-4"
          >
            <SpeedometerGauge value={s.proficiency} label="Proficiency" size={112} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-bold tracking-wide uppercase">{s.name}</p>
              <div className="mt-3">
                <TyreBadge tyre={s.tyre} size={24} />
              </div>
              {s.years !== undefined && (
                <p className="label-mono mt-3 text-tyre-grey">
                  {s.years} {s.years === 1 ? "season" : "seasons"}
                </p>
              )}
            </div>
          </motion.li>
        ))}
        {list.length === 0 && <li className="text-tyre-grey">No parts fitted here yet.</li>}
      </ul>
    </div>
  );
}

function TyreLegend() {
  return (
    <div>
      <p className="label-mono mb-3 text-tyre-grey">Tyre legend</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-3">
        {(Object.keys(tyreMeta) as (keyof typeof tyreMeta)[]).map((t) => (
          <li key={t}>
            <TyreBadge tyre={t} size={24} showMeaning />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DataView() {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "proficiency", dir: -1 });
  const rows = useMemo(() => {
    const val = (s: Skill): string | number => {
      switch (sort.key) {
        case "name":
          return s.name.toLowerCase();
        case "zone":
          return zoneOrder.indexOf(s.zone);
        case "tyre":
          return TYRE_RANK[s.tyre];
        case "years":
          return s.years ?? 0;
        default:
          return s.proficiency;
      }
    };
    return [...skills].sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * sort.dir);
  }, [sort]);

  const cols: { key: SortKey; label: string; className?: string }[] = [
    { key: "name", label: "Skill" },
    { key: "zone", label: "Component", className: "hidden md:table-cell" },
    { key: "tyre", label: "Compound" },
    { key: "proficiency", label: "Proficiency" },
    { key: "years", label: "Seasons", className: "hidden sm:table-cell text-right" },
  ];

  return (
    <div className="overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900">
      <table className="w-full text-left">
        <caption className="sr-only">All skills, sortable</caption>
        <thead className="border-b border-asphalt-700 bg-asphalt-800/70">
          <tr>
            <th scope="col" className="label-mono w-14 px-4 py-3 text-tyre-grey">
              Pos
            </th>
            {cols.map((c) => {
              const active = sort.key === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
                  className={cn("px-4 py-3", c.className)}
                >
                  <button
                    type="button"
                    onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? ((s.dir * -1) as 1 | -1) : c.key === "name" ? 1 : -1 }))}
                    className={cn(
                      "label-mono inline-flex items-center gap-1.5 transition-colors",
                      active ? "text-kerb" : "text-tyre-grey hover:text-kerb",
                    )}
                  >
                    {c.label}
                    {active && (sort.dir === 1 ? <ArrowUp size={12} aria-hidden /> : <ArrowDown size={12} aria-hidden />)}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <motion.tbody layout>
          {rows.map((s, i) => (
            <motion.tr
              key={s.name}
              layout
              transition={{ duration: 0.45, ease: EASE }}
              className="border-b border-asphalt-700/60 transition-colors last:border-b-0 hover:bg-asphalt-800/60"
            >
              <td className="px-4 py-3 font-mono text-sm font-bold tabular">{pad(i + 1)}</td>
              <td className="px-4 py-3 font-display font-bold tracking-wide uppercase">{s.name}</td>
              <td className="hidden px-4 py-3 text-sm text-tyre-grey md:table-cell">{zoneMeta[s.zone].title}</td>
              <td className="px-4 py-3">
                <TyreBadge tyre={s.tyre} size={22} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-asphalt-700">
                    <div className="h-full rounded-full" style={{ width: `${s.proficiency}%`, background: proficiencyColor(s.proficiency) }} />
                  </div>
                  <span className="w-8 font-mono text-sm tabular">{s.proficiency}</span>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-right font-mono text-sm text-tyre-grey tabular sm:table-cell">{s.years ?? "–"}</td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}
