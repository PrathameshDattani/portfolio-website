"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TRAIL_MS = 260; // how long a point of the beam lives

/**
 * Laser tracer: a glowing beam drawn through the last ~quarter second of pointer
 * positions, thick and bright at the head, thinning and fading toward the tail.
 * Mounted only once the custom cursor is enabled, so the canvas always exists.
 */
function LaserTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const color = getComputedStyle(document.documentElement).getPropertyValue("--livery").trim() || "#ff2a2a";
    const pts: { x: number; y: number; t: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // The beam follows a smoothed "head" that eases toward the pointer every frame,
    // so sharp mouse turns become arcs and points are evenly spaced in time.
    const target = { x: -1, y: -1 };
    const head = { x: -1, y: -1 };
    const move = (e: PointerEvent) => {
      if (target.x < 0) {
        head.x = e.clientX;
        head.y = e.clientY;
      }
      target.x = e.clientX;
      target.y = e.clientY;
    };

    // one continuous curve through pts[from..], using midpoints as anchors
    const tracePath = (from: number) => {
      const n = pts.length;
      const p0 = pts[from];
      if (!p0) return;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (let i = from + 1; i < n - 1; i++) {
        const p = pts[i]!;
        const q = pts[i + 1]!;
        ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
      }
      const last = pts[n - 1]!;
      ctx.lineTo(last.x, last.y);
    };

    const BANDS = 6; // stacked strokes, each shorter and wider: a smooth taper with no joints
    let raf = 0;
    let prev = performance.now();
    let drawn = false;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - prev, 50);
      prev = now;

      if (target.x >= 0) {
        const k = 1 - Math.exp(-dt / 28); // frame-rate independent easing
        head.x += (target.x - head.x) * k;
        head.y += (target.y - head.y) * k;
        const last = pts[pts.length - 1];
        if (!last || Math.hypot(head.x - last.x, head.y - last.y) > 0.6) pts.push({ x: head.x, y: head.y, t: now });
      }
      while (pts[0] && now - pts[0].t > TRAIL_MS) pts.shift();

      if (drawn) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawn = false;
      const n = pts.length;
      if (n < 3) return;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      for (let b = 0; b < BANDS; b++) {
        const f = b / BANDS; // 0 = full length, toward 1 = only the newest part
        tracePath(Math.floor(f * (n - 2)));
        ctx.globalAlpha = 0.16 + f * 0.12;
        ctx.shadowBlur = 6 + f * 10;
        ctx.lineWidth = 0.8 + f * 3.4;
        ctx.stroke();
      }
      // hot core along the newest half
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#ffe1e1";
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1.1;
      tracePath(Math.floor((n - 2) * 0.5));
      ctx.stroke();
      ctx.globalAlpha = 1;
      drawn = true;
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

/**
 * Custom cursor (fine pointers only): a red dot plus a trailing red ring with glow.
 * The ring grows over interactive elements and shows a label for [data-cursor="Label"].
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      const interactive = t?.closest("a, button, [role='button'], input, textarea, label, select");
      setLabel(labelled?.dataset.cursor ?? null);
      setHover(!!interactive || !!labelled);
    };
    const leave = () => setVisible(false);
    const pd = () => setDown(true);
    const pu = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", pd);
    window.addEventListener("pointerup", pu);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointerup", pu);
    };
  }, [x, y]);

  useEffect(() => {
    setHover(false);
    setLabel(null);
  }, [pathname]);

  if (!enabled) return null;
  const size = label ? 92 : hover ? 54 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120]" style={{ opacity: visible ? 1 : 0, transition: "opacity .3s" }}>
      <LaserTrail />
      <motion.div className="absolute top-0 left-0" style={{ x: rx, y: ry }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
          animate={{
            width: size,
            height: size,
            scale: down ? 0.85 : 1,
            backgroundColor: label ? "rgba(255, 68, 68, 1)" : "rgba(255, 68, 68, 0)",
            borderColor: label ? "rgba(255, 68, 68, 0)" : hover ? "rgba(255, 68, 68, 0.8)" : "rgba(255, 68, 68, 0.5)",
            boxShadow: hover ? "0 0 24px rgba(255, 68, 68, 0.8)" : "0 0 16px rgba(255, 68, 68, 0.6)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="font-mono text-[10px] tracking-[0.14em] text-white uppercase"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500"
          animate={{ width: hover ? 0 : 8, height: hover ? 0 : 8 }}
          transition={{ duration: 0.2 }}
          style={{ boxShadow: "0 0 12px rgba(255, 68, 68, 1), 0 0 20px rgba(255, 68, 68, 0.6)" }}
        />
      </motion.div>
    </div>
  );
}
