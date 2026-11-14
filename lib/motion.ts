import type { Transition, Variants } from "framer-motion";

/** Fast out, smooth settle. Used everywhere. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = { micro: 0.15, ui: 0.3, piece: 0.8, max: 1.2 } as const;

export const ui: Transition = { duration: DURATION.ui, ease: EASE };
export const piece: Transition = { duration: DURATION.piece, ease: EASE };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: piece },
};

export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});
