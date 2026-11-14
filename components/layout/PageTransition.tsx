"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

let hasNavigated = false;

/**
 * Livery wipe between routes: a dark panel trailed by livery stripes sweeps off-screen
 * like a car passing the camera. Skipped on the very first load and under reduced motion.
 * The page wrapper only fades (no transform) so fixed-position children keep working.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const first = useRef(!hasNavigated);
  useEffect(() => {
    hasNavigated = true;
  }, []);
  const animate = !first.current && !reduce;

  return (
    <>
      {animate && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 -left-[40vw] z-[90] flex w-[175vw]"
          initial={{ x: "0%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="h-full w-[3vw] shrink-0 -skew-x-12 bg-livery-2" />
          <div className="ml-[1vw] h-full w-[12vw] shrink-0 -skew-x-12 bg-livery" />
          <div className="-ml-px h-full flex-1 -skew-x-12 bg-asphalt-900" />
        </motion.div>
      )}
      <motion.div
        initial={animate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: animate ? 0.2 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
