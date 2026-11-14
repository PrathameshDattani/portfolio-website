"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Download } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { CircuitMap } from "@/components/f1/CircuitMap";
import { RadioMessage } from "@/components/f1/RadioMessage";
import { StartLights } from "@/components/f1/StartLights";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/lib/motion";
import { pad } from "@/lib/utils";

const SPEED_LINES = Array.from({ length: 14 }, (_, i) => ({
  top: `${(i * 37) % 100}%`,
  width: `${18 + ((i * 13) % 22)}vw`,
  duration: `${2.4 + ((i * 7) % 10) / 4}s`,
  delay: `${-((i * 11) % 30) / 10}s`,
  opacity: 0.15 + ((i * 5) % 10) / 30,
}));

export function HomeHero() {
  const [ready, setReady] = useState(false);
  const onLightsOut = useCallback(() => setReady(true), []);
  const ref = useRef<HTMLElement>(null);

  // scroll-out parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const numberY = useTransform(scrollYProgress, [0, 1], [0, 260]);

  // pointer parallax on the giant number
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * -36);
      my.set((e.clientY / window.innerHeight - 0.5) * -24);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const words = profile.fullName.split(" ");
  const show = ready ? "show" : "hidden";

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-[var(--nav-h)]"
      aria-labelledby="hero-title"
    >
      <StartLights onLightsOut={onLightsOut} />

      {/* ── Background ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_60%_40%,black,transparent)]" />
        <div className="absolute -top-1/4 right-[-10%] h-[80vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,var(--livery-glow),transparent)] opacity-40 blur-3xl" />
        <div className="absolute inset-0 overflow-hidden">
          {SPEED_LINES.map((l, i) => (
            <span
              key={i}
              className="speed-line"
              style={{
                top: l.top,
                width: l.width,
                animationDuration: l.duration,
                animationDelay: l.delay,
                opacity: l.opacity,
              }}
            />
          ))}
        </div>
        <motion.div
          style={{ x: sx, y: sy }}
          className="absolute top-1/2 right-[-4vw] -translate-y-1/2 lg:right-[2vw]"
        >
          <motion.span
            style={{ y: numberY }}
            initial={{ opacity: 0, x: 80 }}
            animate={ready ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
            className="text-outline block font-display text-[58vw] leading-none font-black italic select-none lg:text-[38vw]"
          >
            {pad(profile.driverNumber)}
          </motion.span>
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-asphalt-950" />
      </div>

      {/* ── Content ── */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-race w-full">
        <div className="grid items-center gap-12 py-12 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            animate={show}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="skew-speed inline-block bg-livery px-2.5 py-1.5">
                <span className="unskew-speed label-mono block font-bold text-white">Starting grid</span>
              </span>
              <span className="label-mono text-tyre-grey">
                P1 · Car {pad(profile.driverNumber)} · {profile.shortName}
              </span>
            </motion.div>

            <h1 id="hero-title" className="display-italic font-black">
              <span className="sr-only">{`${profile.fullName}, ${profile.roleTitle}`}</span>
              <span aria-hidden className="block">
                {words.map((word, wi) => (
                  <span key={wi} className="block overflow-hidden pb-[0.06em] leading-[0.9]">
                    <motion.span
                      className="inline-block text-[52px] sm:text-[80px] lg:text-[96px] xl:text-[112px]"
                      style={{ color: wi === words.length - 1 ? "var(--livery)" : undefined }}
                      variants={{
                        hidden: { y: "110%", skewX: 0 },
                        show: { y: "0%", skewX: 0, transition: { duration: 0.9, ease: EASE, delay: wi * 0.08 } },
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>

            {/* Broadcast lower-third */}
            <motion.div
              variants={{
                hidden: { clipPath: "inset(0 100% 0 0)" },
                show: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.8, ease: EASE, delay: 0.35 } },
              }}
              className="mt-8 flex w-fit max-w-full items-stretch overflow-hidden rounded-[3px] border border-asphalt-700 bg-asphalt-900/80 backdrop-blur"
            >
              <span className="flex items-center bg-livery px-3.5 font-mono text-xl font-bold text-white tabular">
                {pad(profile.driverNumber)}
              </span>
              <dl className="flex flex-wrap items-stretch divide-x divide-asphalt-700 text-sm">
                {[
                  ["Role", profile.roleTitle],
                  ["Team", profile.teamName],
                  ["Home circuit", `${profile.locationFlag} ${profile.location}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col justify-center px-4 py-2.5">
                    <dt className="label-mono text-[10px] text-tyre-grey">{k}</dt>
                    <dd className="mt-1 font-display font-bold tracking-wide whitespace-nowrap uppercase">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.5 } } }}
              className="mt-6 max-w-xl"
            >
              <RadioMessage from={profile.shortName} message={profile.tagline} start={ready} delay={0.9} />
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.6 } } }}
              className="mt-9 flex flex-wrap items-center gap-4 pl-1.5"
            >
              <Button href="/races">View race calendar</Button>
              <Button
                href={profile.resumeUrl}
                variant="ghost"
                download
                icon={<Download aria-hidden size={16} strokeWidth={2.5} />}
              >
                Download spec sheet
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 40 }}
            animate={ready ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          >
            <LiveTiming />
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="label-mono text-[10px] text-tyre-grey">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-asphalt-700">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-livery"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/** Live timing panel: a car laps the driver's own procedurally generated circuit. */
function LiveTiming() {
  const speedRef = useRef<HTMLSpanElement>(null);
  const gearRef = useRef<HTMLSpanElement>(null);
  const throttleRef = useRef<HTMLSpanElement>(null);
  const sectorRef = useRef<HTMLSpanElement>(null);
  const lapRef = useRef<HTMLSpanElement>(null);
  const last = useRef(0);
  const lap = useRef(1);

  const onProgress = useCallback((p: number) => {
    if (p < last.current - 0.5) {
      lap.current += 1;
      if (lapRef.current) lapRef.current.textContent = pad(lap.current);
    }
    last.current = p;
    // A plausible speed profile around the lap
    const wave = Math.sin(p * Math.PI * 2 * 4) * 0.5 + Math.sin(p * Math.PI * 2 * 7 + 1) * 0.25;
    const speed = Math.round(232 + wave * 92);
    const gear = Math.max(2, Math.min(8, Math.round(speed / 41)));
    const throttle = Math.max(0, Math.min(100, Math.round(60 + wave * 80)));
    if (speedRef.current) speedRef.current.textContent = String(speed);
    if (gearRef.current) gearRef.current.textContent = String(gear);
    if (throttleRef.current) throttleRef.current.style.transform = `scaleX(${throttle / 100})`;
    if (sectorRef.current) sectorRef.current.textContent = `S${Math.min(3, Math.floor(p * 3) + 1)}`;
  }, []);

  return (
    <div className="relative overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900/70 shadow-2xl shadow-black/50 backdrop-blur-md">
      <div aria-hidden className="carbon absolute inset-0 opacity-50" />
      <div className="relative flex items-center gap-3 border-b border-asphalt-700 px-5 py-3.5">
        <span className="live-dot size-2 rounded-full bg-livery" aria-hidden />
        <span className="label-mono font-bold text-kerb">Live timing</span>
        <span className="label-mono ml-auto text-tyre-grey">
          Lap <span ref={lapRef}>01</span>
        </span>
      </div>
      <div className="relative px-6 pt-6 pb-2">
        <CircuitMap
          seed={profile.driverNumber}
          mode="always"
          lapTime={9}
          showSectors
          strokeWidth={2.6}
          onProgress={onProgress}
          title={`Original circuit generated from car number ${profile.driverNumber}`}
        />
      </div>
      <div className="relative grid grid-cols-3 divide-x divide-asphalt-700 border-t border-asphalt-700" aria-hidden>
        <div className="px-5 py-4">
          <p className="label-mono text-[10px] text-tyre-grey">Speed</p>
          <p className="mt-2 font-mono text-2xl font-bold tabular">
            <span ref={speedRef}>232</span>
            <span className="ml-1 text-xs text-tyre-grey">km/h</span>
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="label-mono text-[10px] text-tyre-grey">Gear</p>
          <p className="mt-2 font-mono text-2xl font-bold tabular">
            <span ref={gearRef}>6</span>
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="label-mono text-[10px] text-tyre-grey">Sector</p>
          <p className="mt-2 font-mono text-2xl font-bold text-purple tabular">
            <span ref={sectorRef}>S1</span>
          </p>
        </div>
      </div>
      <div className="relative border-t border-asphalt-700 px-5 py-3.5" aria-hidden>
        <div className="flex items-center justify-between">
          <span className="label-mono text-[10px] text-tyre-grey">Throttle</span>
          <span className="label-mono text-[10px] text-tyre-grey">DRS · Enabled</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-asphalt-700">
          <span
            ref={throttleRef}
            className="block h-full origin-left rounded-full bg-gradient-to-r from-green to-livery-2"
            style={{ transform: "scaleX(.6)" }}
          />
        </div>
      </div>
    </div>
  );
}
