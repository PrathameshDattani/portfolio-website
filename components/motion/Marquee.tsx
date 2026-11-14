import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite horizontal marquee. Content is duplicated once; the copy is hidden from assistive tech. */
export function Marquee({
  children,
  duration = 40,
  className,
  reverse,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={cn("relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]", className)}>
      <div
        className="marquee-track flex shrink-0"
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : undefined } as CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
