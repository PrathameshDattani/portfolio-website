import type { Stat } from "@/content/types";
import { CountUp } from "@/components/f1/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/** Four big figures separated by hairlines. */
export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal
          key={s.label}
          delay={i * 0.08}
          className="@container flex min-w-0 flex-col gap-10 border-b border-line py-8 pr-6 odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 lg:[&:not(:first-child)]:pl-8"
        >
          <dt className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-fg/80">{s.label}</span>
            {s.f1Label && <span className="eyebrow hidden sm:inline">{s.f1Label}</span>}
          </dt>
          {/* sized to the cell so "30K+" never spills into the next column */}
          <dd className="display text-[clamp(32px,23cqi,112px)] font-[500] whitespace-nowrap">
            <CountUp value={s.value} suffix={s.suffix} />
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}
