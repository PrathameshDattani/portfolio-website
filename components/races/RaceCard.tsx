import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/content/types";
import { CircuitMap } from "@/components/f1/CircuitMap";
import { LiveryCard } from "@/components/f1/LiveryCard";
import { Chip } from "@/components/ui/Chip";
import { formatMonth, roundLabel } from "@/lib/utils";
import { StatusFlag } from "./StatusFlag";

export function RaceCard({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const stack = [
    ...(project.stack.engine ?? []),
    ...(project.stack.aero ?? []),
    ...(project.stack.electronics ?? []),
  ];
  return (
    <LiveryCard as="article" className="group flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="font-mono text-sm font-bold text-livery-ink tabular">{roundLabel(project.round)}</span>
        <StatusFlag status={project.status} />
      </div>

      <div className="relative mx-5 mt-4 rounded-[4px] border border-asphalt-700/70 bg-asphalt-950/60 px-6 py-5">
        <div aria-hidden className="grid-lines absolute inset-0 opacity-50 [background-size:20px_20px]" />
        <CircuitMap seed={project.circuitSeed ?? project.round} mode="hover" strokeWidth={2.4} className="relative" />
      </div>

      <div className="flex flex-1 flex-col px-5 pt-5 pb-5">
        <H className="font-display text-xl leading-tight font-bold tracking-[0.04em] uppercase">
          <Link href={`/races/${project.slug}`} className="stretched-link focus-visible:outline-none">
            {project.name}
            <span className="mt-1 block text-[13px] tracking-[0.18em] text-tyre-grey transition-colors duration-300 group-hover:text-livery-ink">
              Grand Prix
            </span>
          </Link>
        </H>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-tyre-grey">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {stack.slice(0, 4).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
          {stack.length > 4 && <Chip className="text-tyre-grey">+{stack.length - 4}</Chip>}
        </div>
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-asphalt-700/70 pt-4">
            <span className="label-mono text-tyre-grey">
              {formatMonth(project.start)} → {project.end ? formatMonth(project.end) : "Now"}
            </span>
            <span className="flex size-8 items-center justify-center rounded-full border border-asphalt-700 transition-all duration-500 ease-race group-hover:rotate-45 group-hover:border-livery group-hover:bg-livery">
              <ArrowUpRight size={15} aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </LiveryCard>
  );
}
