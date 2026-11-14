/** Formation lap: a car dot circulates a small loop while the next page loads. */
export default function Loading() {
  const d = "M20 50 C20 20 50 14 80 22 C108 30 116 18 136 26 C156 34 150 62 128 70 C100 80 92 66 64 74 C38 82 20 76 20 50Z";
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-6" role="status" aria-live="polite">
      <svg viewBox="0 0 160 96" width="200" height="120" aria-hidden>
        <path d={d} fill="none" stroke="var(--asphalt-700)" strokeWidth="7" />
        <path d={d} fill="none" stroke="var(--kerb-white)" strokeOpacity=".7" strokeWidth="2" />
        <circle r="4.5" fill="var(--livery)" stroke="var(--kerb-white)" strokeWidth="1.2">
          <animateMotion dur="1.6s" repeatCount="indefinite" path={d} rotate="auto" />
        </circle>
      </svg>
      <p className="label-mono text-tyre-grey">Formation lap…</p>
    </div>
  );
}
