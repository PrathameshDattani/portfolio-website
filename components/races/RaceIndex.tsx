"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";
import { WorkList } from "./WorkList";

/** Category filter (text tabs with counts) over the editorial project list. */
export function RaceIndex({ projects, categories }: { projects: Project[]; categories: string[] }) {
  const [filter, setFilter] = useState("All");
  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category.includes(filter))),
    [filter, projects],
  );
  const count = (c: string) => (c === "All" ? projects.length : projects.filter((p) => p.category.includes(c)).length);

  return (
    <div>
      <div role="group" aria-label="Filter by category" className="mb-10 flex flex-wrap gap-x-8 gap-y-3">
        {["All", ...categories].map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(c)}
              className={cn("group relative flex items-baseline gap-1.5 py-1 text-[15px] transition-colors duration-300", active ? "text-fg" : "text-muted hover:text-fg")}
            >
              {c}
              <sup className="font-mono text-[10px] tabular">{count(c)}</sup>
              {active && (
                <motion.span layoutId="race-filter" className="absolute -bottom-0.5 left-0 h-px w-full bg-livery" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
            </button>
          );
        })}
      </div>
      <motion.div key={filter} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <WorkList projects={visible} headingLevel="h2" />
        {visible.length === 0 && <p className="py-16 text-muted">No rounds in this category yet.</p>}
      </motion.div>
    </div>
  );
}
