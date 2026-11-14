"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const START = -210;
const SWEEP = 240;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M${a.x.toFixed(2)},${a.y.toFixed(2)} A${r},${r} 0 ${large} 1 ${b.x.toFixed(2)},${b.y.toFixed(2)}`;
}

/** Timing-screen semantics: purple = best, green = strong, yellow = developing. */
export function proficiencyColor(pct: number) {
  if (pct >= 85) return "var(--sector-purple)";
  if (pct >= 65) return "var(--sector-green)";
  return "var(--sector-yellow)";
}

type Props = {
  /** Value on the dial */
  value: number;
  max?: number;
  label: string;
  unit?: string;
  size?: number;
  className?: string;
  /** Override the dial colour */
  color?: string;
};

/** Radial gauge, 0..max. Needle and arc sweep in when scrolled into view. */
export function SpeedometerGauge({ value, max = 100, label, unit, size = 140, className, color }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const pct = Math.max(0, Math.min(1, value / max));
  const [shown, setShown] = useState(0);
  const decimals = Number.isInteger(value) ? 0 : 1;
  const tint = color ?? proficiencyColor(pct * 100);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(value);
      return;
    }
    const c = animate(0, value, { duration: 1.4, ease: EASE, onUpdate: setShown });
    return () => c.stop();
  }, [inView, value, reduce]);

  const cx = 60;
  const cy = 60;
  const r = 48;
  const ticks = Array.from({ length: 13 }, (_, i) => START + (SWEEP / 12) * i);
  const needleDeg = START + SWEEP * (inView || reduce ? pct : 0);

  return (
    <figure className={cn("flex flex-col items-center", className)} style={{ width: size }}>
      <svg ref={ref} viewBox="0 0 120 104" width={size} height={(size * 104) / 120} aria-hidden>
        <path d={arc(cx, cy, r, START, START + SWEEP)} fill="none" stroke="var(--asphalt-700)" strokeWidth="7" />
        <motion.path
          d={arc(cx, cy, r, START, START + SWEEP)}
          fill="none"
          stroke={tint}
          strokeWidth="7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView || reduce ? pct : 0 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        {ticks.map((deg, i) => {
          const a = polar(cx, cy, r - 9, deg);
          const b = polar(cx, cy, r - (i % 3 === 0 ? 15 : 12), deg);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={i % 3 === 0 ? "var(--tyre-grey)" : "var(--asphalt-600)"}
              strokeWidth={i % 3 === 0 ? 1.4 : 1}
            />
          );
        })}
        <motion.g
          initial={{ rotate: START }}
          animate={{ rotate: needleDeg }}
          transition={{ duration: 1.4, ease: EASE }}
          // fill-box of the needle starts at the hub: rotate around its left-centre
          style={{ originX: 0, originY: 0.5 }}
        >
          <line x1={cx} y1={cy} x2={cx + r - 14} y2={cy} stroke="var(--kerb-white)" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        <circle cx={cx} cy={cy} r="4.5" fill="var(--asphalt-950)" stroke="var(--kerb-white)" strokeWidth="1.5" />
        <text
          x={cx}
          y={cy + 30}
          textAnchor="middle"
          fontFamily="var(--font-jetbrains)"
          fontWeight="700"
          fontSize="15"
          fill="var(--kerb-white)"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {shown.toFixed(decimals)}
          {unit && (
            <tspan fontSize="9" fill="var(--tyre-grey)" dx="1.5">
              {unit}
            </tspan>
          )}
        </text>
      </svg>
      <figcaption className="label-mono mt-1 text-center text-tyre-grey">
        {label}
        <span className="sr-only">{`: ${value}${unit ?? ""} of ${max}${unit ?? ""}`}</span>
      </figcaption>
    </figure>
  );
}
