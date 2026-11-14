"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { EASE } from "@/lib/motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; as?: "div" | "li" };

/** Fades content up once when it scrolls into view. Transforms are skipped under reduced motion. */
export function Reveal({ delay = 0, y = 28, as = "div", children, ...rest }: Props) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...(rest as HTMLMotionProps<"div"> & HTMLMotionProps<"li">)}
    >
      {children}
    </Comp>
  );
}
