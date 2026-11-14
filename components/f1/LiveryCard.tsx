import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Card with a diagonal livery stripe edge, carbon texture, and a hover lift + glow + sheen.
 * Pure CSS so it stays a server component. Hosts CircuitMap hover animations.
 */
export function LiveryCard({
  children,
  className,
  color,
  interactive = true,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Accent colour for this card (defaults to the livery) */
  color?: string;
  interactive?: boolean;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      data-circuit-host
      data-interactive={interactive}
      className={cn("livery-card", className)}
      style={color ? ({ "--card-accent": color } as CSSProperties) : undefined}
    >
      <div aria-hidden className="carbon pointer-events-none absolute inset-0 -z-10 opacity-60" />
      {children}
    </Tag>
  );
}
