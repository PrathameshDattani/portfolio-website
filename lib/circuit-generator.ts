import { mulberry32 } from "./utils";

export type Point = { x: number; y: number };

export type Circuit = {
  /** Closed SVG path for the track centre line */
  d: string;
  width: number;
  height: number;
  /** Start/finish position and direction of travel (degrees) */
  start: Point & { angle: number };
};

type Options = { width?: number; height?: number; padding?: number };

/** Jittered polar control points, normalised into the box. Angularly ordered → never self-intersects. */
function controlPoints(seed: number, width: number, height: number, padding: number): Point[] {
  const rand = mulberry32(seed * 9973 + 17);
  const n = 8 + Math.floor(rand() * 5);
  const step = (Math.PI * 2) / n;
  const raw: Point[] = [];
  for (let i = 0; i < n; i++) {
    const angle = i * step + (rand() - 0.5) * step * 0.55;
    let r = 0.62 + rand() * 0.38;
    if (rand() < 0.28) r *= 0.5 + rand() * 0.15; // hairpins and chicanes
    raw.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  const xs = raw.map((p) => p.x);
  const ys = raw.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const sx = (width - padding * 2) / (maxX - minX || 1);
  const sy = (height - padding * 2) / (maxY - minY || 1);
  return raw.map((p) => ({ x: padding + (p.x - minX) * sx, y: padding + (p.y - minY) * sy }));
}

/** Closed Catmull-Rom → cubic Bézier segments [p1, c1, c2, p2]. */
function segments(pts: Point[]): [Point, Point, Point, Point][] {
  const n = pts.length;
  const at = (i: number) => pts[((i % n) + n) % n] as Point;
  const out: [Point, Point, Point, Point][] = [];
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    out.push([
      p1,
      { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      p2,
    ]);
  }
  return out;
}

export function generateCircuit(seed = 1, opts: Options = {}): Circuit {
  const { width = 200, height = 130, padding = 12 } = opts;
  const segs = segments(controlPoints(seed, width, height, padding));
  const f = (v: number) => v.toFixed(2);
  const first = segs[0]![0];
  let d = `M${f(first.x)},${f(first.y)}`;
  for (const [, c1, c2, p2] of segs) d += ` C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(p2.x)},${f(p2.y)}`;
  d += " Z";
  const [, c1] = segs[0]!;
  const angle = (Math.atan2(c1.y - first.y, c1.x - first.x) * 180) / Math.PI;
  return { d, width, height, start: { ...first, angle } };
}

export type Polyline = {
  points: Point[];
  /** cumulative arc length at each point */
  lengths: number[];
  total: number;
  /** signed curvature per point (1/units) */
  curvature: number[];
};

/** Evenly-sampled closed polyline of the circuit (for canvas rendering). */
export function circuitPolyline(seed: number, width: number, height: number, padding: number, perSegment = 40): Polyline {
  const segs = segments(controlPoints(seed, width, height, padding));
  const points: Point[] = [];
  for (const [p1, c1, c2, p2] of segs) {
    for (let k = 0; k < perSegment; k++) {
      const t = k / perSegment;
      const mt = 1 - t;
      points.push({
        x: mt * mt * mt * p1.x + 3 * mt * mt * t * c1.x + 3 * mt * t * t * c2.x + t * t * t * p2.x,
        y: mt * mt * mt * p1.y + 3 * mt * mt * t * c1.y + 3 * mt * t * t * c2.y + t * t * t * p2.y,
      });
    }
  }
  const n = points.length;
  const lengths: number[] = [0];
  for (let i = 1; i <= n; i++) {
    const a = points[i - 1]!;
    const b = points[i % n]!;
    lengths.push(lengths[i - 1]! + Math.hypot(b.x - a.x, b.y - a.y));
  }
  const curvature = points.map((_, i) => {
    const a = points[(i - 1 + n) % n]!;
    const b = points[i]!;
    const c = points[(i + 1) % n]!;
    const a1 = Math.atan2(b.y - a.y, b.x - a.x);
    const a2 = Math.atan2(c.y - b.y, c.x - b.x);
    let da = a2 - a1;
    while (da > Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    return da / (Math.hypot(c.x - a.x, c.y - a.y) / 2 || 1);
  });
  return { points, lengths, total: lengths[n]!, curvature };
}

/**
 * A plausible-looking speed trace (km/h): long straights, heavy braking zones and
 * acceleration out of corners. Deterministic per seed.
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
    const k = target < v ? 0.35 : 0.12;
    v += (target - v) * k + (rand() - 0.5) * 3;
    out.push(Math.max(60, Math.min(340, v)));
  }
  return out;
}
