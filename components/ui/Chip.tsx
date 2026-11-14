import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Sponsor-decal style tag used for tech stacks and metadata. */
export function Chip({
  children,
  className,
  color,
}: {
  children: ReactNode;
  className?: string;
  /** Optional accent colour shown as a leading tick */
  color?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[3px] border border-asphalt-700 bg-asphalt-950/60 px-2 py-1 font-mono text-[11px] leading-none tracking-[0.06em] text-kerb/85 uppercase",
        className,
      )}
    >
      {color && <span aria-hidden className="h-2.5 w-[3px] -skew-x-12" style={{ background: color }} />}
      {children}
    </span>
  );
}
