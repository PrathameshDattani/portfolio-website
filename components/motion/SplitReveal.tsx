"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { createElement, useRef, type ReactNode } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

/**
 * Masked word-by-word reveal: each word rises out of its own clipping box.
 * Plays when scrolled into view, or when `play` flips true (for the hero).
 * Screen readers get the plain text once.
 */
export function SplitReveal({
  text,
  as = "div",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
  duration = 1.1,
  play,
  id,
  children,
}: {
  text: string;
  as?: Tag;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Controlled trigger. When omitted, plays on scroll into view. */
  play?: boolean;
  id?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const go = play ?? inView;
  const words = text.split(" ");

  return createElement(
    as,
    { ref, className: cn("relative", className), id },
    <>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-top">
          <motion.span
            className={cn("inline-block will-change-transform", wordClassName)}
            initial={reduce ? { opacity: 0 } : { y: "112%", rotate: 4 }}
            animate={go ? (reduce ? { opacity: 1 } : { y: "0%", rotate: 0 }) : undefined}
            transition={{ duration, ease: EASE, delay: delay + i * stagger }}
            style={{ transformOrigin: "0% 100%" }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      {children}
    </>,
  );
}
