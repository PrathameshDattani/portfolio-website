"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";

/** Counts a numeric value up when it scrolls into view. Non-numeric values render as-is. */
export function CountUp({
  value,
  suffix,
  duration = 1.6,
  className,
}: {
  value: string | number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const numeric = typeof value === "number";
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!numeric || !inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const c = animate(0, value, { duration, ease: EASE, onUpdate: setN });
    return () => c.stop();
  }, [inView, numeric, value, reduce, duration]);

  const decimals = numeric ? (String(value).split(".")[1] ?? "").length : 0;
  return (
    <span ref={ref} className={className}>
      {numeric ? n.toFixed(decimals) : value}
      {suffix}
    </span>
  );
}
