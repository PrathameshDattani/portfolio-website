"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { EasterEgg } from "@/components/f1/EasterEgg";
import { FlagProvider } from "@/components/f1/FlagBanner";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <FlagProvider>
          {children}
          {site.enableEasterEgg && <EasterEgg />}
        </FlagProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
