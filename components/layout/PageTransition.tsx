"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { navItems } from "@/lib/nav";

let hasNavigated = false;

/**
 * Curtain transition: on navigation a dark panel carrying the destination's name
 * lifts away to reveal the page. Skipped on first load and under reduced motion.
 * The page wrapper only fades (no transform) so fixed children keep working.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const first = useRef(!hasNavigated);
  useEffect(() => {
    hasNavigated = true;
  }, []);
  const animate = !first.current && !reduce;
  const item = navItems.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
  const title = pathname === "/" ? "Grid" : (item?.label ?? "");

  return (
    <>
      {animate && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-ink-900"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.35 }}
        >
          <div className="overflow-hidden">
            <motion.p
              className="display text-[clamp(40px,8vw,120px)] font-[700]"
              initial={{ y: "100%" }}
              animate={{ y: ["100%", "0%", "0%", "-100%"] }}
              transition={{ duration: 1.1, times: [0, 0.35, 0.6, 1], ease: [0.76, 0, 0.24, 1] }}
            >
              {title}
            </motion.p>
          </div>
          <motion.span
            className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-livery"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
      <motion.div
        initial={animate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: animate ? 0.55 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
