import type { ProjectStatus } from "@/content/types";
import { cn } from "@/lib/utils";

const meta: Record<ProjectStatus, { label: string; swatch: string }> = {
  finished: { label: "Finished", swatch: "bg-green" },
  "in-progress": { label: "In progress", swatch: "bg-yellow" },
  shipped: { label: "Shipped", swatch: "chequered" },
};

/** Status shown as a flag swatch + text label (never colour alone). */
export function StatusFlag({ status, className }: { status: ProjectStatus; className?: string }) {
  const m = meta[status];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className={cn("h-3 w-4 rounded-[1px] [background-size:6px_6px]", m.swatch)} />
      <span className="label-mono text-kerb/90">{m.label}</span>
    </span>
  );
}
