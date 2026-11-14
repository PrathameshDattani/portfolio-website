"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useId, useMemo, useRef, useState } from "react";
import { speedTrace } from "@/lib/circuit-generator";
import { cn } from "@/lib/utils";

const W = 1000;

/** Fine-line speed trace that is drawn by your scroll; hover for a readout. */
export function TelemetryChart({
  seed = 1,
  label = "Speed trace",
  unit = "km/h",
  height = 180,
  className,
}: {
  seed?: number;
  label?: string;
  unit?: string;
  height?: number;
  className?: string;
}) {
  const values = useMemo(() => speedTrace(seed, 160), [seed]);
  const gid = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref as unknown as React.RefObject<HTMLElement>, offset: ["start 95%", "start 35%"] });
  const clipW = useTransform(scrollYProgress, [0, 1], [0, W]);

  const H = height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const x = (i: number) => (i / (values.length - 1)) * W;
  const y = (v: number) => 10 + (1 - (v - min) / (max - min || 1)) * (H - 20);
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const hv = hover !== null ? values[hover] : undefined;

  return (
    <figure className={cn("relative", className)}>
      <figcaption className="mb-4 flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <span className="eyebrow tabular !text-fg">
          {hv !== undefined ? `${Math.round(hv)} ${unit}` : `Vmax ${Math.round(max)} ${unit}`}
        </span>
      </figcaption>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full touch-pan-y"
        style={{ aspectRatio: `${W} / ${H}` }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setHover(Math.max(0, Math.min(values.length - 1, Math.round(((e.clientX - r.left) / r.width) * (values.length - 1)))));
        }}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`${label}: from ${Math.round(min)} to ${Math.round(max)} ${unit}`}
      >
        <defs>
          <linearGradient id={`f-${gid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--livery)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--livery)" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`c-${gid}`}>
            {reduce ? <rect width={W} height={H} /> : <motion.rect height={H} style={{ width: clipW }} />}
          </clipPath>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--line)" />
        ))}
        <g clipPath={`url(#c-${gid})`}>
          <path d={area} fill={`url(#f-${gid})`} />
          <path d={line} fill="none" stroke="var(--fg)" strokeWidth="1.2" strokeLinejoin="round" />
        </g>
        {hover !== null && hv !== undefined && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1="0" y2={H} stroke="var(--fg)" strokeOpacity="0.3" />
            <circle cx={x(hover)} cy={y(hv)} r="4" fill="var(--livery)" />
          </g>
        )}
      </svg>
    </figure>
  );
}
