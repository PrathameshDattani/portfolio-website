"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";

const TRIGGER = "boxbox";

function format(ms: number) {
  const s = ms / 1000;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(3).padStart(6, "0")}`;
}

/** Type "box box" anywhere (outside form fields): a pit-stop timer shows the time since page load. */
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
    const close = window.setTimeout(() => setOpen(false), 4000);
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
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[115] flex flex-col items-center justify-center bg-ink-950/90 backdrop-blur-md"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <p className="eyebrow">Team radio · Box, box</p>
          <div className="overflow-hidden">
            <motion.p
              className="display mt-6 text-[clamp(56px,13vw,200px)] font-[300] tabular"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            >
              {format(elapsed)}
            </motion.p>
          </div>
          <p className="eyebrow mt-6">Pit stop time · since lights out on this page</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
