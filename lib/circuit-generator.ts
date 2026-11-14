import { mulberry32 } from "./utils";

export type Point = { x: number; y: number };

export type Circuit = {
  /** Closed SVG path for the track centre line */
  d: string;
  width: number;
  height: number;
  /** Start/finish position and the direction of travel there (degrees) */
  start: Point & { angle: number };
};

type Options = { width?: number; height?: number; padding?: number };

/**
 * Builds an original, stylised closed circuit from a seed.
 * ~8–12 jittered polar points are smoothed with a closed Catmull-Rom spline and
 * converted to cubic Béziers. Points stay angularly ordered, so the shape is
 * star-shaped and never self-intersects.
 */
export function generateCircuit(seed = 1, opts: Options = {}): Circuit {
  const { width = 200, height = 130, padding = 12 } = opts;
  const rand = mulberry32(seed * 9973 + 17);
  const n = 8 + Math.floor(rand() * 5);
  const step = (Math.PI * 2) / n;

  const raw: Point[] = [];
  for (let i = 0; i < n; i++) {
    const angle = i * step + (rand() - 0.5) * step * 0.55;
    let r = 0.62 + rand() * 0.38;
    // occasional tight inward kink: hairpins and chicanes
    if (rand() < 0.28) r *= 0.5 + rand() * 0.15;
    raw.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }

  // normalise into the viewBox
  const xs = raw.map((p) => p.x);
  const ys = raw.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const sx = (width - padding * 2) / (maxX - minX || 1);
  const sy = (height - padding * 2) / (maxY - minY || 1);
  const pts = raw.map((p) => ({
    x: padding + (p.x - minX) * sx,
    y: padding + (p.y - minY) * sy,
  }));

  const at = (i: number) => pts[((i % n) + n) % n] as Point;
  const f = (v: number) => v.toFixed(2);

  let d = `M${f(at(0).x)},${f(at(0).y)}`;
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(p2.x)},${f(p2.y)}`;
  }
  d += " Z";

  const s = at(0);
  const t = { x: at(1).x - at(-1).x, y: at(1).y - at(-1).y };
  const angle = (Math.atan2(t.y, t.x) * 180) / Math.PI;

  return { d, width, height, start: { x: s.x, y: s.y, angle } };
}

/**
 * A plausible-looking speed trace (km/h) for telemetry charts: long straights,
 * heavy braking zones and acceleration out of corners. Deterministic per seed.
 */
export function speedTrace(seed = 1, samples = 120): number[] {
  const rand = mulberry32(seed * 7919 + 3);
  const out: number[] = [];
  let v = 180;
  let target = 300;
  let hold = 0;
  for (let i = 0; i < samples; i++) {
    if (hold <= 0) {
      const braking = v > 240 && rand() < 0.45;
      target = braking ? 80 + rand() * 90 : 270 + rand() * 50;
      hold = 6 + Math.floor(rand() * 14);
    }
    hold--;
    const k = target < v ? 0.35 : 0.12; // brakes bite harder than the engine pulls
    v += (target - v) * k + (rand() - 0.5) * 3;
    out.push(Math.max(60, Math.min(340, v)));
  }
  return out;
}
