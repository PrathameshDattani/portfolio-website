import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-01" → "Jan 2025", "2025" → "2025" */
export function formatMonth(value?: string): string {
  if (!value) return "Present";
  const [y, m] = value.split("-");
  if (!m) return y ?? value;
  const month = MONTHS[Number(m) - 1];
  return month ? `${month} ${y}` : value;
}

export function formatRange(start: string, end?: string): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}

/** Whole months between two "YYYY-MM" strings (end defaults to now). */
export function monthsBetween(start: string, end?: string): number {
  const [sy, sm] = start.split("-").map(Number);
  const now = new Date();
  const [ey, em] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
  return Math.max(1, ((ey ?? 0) - (sy ?? 0)) * 12 + ((em ?? 1) - (sm ?? 1)) + 1);
}

export function pad(n: number, size = 2): string {
  return String(n).padStart(size, "0");
}

export function roundLabel(round: number): string {
  return `R${pad(round)}`;
}

export function yearOf(value: string): string {
  return value.split("-")[0] ?? value;
}

/** Deterministic PRNG so server and client render the same "random" values. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
