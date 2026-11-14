"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Start-light gantry rendered as real hardware: a lattice truss, a dark housing
 * and five columns of LED-matrix lenses with bloom when lit.
 */
export function Gantry({ lit, gone }: { lit: number; gone: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="gantry pointer-events-none absolute top-0 left-1/2 z-20 w-max max-w-[94vw] -translate-x-1/2"
      initial={{ y: "-100%", opacity: 0 }}
      animate={
        gone
          ? { y: "-160%", scale: 1.5, opacity: 0, filter: "blur(8px)" }
          : { y: "0%", scale: 1, opacity: 1, filter: "blur(0px)" }
      }
      transition={gone ? { duration: 0.9, ease: [0.55, 0, 0.75, 0] } : { duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "50% 0%" }}
    >
      {/* hanging struts */}
      <div className="mx-auto flex w-[78%] justify-between">
        {[0, 1].map((i) => (
          <div key={i} className="h-[clamp(28px,9vh,90px)] w-2 bg-gradient-to-r from-[#0b0b0d] via-[#1d1d22] to-[#0b0b0d]" />
        ))}
      </div>
      {/* truss */}
      <div className="relative h-5 rounded-[2px] bg-[#0d0d10] shadow-[0_10px_30px_rgba(0,0,0,.8)]">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute inset-[3px] opacity-60 [background:repeating-linear-gradient(60deg,#25252b_0_2px,transparent_2px_14px),repeating-linear-gradient(-60deg,#25252b_0_2px,transparent_2px_14px)]" />
      </div>
      {/* housing */}
      <div className="relative -mt-1 flex justify-center gap-[clamp(6px,1.6vw,14px)] rounded-b-md bg-gradient-to-b from-[#121216] to-[#08080a] px-[clamp(8px,2vw,18px)] pt-3 pb-[clamp(10px,2vw,18px)] shadow-[0_30px_60px_rgba(0,0,0,.9)] ring-1 ring-white/[0.06]">
        <div className="pointer-events-none absolute inset-x-6 top-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col gap-[clamp(5px,1vw,10px)] rounded-[6px] bg-[#050506] p-[clamp(4px,0.8vw,8px)] ring-1 ring-white/[0.05]"
          >
            {[0, 1].map((r) => (
              <Lens key={r} on={lit > i} />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Lens({ on }: { on: boolean }) {
  return (
    <span className="relative block size-[clamp(30px,7.4vw,66px)]">
      {/* bloom halo */}
      <span
        className={cn(
          "absolute -inset-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(255,40,20,.55),rgba(255,20,10,.18)_45%,transparent)] blur-md transition-opacity duration-75",
          on ? "opacity-100" : "opacity-0",
        )}
      />
      {/* lens body */}
      <span className="absolute inset-0 overflow-hidden rounded-full bg-[#0a0303] shadow-[inset_0_0_0_2px_#000,inset_0_6px_14px_rgba(0,0,0,.9)]">
        {/* LED matrix */}
        <span
          className="absolute inset-[8%] rounded-full transition-[filter,opacity] duration-75"
          style={{
            backgroundImage: on
              ? "radial-gradient(circle, #fff3ea 0 18%, #ff3b24 30%, #b80d00 46%, transparent 52%)"
              : "radial-gradient(circle, #2a0a07 0 30%, #140403 46%, transparent 52%)",
            backgroundSize: "clamp(4px,0.75vw,6.5px) clamp(4px,0.75vw,6.5px)",
            filter: on ? "drop-shadow(0 0 3px rgba(255,60,30,.9))" : "none",
          }}
        />
        {/* hot centre */}
        <span
          className={cn(
            "absolute inset-[20%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,170,.55),transparent)] transition-opacity duration-75",
            on ? "opacity-100" : "opacity-0",
          )}
        />
        {/* glass reflection */}
        <span className="absolute inset-0 rounded-full bg-[linear-gradient(160deg,rgba(255,255,255,.14),transparent_35%,transparent_70%,rgba(255,255,255,.04))]" />
      </span>
    </span>
  );
}
