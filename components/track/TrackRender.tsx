"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { theme } from "@/content/theme";
import { circuitPolyline, type Point, type Polyline } from "@/lib/circuit-generator";
import { cn, mulberry32 } from "@/lib/utils";

/**
 * Night-time aerial render of an original, procedurally generated circuit:
 * mown grass, asphalt run-off, gravel traps on corner exits, kerbs only where the track
 * actually turns, white lines, a start grid, pit buildings, grandstands and floodlight pools.
 * A single car laps it with a fading light trail.
 */
type Props = {
  seed: number;
  /** width / height */
  aspect?: number;
  mode?: "always" | "hover" | "none";
  lapTime?: number;
  className?: string;
  label?: string;
};

const W = 1000;

function noiseTile(size: number, seed: number, alpha: number, tone: [number, number, number]) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const r = mulberry32(seed);
  for (let i = 0; i < size * size; i++) {
    const v = r();
    img.data[i * 4] = tone[0] * v;
    img.data[i * 4 + 1] = tone[1] * v;
    img.data[i * 4 + 2] = tone[2] * v;
    img.data[i * 4 + 3] = alpha * 255 * (0.3 + v * 0.7);
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function offset(pl: Polyline, d: number): Point[] {
  const n = pl.points.length;
  return pl.points.map((p, i) => {
    const a = pl.points[(i - 1 + n) % n]!;
    const b = pl.points[(i + 1) % n]!;
    const tx = b.x - a.x;
    const ty = b.y - a.y;
    const l = Math.hypot(tx, ty) || 1;
    return { x: p.x - (ty / l) * d, y: p.y + (tx / l) * d };
  });
}

function strokePoly(ctx: CanvasRenderingContext2D, pts: Point[], closed = true) {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  if (closed) ctx.closePath();
  ctx.stroke();
}

function drawStatic(ctx: CanvasRenderingContext2D, pl: Polyline, H: number, seed: number) {
  const rand = mulberry32(seed * 31 + 7);
  const n = pl.points.length;
  const trackW = 26;
  const livery = theme.livery;

  // ── ground: grass with mowing stripes and texture
  ctx.fillStyle = "#06090a";
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-0.5 + rand() * 0.3);
  for (let i = -30; i < 30; i++) {
    ctx.fillStyle = i % 2 ? "rgba(40,70,45,0.10)" : "rgba(20,40,25,0.10)";
    ctx.fillRect(i * 40, -W, 40, W * 2);
  }
  ctx.restore();
  const grain = ctx.createPattern(noiseTile(128, seed, 0.35, [60, 90, 60]), "repeat")!;
  ctx.fillStyle = grain;
  ctx.fillRect(0, 0, W, H);

  // ── paved run-off halo
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(24,25,27,0.85)";
  ctx.lineWidth = trackW * 2.6;
  strokePoly(ctx, pl.points);

  // ── gravel traps on the outside of tight corners
  const gravel = ctx.createPattern(noiseTile(96, seed + 3, 0.9, [120, 104, 80]), "repeat")!;
  for (let i = 0; i < n; i += 4) {
    const k = pl.curvature[i]!;
    if (Math.abs(k) < 0.022) continue;
    const p = pl.points[i]!;
    const a = pl.points[(i - 1 + n) % n]!;
    const b = pl.points[(i + 1) % n]!;
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    const side = k > 0 ? -1 : 1;
    const nx = -Math.sin(ang) * side;
    const ny = Math.cos(ang) * side;
    ctx.save();
    ctx.translate(p.x + nx * trackW * 1.55, p.y + ny * trackW * 1.55);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.ellipse(0, 0, trackW * 1.5, trackW * 0.75, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#2a251d";
    ctx.fill();
    ctx.fillStyle = gravel;
    ctx.globalAlpha = 0.55;
    ctx.fill();
    ctx.restore();
  }

  // ── pit garages along the start straight, grandstands opposite
  const startIdx = 0;
  for (let g = 0; g < 2; g++) {
    const side = g === 0 ? 1 : -1;
    for (let j = 0; j < 9; j++) {
      const i = (startIdx + j * 4 + n) % n;
      const p = pl.points[i]!;
      const q = pl.points[(i + 1) % n]!;
      const ang = Math.atan2(q.y - p.y, q.x - p.x);
      const dist = trackW * (g === 0 ? 2.1 : 2.4);
      ctx.save();
      ctx.translate(p.x - Math.sin(ang) * dist * side, p.y + Math.cos(ang) * dist * side);
      ctx.rotate(ang);
      if (g === 0) {
        ctx.fillStyle = "#17181b";
        ctx.fillRect(-11, -9, 22, 18);
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(-11, -9, 22, 3);
      } else {
        ctx.fillStyle = "#121316";
        ctx.fillRect(-11, -7, 22, 14);
        for (let s = 0; s < 4; s++) {
          ctx.fillStyle = s % 2 ? "rgba(255,255,255,0.05)" : `${livery}22`;
          ctx.fillRect(-11, -7 + s * 3.5, 22, 2);
        }
      }
      ctx.restore();
    }
  }

  // ── kerbs: only where the track turns, on both edges
  const kerbEdge = trackW / 2 + 3;
  const outer = offset(pl, kerbEdge);
  const inner = offset(pl, -kerbEdge);
  const outerIn = offset(pl, trackW / 2 - 0.5);
  const innerIn = offset(pl, -(trackW / 2 - 0.5));
  for (let i = 0; i < n; i++) {
    if (Math.abs(pl.curvature[i]!) < 0.012) continue;
    const j = (i + 1) % n;
    const colour = Math.floor(i / 2) % 2 ? "#e9e9ea" : livery;
    for (const [o, ii] of [
      [outer, outerIn],
      [inner, innerIn],
    ] as const) {
      ctx.beginPath();
      ctx.moveTo(ii[i]!.x, ii[i]!.y);
      ctx.lineTo(o[i]!.x, o[i]!.y);
      ctx.lineTo(o[j]!.x, o[j]!.y);
      ctx.lineTo(ii[j]!.x, ii[j]!.y);
      ctx.closePath();
      ctx.fillStyle = colour;
      ctx.globalAlpha = 0.8;
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  // ── asphalt
  ctx.strokeStyle = "#1d1e21";
  ctx.lineWidth = trackW;
  strokePoly(ctx, pl.points);
  ctx.strokeStyle = ctx.createPattern(noiseTile(64, seed + 9, 0.22, [190, 190, 200]), "repeat")!;
  strokePoly(ctx, pl.points);
  // rubbered racing line
  ctx.strokeStyle = "rgba(0,0,0,0.28)";
  ctx.lineWidth = trackW * 0.38;
  strokePoly(ctx, offset(pl, 3));

  // ── white edge lines
  ctx.strokeStyle = "rgba(235,235,235,0.75)";
  ctx.lineWidth = 1.3;
  strokePoly(ctx, offset(pl, trackW / 2 - 2));
  strokePoly(ctx, offset(pl, -(trackW / 2 - 2)));

  // ── start/finish chequer + grid slots
  const p0 = pl.points[0]!;
  const p1 = pl.points[1]!;
  const ang0 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  ctx.save();
  ctx.translate(p0.x, p0.y);
  ctx.rotate(ang0);
  const sq = 3;
  for (let r = 0; r < 2; r++)
    for (let c = -trackW / 2; c < trackW / 2; c += sq) {
      ctx.fillStyle = (Math.round(c / sq) + r) % 2 ? "#f2f2f2" : "#0b0b0c";
      ctx.fillRect(r * sq - sq, c, sq, sq);
    }
  ctx.strokeStyle = "rgba(240,240,240,0.7)";
  ctx.lineWidth = 1;
  for (let g = 1; g <= 6; g++) {
    const x = -g * 13;
    const y = g % 2 ? -trackW / 4 : trackW / 4;
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 4);
    ctx.lineTo(x, y - 4);
    ctx.lineTo(x, y + 4);
    ctx.lineTo(x - 3, y + 4);
    ctx.stroke();
  }
  ctx.restore();

  // ── floodlight pools (additive)
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < n; i += Math.floor(n / 14)) {
    const p = pl.points[i]!;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, trackW * 3.2);
    g.addColorStop(0, "rgba(255,226,190,0.10)");
    g.addColorStop(1, "rgba(255,226,190,0)");
    ctx.fillStyle = g;
    ctx.fillRect(p.x - trackW * 4, p.y - trackW * 4, trackW * 8, trackW * 8);
  }
  ctx.globalCompositeOperation = "source-over";

  // ── lens: vignette
  const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.75);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.75)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

