"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useRef } from "react";
import { generateCircuit } from "@/lib/circuit-generator";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  seed?: number;
  /**
   * always: car laps continuously while visible.
   * hover: car laps while the closest [data-circuit-host] ancestor is hovered/focused.
   * none: static.
   */
  mode?: "always" | "hover" | "none";
  /** Seconds per lap */
  lapTime?: number;
  showSectors?: boolean;
  /** Draw the track on when it first scrolls into view */
  draw?: boolean;
  strokeWidth?: number;
  className?: string;
  /** Called every frame with lap progress 0..1 (for live telemetry readouts) */
  onProgress?: (p: number) => void;
  title?: string;
};

const SECTOR_COLORS = ["var(--sector-purple)", "var(--sector-green)", "var(--sector-yellow)"];

/** An original, procedurally generated circuit with a car dot that laps it. */
export function CircuitMap({
  seed = 1,
  mode = "hover",
  lapTime = 7,
  showSectors = false,
  draw = true,
  strokeWidth = 3,
  className,
  onProgress,
  title,
}: Props) {
  const circuit = useMemo(() => generateCircuit(seed), [seed]);
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const progressCb = useRef(onProgress);
  progressCb.current = onProgress;
  const gid = useId().replace(/:/g, "");

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const car = carRef.current;
    const trail = trailRef.current;
    if (!svg || !path || !car || !trail) return;

    const total = path.getTotalLength();
    let progress = 0;
    let running = false;
    let visible = false;
    let hovered = mode === "always";
    let frame = 0;
    let last = 0;
    let speed = mode === "always" ? 1 : 0; // eased 0..1 multiplier so the car accelerates/brakes

    const place = (p: number) => {
      const pt = path.getPointAtLength(p * total);
      const ahead = path.getPointAtLength(((p + 0.004) % 1) * total);
      const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
      car.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle})`);
      const trailLen = 0.09;
      trail.style.strokeDashoffset = String(-(p - trailLen));
      trail.style.opacity = String(Math.min(1, speed * 1.2));
      progressCb.current?.(p);
    };

    place(0);
    if (reduce || mode === "none") return;

    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      const target = hovered ? 1 : 0;
      speed += (target - speed) * Math.min(1, dt * 4);
      progress = (progress + (dt / lapTime) * speed) % 1;
      place(progress);
      if (!hovered && speed < 0.01 && mode === "hover") {
        running = false;
        last = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !visible) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      last = 0;
      cancelAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible && hovered) start();
      if (!visible) stop();
    });
    io.observe(svg);

    const host = mode === "hover" ? (svg.closest("[data-circuit-host]") as HTMLElement | null) : null;
    const enter = () => {
      hovered = true;
      start();
    };
    const leave = () => {
      hovered = false;
    };
    host?.addEventListener("pointerenter", enter);
    host?.addEventListener("pointerleave", leave);
    host?.addEventListener("focusin", enter);
    host?.addEventListener("focusout", leave);

    return () => {
      stop();
      io.disconnect();
      host?.removeEventListener("pointerenter", enter);
      host?.removeEventListener("pointerleave", leave);
      host?.removeEventListener("focusin", enter);
      host?.removeEventListener("focusout", leave);
    };
  }, [mode, lapTime, reduce, circuit]);

  const { width, height, start } = circuit;
  const drawProps = draw && !reduce
    ? {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true },
        transition: { duration: 1.6, ease: EASE },
      }
    : {};

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-auto w-full overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <filter id={`glow-${gid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* track bed */}
      <path
        d={circuit.d}
        fill="none"
        stroke="var(--asphalt-700)"
        strokeWidth={strokeWidth + 5}
        strokeLinejoin="round"
        opacity={0.55}
      />
      {/* centre line */}
      {showSectors ? (
        SECTOR_COLORS.map((color, i) => (
          <motion.path
            key={i}
            d={circuit.d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            pathLength={3}
            strokeDasharray="1 2"
            strokeDashoffset={-i}
            {...(draw && !reduce
              ? {
                  initial: { opacity: 0 },
                  whileInView: { opacity: 1 },
                  viewport: { once: true },
                  transition: { duration: 0.6, delay: 0.3 + i * 0.35, ease: EASE },
                }
              : {})}
          />
        ))
      ) : (
        <motion.path
          d={circuit.d}
          fill="none"
          stroke="var(--kerb-white)"
          strokeOpacity={0.9}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          {...drawProps}
        />
      )}
      {/* measuring path (invisible) */}
      <path ref={pathRef} d={circuit.d} fill="none" stroke="none" />

      {/* start / finish line */}
      <g transform={`translate(${start.x} ${start.y}) rotate(${start.angle + 90})`}>
        <rect x={-6} y={-1.5} width={12} height={3} fill="var(--kerb-white)" />
        <rect x={-6} y={-1.5} width={3} height={1.5} fill="var(--asphalt-950)" />
        <rect x={0} y={-1.5} width={3} height={1.5} fill="var(--asphalt-950)" />
        <rect x={-3} y={0} width={3} height={1.5} fill="var(--asphalt-950)" />
        <rect x={3} y={0} width={3} height={1.5} fill="var(--asphalt-950)" />
      </g>

      {/* trail */}
      <path
        ref={trailRef}
        d={circuit.d}
        fill="none"
        stroke="var(--livery)"
        strokeWidth={strokeWidth + 1}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="0.09 0.91"
        style={{ opacity: 0 }}
        filter={`url(#glow-${gid})`}
      />

      {/* car */}
      <g ref={carRef}>
        <circle r={strokeWidth + 4} fill="var(--livery)" opacity={0.35} filter={`url(#glow-${gid})`} />
        <circle r={strokeWidth + 0.8} fill="var(--livery)" stroke="var(--kerb-white)" strokeWidth={1.2} />
      </g>
    </svg>
  );
}
