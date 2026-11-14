"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";

const TRIGGER = "boxbox";

function formatTime(ms: number) {
  const total = ms / 1000;
  const m = Math.floor(total / 60);
  const s = (total % 60).toFixed(3).padStart(6, "0");
  return `${m}:${s}`;
}

/** Type "box box" anywhere (outside form fields) for a pit stop. */
export function EasterEgg() {
  const [open, setOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const buffer = useRef("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key.length !== 1) return;
      buffer.current = (buffer.current + e.key.toLowerCase()).replace(/\s/g, "").slice(-TRIGGER.length);
      if (buffer.current === TRIGGER) {
        buffer.current = "";
        setElapsed(performance.now());
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = window.setTimeout(() => setOpen(false), 4200);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="assertive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[90] grid place-items-center bg-asphalt-950/85 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-8 px-6 text-center">
            <p className="label-mono text-livery-ink">Team radio</p>
            <p className="font-display text-5xl font-black italic tracking-wider uppercase sm:text-7xl">
              Box, box!
            </p>

            {/* Top-down pit stop: car slides in, four wheel guns spin */}
            <svg viewBox="0 0 320 140" className="w-[min(420px,85vw)]" aria-hidden>
              <rect x="0" y="62" width="320" height="16" fill="var(--asphalt-800)" />
              <line x1="0" y1="70" x2="320" y2="70" stroke="var(--sector-yellow)" strokeDasharray="10 8" />
              <motion.g
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <rect x="110" y="56" width="110" height="28" rx="10" fill="var(--livery)" />
                <rect x="150" y="62" width="30" height="16" rx="6" fill="var(--asphalt-950)" />
                <rect x="214" y="50" width="14" height="40" rx="2" fill="var(--asphalt-700)" />
                <rect x="100" y="52" width="10" height="36" rx="2" fill="var(--asphalt-700)" />
                {[
                  [124, 40],
                  [124, 88],
                  [196, 40],
                  [196, 88],
                ].map(([x, y], i) => (
                  <g key={i}>
                    <rect x={x} y={y} width="20" height="12" rx="3" fill="#000" />
                    <motion.circle
                      cx={(x ?? 0) + 10}
                      cy={(y ?? 0) + (i % 2 ? 22 : -10)}
                      r="5"
                      fill="none"
                      stroke="var(--drs-cyan)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      initial={{ rotate: 0, opacity: 0 }}
                      animate={{ rotate: 720, opacity: [0, 1, 1, 0] }}
                      transition={{ delay: 0.75 + i * 0.05, duration: 1.4, ease: "linear" }}
                      style={{ originX: "50%", originY: "50%" }}
                    />
                  </g>
                ))}
              </motion.g>
            </svg>

            <div className="flex flex-col items-center gap-2">
              <p className="label-mono text-tyre-grey">Pit stop time (since page load)</p>
              <p className="font-mono text-4xl font-bold text-green tabular sm:text-5xl">
                {formatTime(elapsed)}
              </p>
            </div>
            <p className="label-mono text-tyre-grey">Click or press Esc to rejoin</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
