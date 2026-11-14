"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { EASE } from "@/lib/motion";
import { pad } from "@/lib/utils";

/**
 * Portrait with a curtain reveal and a slow parallax. Without a photo it shows a
 * studio-lit plate with the driver number in brushed metal.
 */
export function Portrait({ src, alt, number }: { src?: string; alt: string; number: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={ref}
      className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-ink-900"
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="absolute -inset-[10%]"
        style={{ y }}
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        {src ? (
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" priority />
        ) : (
          <div className="relative size-full" role="img" aria-label={alt}>
            {/* studio light: key from top-left, livery rim from the right */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_35%_25%,#2a2a30_0%,#111114_45%,#060607_80%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_100%_70%,var(--livery-glow),transparent_70%)] opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="display metal text-[clamp(110px,15vw,240px)] font-[800] tracking-[-0.06em]">{pad(number)}</span>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,.05)_50%,transparent_60%)]" />
          </div>
        )}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,.6)]" />
    </motion.div>
  );
}
