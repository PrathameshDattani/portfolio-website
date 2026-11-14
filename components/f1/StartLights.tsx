"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useLenis } from "@/components/layout/SmoothScroll";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const INTRO_KEY = "lights-out";
const STEP = 700;
const LEAD_IN = 600;

type Phase = "pending" | "running" | "out" | "done";

/**
 * Five red lights fill one by one, hold, then go out. Fires `onLightsOut`.
 * Skippable by click / Esc / Enter / Space, shown once per session, skipped under reduced motion.
 */
export function StartLights({ onLightsOut }: { onLightsOut: () => void }) {
  const [phase, setPhase] = useState<Phase>("pending");
  const [lit, setLit] = useState(0);
  const timers = useRef<number[]>([]);
  const cb = useRef(onLightsOut);
  cb.current = onLightsOut;
  const lenis = useLenis();
  const fired = useRef(false);

  const finish = (fast: boolean) => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setLit(0);
    setPhase("out");
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    document.documentElement.classList.add("intro-seen");
    if (!fired.current) {
      fired.current = true;
      cb.current();
    }
    timers.current.push(window.setTimeout(() => setPhase("done"), fast ? 500 : 1100));
  };

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!site.enableIntroLights || seen || reduce) {
      setPhase("done");
      fired.current = true;
      cb.current();
      return;
    }
    setPhase("running");
    for (let i = 1; i <= 5; i++) {
      timers.current.push(window.setTimeout(() => setLit(i), LEAD_IN + i * STEP));
    }
    const hold = 500 + Math.random() * 700; // the unpredictable hold before lights out
    timers.current.push(window.setTimeout(() => finish(false), LEAD_IN + 5 * STEP + hold));
    const t = timers.current;
    return () => t.forEach(window.clearTimeout);
  }, []);

  // lock scrolling while the sequence runs
  useEffect(() => {
    if (phase !== "running") return;
    lenis?.stop();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (["Escape", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        finish(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, lenis]);

  const visible = phase === "pending" || phase === "running";
  const status =
    phase === "out" ? "Lights out" : lit === 0 ? "Formation lap complete" : `Light ${lit} of 5`;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="lights"
          className="start-lights fixed inset-0 z-[100] flex flex-col items-center justify-center bg-asphalt-950"
          initial={false}
          animate={visible ? { clipPath: "inset(0 0 0% 0)" } : { clipPath: "inset(0 0 100% 0)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: visible ? 0 : 0.35 }}
          onClick={() => phase === "running" && finish(true)}
        >
          <div aria-hidden className="grid-lines absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
          {/* livery edge that sweeps up with the reveal */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-livery" />

          <p className="label-mono relative mb-10 text-tyre-grey" aria-live="polite">
            {status}
          </p>

          {/* Gantry */}
          <div className="relative flex flex-col items-center" aria-hidden>
            <div className="h-3 w-[min(92vw,640px)] rounded-sm bg-asphalt-800" />
            <div className="-mt-1 flex gap-[clamp(8px,2.4vw,20px)]">
              {Array.from({ length: 5 }, (_, i) => {
                const on = lit > i;
                return (
                  <div
                    key={i}
                    className="flex flex-col gap-[clamp(5px,1.2vw,10px)] rounded-[clamp(8px,2vw,14px)] border border-asphalt-700 bg-[#060607] p-[clamp(6px,1.4vw,12px)] shadow-[inset_0_2px_12px_rgba(0,0,0,.8)]"
                  >
                    {[0, 1, 2, 3].map((row) => {
                      const red = row >= 2 && on;
                      return (
                        <span
                          key={row}
                          className={cn(
                            "block size-[clamp(22px,7vw,52px)] rounded-full transition-[background,box-shadow] duration-150",
                            red
                              ? "bg-[radial-gradient(circle_at_40%_35%,#ff6b5e,#e10600_45%,#7a0300)] shadow-[0_0_28px_6px_rgba(225,6,0,.55),0_0_80px_10px_rgba(225,6,0,.25)]"
                              : "bg-[radial-gradient(circle_at_40%_35%,#26262b,#141416_60%)]",
                          )}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mt-12 h-16 sm:h-20">
            <AnimatePresence>
              {phase === "out" && (
                <motion.p
                  initial={{ opacity: 0, y: 20, skewX: -6 }}
                  animate={{ opacity: 1, y: 0, skewX: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="font-display text-3xl font-black italic tracking-[0.06em] uppercase sm:text-5xl"
                >
                  Lights out<span className="text-livery">.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {phase === "running" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                finish(true);
              }}
              className="label-mono absolute right-5 bottom-6 rounded-[3px] border border-asphalt-700 px-3 py-2.5 text-tyre-grey transition-colors hover:border-kerb/50 hover:text-kerb sm:right-8 sm:bottom-8"
            >
              Skip intro · Esc
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
