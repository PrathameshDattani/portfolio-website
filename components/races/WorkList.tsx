"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Project } from "@/content/types";
import { TrackRender } from "@/components/track/TrackRender";
import { EASE } from "@/lib/motion";
import { cn, roundLabel, yearOf } from "@/lib/utils";

const STATUS: Record<Project["status"], string> = {
  finished: "Finished",
  "in-progress": "In progress",
  shipped: "Shipped",
};

/**
 * Editorial project index. On desktop, hovering a row floats an aerial render of that
 * project's circuit next to the cursor; on touch screens each row carries its own render.
 */
export function WorkList({ projects, headingLevel = "h3" }: { projects: Project[]; headingLevel?: "h2" | "h3" }) {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 });
  const vx = useMotionValue(0);
  const rotate = useSpring(useTransform(vx, [-60, 60], [-7, 7]), { stiffness: 120, damping: 18 });
  const H = headingLevel;
  const current = active !== null ? projects[active] : undefined;

  return (
    <div className="relative">
      <ul
        ref={listRef}
        className="group/list border-t border-line"
        onPointerMove={(e) => {
          vx.set(e.clientX - x.get());
          x.set(e.clientX);
          y.set(e.clientY);
        }}
        onPointerLeave={() => setActive(null)}
      >
        {projects.map((p, i) => (
          <li key={p.slug} data-track-host className="relative border-b border-line">
            <Link
              href={`/races/${p.slug}`}
              data-cursor="View"
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setActive(i);
              }}
              onFocus={() => setActive(null)}
              className={cn(
                "group grid grid-cols-12 items-baseline gap-x-4 gap-y-4 py-7 transition-opacity duration-500 ease-out lg:py-9",
                active !== null && active !== i && "lg:opacity-30",
              )}
            >
              {/* mobile render */}
              <div className="col-span-12 overflow-hidden rounded-[3px] lg:hidden">
                <TrackRender seed={p.circuitSeed ?? p.round} mode="hover" aspect={16 / 9} />
              </div>
              <span className="col-span-2 font-mono text-xs text-muted tabular lg:col-span-1">{roundLabel(p.round)}</span>
              <H className="col-span-10 lg:col-span-6">
                <span className="display block text-[clamp(30px,4.6vw,76px)] font-[650] transition-transform duration-700 ease-out lg:group-hover:translate-x-4">
                  {p.name}
                </span>
              </H>
              <span className="col-span-6 text-sm text-muted lg:col-span-3">{p.category.join(" · ")}</span>
              <span className="col-span-6 flex items-center justify-end gap-6 text-sm lg:col-span-2">
                <span className="hidden text-muted xl:inline">{STATUS[p.status]}</span>
                <span className="font-mono tabular">{yearOf(p.start)}</span>
                <ArrowUpRight
                  size={20}
                  aria-hidden
                  className="text-muted transition-all duration-500 ease-out group-hover:rotate-45 group-hover:text-fg"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* floating preview (desktop, pointer only) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-30 hidden lg:block"
        style={{ x: sx, y: sy, rotate }}
      >
        <AnimatePresence>
          {current && (
            <motion.div
              key="frame"
              initial={{ opacity: 0, scale: 0.85, clipPath: "inset(50% 50% 50% 50%)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, scale: 0.9, clipPath: "inset(50% 50% 50% 50%)" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative -mt-[150px] ml-10 w-[400px] overflow-hidden rounded-[4px] bg-ink-900 shadow-[0_40px_80px_-20px_rgba(0,0,0,.9)] ring-1 ring-white/10"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={current.slug}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                >
                  <TrackRender seed={current.circuitSeed ?? current.round} mode="always" aspect={4 / 3} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-4 pt-10 pb-3">
                <span className="eyebrow !text-fg">{current.name} GP</span>
                <span className="eyebrow">{roundLabel(current.round)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
