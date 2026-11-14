"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { theme } from "@/content/theme";
import { useLenis } from "@/components/layout/SmoothScroll";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { EASE } from "@/lib/motion";
import { fitDisplay } from "@/lib/fit";
import { pad } from "@/lib/utils";
import { Gantry } from "./Gantry";
import type { NightTrack } from "./night-track";

export const INTRO_KEY = "lights-out";
const CRUISE = 46;
const LAUNCH = 96;

type Phase = "loading" | "grid" | "lights" | "out" | "race";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const track = useRef<NightTrack | null>(null);
  const timers = useRef<number[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [lit, setLit] = useState(0);
  const [intro, setIntro] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const lenis = useLenis();

  // scroll-out: content drifts up and fades, scene dims
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentO = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const sceneO = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  useMotionValueEvent(scrollYProgress, "change", (v) => track.current?.setPaused(v >= 0.999));

  /* ── boot the scene ── */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {}
    const playIntro = site.enableIntroLights && !seen && !reduced;
    setIntro(playIntro);

    let disposed = false;
    import("./night-track")
      .then(({ createNightTrack }) => {
        if (disposed || !canvasRef.current) return;
        try {
          track.current = createNightTrack(canvasRef.current, {
            livery: theme.livery,
            reduced,
            initialSpeed: playIntro ? 0 : 14,
          });
        } catch {
          setWebgl(false);
        }
        if (playIntro) setPhase("grid");
        else {
          track.current?.setTarget(CRUISE, 0.9);
          setPhase("race");
        }
      })
      .catch(() => {
        setWebgl(false);
        setPhase("race");
      });

    const onMove = (e: PointerEvent) => {
      track.current?.setPointer((e.clientX / window.innerWidth - 0.5) * 2, -(e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // live speed readout
    let raf = 0;
    const tick = () => {
      const s = track.current?.speed() ?? 0;
      if (speedRef.current) speedRef.current.textContent = String(Math.round(s * 3.6)).padStart(3, "0");
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t = timers.current;
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      t.forEach(window.clearTimeout);
      window.removeEventListener("pointermove", onMove);
      track.current?.dispose();
      track.current = null;
    };
  }, []);

  /* ── start sequence ── */
  const lightsOut = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setLit(0);
    setPhase("out");
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    track.current?.setTarget(LAUNCH, 1.6);
    timers.current.push(window.setTimeout(() => setPhase("race"), 550));
    timers.current.push(window.setTimeout(() => track.current?.setTarget(CRUISE, 0.35), 3200));
  };

  useEffect(() => {
    if (phase !== "grid") return;
    // a beat on the grid, then five lights, a random hold, and go
    const step = 750;
    const lead = 1300;
    for (let i = 1; i <= 5; i++) timers.current.push(window.setTimeout(() => setLit(i), lead + i * step));
    timers.current.push(window.setTimeout(lightsOut, lead + 5 * step + 400 + Math.random() * 900));
    timers.current.push(window.setTimeout(() => setPhase((p) => (p === "grid" ? "lights" : p)), lead));
  }, [phase]);

  const running = intro && (phase === "grid" || phase === "lights");

  // lock scroll + keyboard skip while the lights run
  useEffect(() => {
    if (!running) return;
    lenis?.stop();
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (["Escape", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        lightsOut();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [running, lenis]);

  const racing = phase === "race" || (!intro && phase !== "loading");
  const [first, ...rest] = profile.fullName.split(" ");
  const last = rest.join(" ");

  return (
    <section ref={sectionRef} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink-950" aria-labelledby="hero-title">
      {/* scene */}
      <motion.div className="absolute inset-0" style={{ opacity: sceneO, scale: sceneScale }}>
        {webgl ? (
          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 size-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "loading" ? 0 : 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,#1a0b0b,#060607_70%)]" />
        )}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/80 to-transparent" />
      </motion.div>

      {/* gantry + sequence */}
      {intro && (phase === "grid" || phase === "lights" || phase === "out") && <Gantry lit={lit} gone={phase === "out"} />}
      <AnimatePresence>
        {running && (
          <motion.button
            type="button"
            onClick={lightsOut}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="eyebrow absolute right-[var(--gutter)] bottom-8 z-30 rounded-full border border-line-strong px-4 py-2.5 transition-colors hover:border-fg/50 hover:text-fg"
          >
            Skip intro · Esc
          </motion.button>
        )}
      </AnimatePresence>
      <p className="sr-only" aria-live="polite">
        {phase === "out" ? "Lights out" : lit ? `Light ${lit} of 5` : ""}
      </p>

      {/* content */}
      <motion.div style={{ y: contentY, opacity: contentO }} className="wrap relative z-10 flex h-full flex-col justify-end pb-[clamp(28px,6vh,64px)]">
        <motion.div
          className="mb-auto flex items-start justify-between pt-[calc(var(--nav-h)+clamp(24px,6vh,64px))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: racing ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <p className="eyebrow max-w-[18ch] leading-relaxed">
            {profile.roleTitle}
            <br />
            <span className="text-fg/70">{profile.teamName}</span>
          </p>
          <p className="eyebrow text-right leading-relaxed">
            Home circuit
            <br />
            <span className="text-fg/70">{profile.location}</span>
          </p>
        </motion.div>

        <h1 id="hero-title" className="display font-[750]" style={{ fontSize: fitDisplay(profile.fullName, 13.5, 220) }}>
          <span className="sr-only">{`${profile.fullName}, ${profile.roleTitle}`}</span>
          <span aria-hidden className="block">
            <SplitReveal as="span" text={first ?? ""} play={racing} className="block" duration={1.3} />
            <span className="flex items-end gap-[0.12em]">
              <SplitReveal as="span" text={last} play={racing} delay={0.12} duration={1.3} className="block" />
              <motion.span
                className="mb-[0.14em] font-mono text-[0.16em] font-normal tracking-normal text-livery"
                initial={{ opacity: 0 }}
                animate={{ opacity: racing ? 1 : 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                ({pad(profile.driverNumber)})
              </motion.span>
            </span>
          </span>
        </h1>

        <motion.div
          className="mt-[clamp(20px,4vh,44px)] grid items-end gap-6 border-t border-line pt-6 md:grid-cols-12"
          initial={{ opacity: 0, y: 20 }}
          animate={racing ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: EASE, delay: 0.55 }}
        >
          <p className="max-w-md text-[15px] leading-relaxed text-fg/80 md:col-span-6">{profile.tagline}</p>
          <div className="flex items-center gap-3 md:col-span-3 md:justify-center" aria-hidden>
            <span className="relative h-9 w-px overflow-hidden bg-line-strong">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-fg" />
            </span>
            <span className="eyebrow">Scroll</span>
          </div>
          <div className="flex items-baseline gap-2 md:col-span-3 md:justify-end" aria-hidden>
            <span ref={speedRef} className="font-mono text-3xl font-light text-fg tabular">
              000
            </span>
            <span className="eyebrow">km/h</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