function pointAt(pl: Polyline, dist: number): { p: Point; ang: number } {
  const d = ((dist % pl.total) + pl.total) % pl.total;
  let lo = 0;
  let hi = pl.lengths.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (pl.lengths[mid]! <= d) lo = mid;
    else hi = mid;
  }
  const n = pl.points.length;
  const a = pl.points[lo % n]!;
  const b = pl.points[(lo + 1) % n]!;
  const t = (d - pl.lengths[lo]!) / (pl.lengths[lo + 1]! - pl.lengths[lo]! || 1);
  return { p: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, ang: Math.atan2(b.y - a.y, b.x - a.x) };
}

export function TrackRender({ seed, aspect = 16 / 10, mode = "hover", lapTime = 10, className, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const H = Math.round(W / aspect);
    const pl = circuitPolyline(seed, W, H, Math.min(W, H) * 0.14, 48);

    const base = document.createElement("canvas");
    let scale = 1;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 600;
      scale = (cssW * dpr) / W;
      canvas.width = Math.round(W * scale);
      canvas.height = Math.round(H * scale);
      base.width = canvas.width;
      base.height = canvas.height;
      const b = base.getContext("2d")!;
      b.setTransform(scale, 0, 0, scale, 0, 0);
      drawStatic(b, pl, H, seed);
    };

    let dist = pl.total * 0.02;
    let speed = mode === "always" ? 1 : 0;
    let hovered = mode === "always";
    let visible = false;
    let raf = 0;
    let last = 0;
    const trail: Point[] = [];

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      const { p, ang } = pointAt(pl, dist);
      // trail
      if (trail.length > 1) {
        ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1]!;
          const b = trail[i]!;
          ctx.strokeStyle = `rgba(255,40,20,${(i / trail.length) * 0.5 * Math.min(1, speed * 1.4)})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.globalCompositeOperation = "source-over";
      }
      // car: body, halo, headlight cone
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(ang);
      ctx.globalCompositeOperation = "lighter";
      const cone = ctx.createRadialGradient(10, 0, 0, 10, 0, 46);
      cone.addColorStop(0, "rgba(255,245,230,0.35)");
      cone.addColorStop(1, "rgba(255,245,230,0)");
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(54, -16);
      ctx.lineTo(54, 16);
      ctx.closePath();
      ctx.fill();
      const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
      halo.addColorStop(0, "rgba(255,60,30,0.55)");
      halo.addColorStop(1, "rgba(255,60,30,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(-18, -18, 36, 36);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = theme.livery;
      ctx.beginPath();
      ctx.roundRect(-8, -3, 16, 6, 2.5);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.fillRect(-1, -1.6, 4, 3.2);
      ctx.restore();
    };

    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      speed += ((hovered ? 1 : 0) - speed) * Math.min(1, dt * 3);
      // slow into corners, fast on straights
      const k = Math.abs(pl.curvature[Math.floor((dist / pl.total) * pl.points.length) % pl.points.length] ?? 0);
      const pace = 1.25 - Math.min(0.7, k * 22);
      dist += (pl.total / lapTime) * dt * speed * pace;
      const { p } = pointAt(pl, dist);
      trail.push(p);
      if (trail.length > 26) trail.shift();
      if (speed < 0.02 && !hovered) trail.length = 0;
      draw();
      if (!hovered && speed < 0.01 && mode !== "always") {
        raf = 0;
        last = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || !visible || reduce || mode === "none") return;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };

    build();
    draw();

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible && hovered) start();
      if (!visible) stop();
    });
    io.observe(canvas);

    const host = mode === "hover" ? (canvas.closest("[data-track-host]") as HTMLElement | null) : null;
    const enter = () => {
      hovered = true;
      start();
    };
    const leave = () => {
      hovered = false;
    };
    host?.addEventListener("pointerenter", enter);
    host?.addEventListener("pointerleave", leave);
    host?.addEventListener("focusin", enter);
    host?.addEventListener("focusout", leave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host?.removeEventListener("pointerenter", enter);
      host?.removeEventListener("pointerleave", leave);
      host?.removeEventListener("focusin", enter);
      host?.removeEventListener("focusout", leave);
    };
  }, [seed, aspect, mode, lapTime, reduce]);

  return (
    <canvas
      ref={ref}
      className={cn("block h-auto w-full", className)}
      style={{ aspectRatio: String(aspect) }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
