import { tyreMeta } from "@/content/skills";
import type { Tyre } from "@/content/types";
import { cn } from "@/lib/utils";

export const tyreColor: Record<Tyre, string> = {
  soft: "var(--tyre-soft)",
  medium: "var(--tyre-medium)",
  hard: "var(--tyre-hard)",
  inter: "var(--tyre-inter)",
  wet: "var(--tyre-wet)",
};

/** Tyre compound chip. Always carries a text label, never colour alone. */
export function TyreBadge({
  tyre,
  size = 26,
  showLabel = true,
  showMeaning = false,
  className,
}: {
  tyre: Tyre;
  size?: number;
  showLabel?: boolean;
  showMeaning?: boolean;
  className?: string;
}) {
  const meta = tyreMeta[tyre];
  const color = tyreColor[tyre];
  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      title={`${meta.label} tyre: ${meta.meaning}`}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="shrink-0">
        <circle cx="16" cy="16" r="15" fill="#050506" />
        <circle cx="16" cy="16" r="11.5" fill="none" stroke={color} strokeWidth="2.6" />
        <circle cx="16" cy="16" r="15" fill="none" stroke="#2a2a30" strokeWidth="1" />
        <text
          x="16"
          y="16.5"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-display)"
          fontWeight="900"
          fontSize="12"
          fill="#f4f4f5"
        >
          {meta.letter}
        </text>
      </svg>
      {showLabel && (
        <span className="flex flex-col leading-tight">
          <span className="label-mono text-kerb">{meta.label}</span>
          {showMeaning && <span className="mt-1 text-xs text-tyre-grey">{meta.meaning}</span>}
        </span>
      )}
      {!showLabel && <span className="sr-only">{`${meta.label} tyre: ${meta.meaning}`}</span>}
    </span>
  );
}
