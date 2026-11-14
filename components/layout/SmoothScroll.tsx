"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const LenisContext = createContext<Lenis | null>(null);

/** Access the smooth-scroll instance (null when reduced motion is on). */
export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const instance = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    setLenis(instance);

    const onChange = () => {
      if (media.matches) instance.destroy();
    };
    media.addEventListener("change", onChange);

    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", onChange);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // New route → start at the top, instantly.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
