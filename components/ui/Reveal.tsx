"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { EASE } from "@/lib/motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; as?: "div" | "li" };

/** Fades content up once when it scrolls into view. Transforms are skipped under reduced motion. */
export function Reveal({ delay = 0, y = 40, as = "div", children, ...rest }: Props) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      {...(rest as HTMLMotionProps<"div"> & HTMLMotionProps<"li">)}
    >
      {children}
    </Comp>
  );
}

/** A hairline that draws itself left to right on scroll-in. */
export function Rule({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left bg-line-strong ${className ?? ""}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}
