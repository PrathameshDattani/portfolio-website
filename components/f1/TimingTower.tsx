"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";

export type TowerRow = {
  id: string;
  name: ReactNode;
  detail?: ReactNode;
  color?: string;
  gap?: ReactNode;
  position?: string | number;
  href?: string;
};

/** Broadcast-style ranked list: position, team colour bar, name and gap. */
export function TimingTower({
  rows,
  title,
  gapLabel = "Gap",
  className,
}: {
  rows: TowerRow[];
  title?: string;
  gapLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900", className)}>
      <div className="flex items-center justify-between border-b border-asphalt-700 bg-asphalt-800/70 px-4 py-3">
        <span className="label-mono font-bold text-kerb">{title ?? "Classification"}</span>
        <span className="label-mono text-tyre-grey">{gapLabel}</span>
      </div>
      <motion.ol
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      >
        {rows.map((row, i) => {
          const content = (
            <>
              <span className="w-8 shrink-0 font-mono text-sm font-bold text-kerb tabular">
                {row.position ?? pad(i + 1)}
              </span>
              <span
                aria-hidden
                className="h-6 w-1 shrink-0 skew-x-[-12deg] transition-[width] duration-300 ease-race group-hover:w-2"
                style={{ background: row.color ?? "var(--livery)" }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[15px] font-bold tracking-wider uppercase">
                  {row.name}
                </span>
                {row.detail && <span className="block truncate text-xs text-tyre-grey">{row.detail}</span>}
              </span>
              <span className="shrink-0 text-right font-mono text-xs text-tyre-grey tabular">
                {row.gap ?? (i === 0 ? "Leader" : "")}
              </span>
            </>
          );
          const cls =
            "group flex items-center gap-3 px-4 py-3 transition-colors duration-300 hover:bg-asphalt-800";
          return (
            <motion.li
              key={row.id}
              variants={{
                hidden: { opacity: 0, x: -16 },
                show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
              }}
              className="border-b border-asphalt-700/70 last:border-b-0"
            >
              {row.href ? (
                <Link href={row.href} className={cls}>
                  {content}
                </Link>
              ) : (
                <div className={cls}>{content}</div>
              )}
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}
