"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { speedTrace } from "@/lib/circuit-generator";
import { cn } from "@/lib/utils";

type Props = {
  /** Data points; defaults to a generated speed trace */
  data?: number[];
  seed?: number;
  label?: string;
  unit?: string;
  color?: string;
  className?: string;
  height?: number;
};

const W = 600;

/** Speed-trace style area chart that draws itself as you scroll (GSAP ScrollTrigger). */
export function TelemetryChart({
  data,
  seed = 1,
  label = "Speed trace",
  unit = "km/h",
  color = "var(--livery)",
  className,
  height = 160,
}: Props) {
  const values = useMemo(() => data ?? speedTrace(seed), [data, seed]);
  const gid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const H = height;
  const pad = 8;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const x = (i: number) => (i / (values.length - 1)) * W;
  const y = (v: number) => pad + (1 - (v - min) / (max - min || 1)) * (H - pad * 2);

  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;

  useEffect(() => {
    const svg = svgRef.current;
    const lineEl = lineRef.current;
    const clip = clipRef.current;
    if (!svg || !lineEl || !clip) return;

    const reveal = () => clip.setAttribute("width", String(W));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    let killed = false;
    let cleanup = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 92%", end: "top 40%", scrub: 0.8 },
      });
      tl.fromTo(clip, { attr: { width: 0 } }, { attr: { width: W }, ease: "none" });
      cleanup = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    })();
    return () => {
      killed = true;
      cleanup();
    };
  }, [values]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left) / rect.width) * (values.length - 1));
    setHover(Math.max(0, Math.min(values.length - 1, i)));
  };

  const hv = hover !== null ? values[hover] : undefined;

  return (
    <figure className={cn("relative", className)}>
      <figcaption className="mb-3 flex items-center justify-between">
        <span className="label-mono text-tyre-grey">{label}</span>
        <span className="label-mono text-kerb tabular">
          {hv !== undefined ? `${Math.round(hv)} ${unit}` : `Max ${Math.round(max)} ${unit}`}
        </span>
      </figcaption>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="block h-auto w-full touch-pan-y"
        style={{ aspectRatio: `${W} / ${H}` }}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`${label}: ranges from ${Math.round(min)} to ${Math.round(max)} ${unit}`}
      >
        <defs>
          <linearGradient id={`fill-${gid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <clipPath id={`clip-${gid}`}>
            <rect ref={clipRef} x="0" y="0" width="0" height={H} />
          </clipPath>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={W}
            y1={H * f}
            y2={H * f}
            stroke="var(--asphalt-700)"
            strokeDasharray="3 6"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={area} fill={`url(#fill-${gid})`} clipPath={`url(#clip-${gid})`} />
        <path
          ref={lineRef}
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          clipPath={`url(#clip-${gid})`}
        />
        {hover !== null && hv !== undefined && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1="0"
              y2={H}
              stroke="var(--kerb-white)"
              strokeOpacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={x(hover)} cy={y(hv)} r="3.5" fill="var(--kerb-white)" vectorEffect="non-scaling-stroke" />
          </g>
        )}
      </svg>
    </figure>
  );
}
