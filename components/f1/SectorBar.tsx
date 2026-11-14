"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DEFAULTS = [
  { label: "S1", color: "var(--sector-purple)" },
  { label: "S2", color: "var(--sector-green)" },
  { label: "S3", color: "var(--sector-yellow)" },
];

/**
 * Three-segment timing bar. `active` highlights one sector (others dimmed);
 * omit it to light all three in sequence.
 */
export function SectorBar({
  active,
  className,
  showLabels = true,
}: {
  active?: 0 | 1 | 2;
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <div className={cn("grid grid-cols-3 gap-1", className)}>
      {DEFAULTS.map((s, i) => {
        const on = active === undefined || active === i;
        return (
          <div key={s.label} className="flex flex-col gap-1.5">
            <div className="h-1.5 overflow-hidden rounded-[1px] bg-asphalt-700">
              <motion.div
                className="h-full origin-left"
                style={{ background: s.color, opacity: on ? 1 : 0.18 }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.18 }}
              />
            </div>
            {showLabels && (
              <span className={cn("label-mono", on ? "text-kerb" : "text-tyre-grey/60")}>{s.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
