import type { Stat } from "@/content/types";
import { CountUp } from "@/components/f1/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { pad } from "@/lib/utils";

const SECTOR = ["var(--sector-purple)", "var(--sector-green)", "var(--sector-yellow)", "var(--livery)"];

/** Timing-screen style stats row. */
export function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <section aria-label="Quick stats" className="relative border-y border-asphalt-800 bg-asphalt-900/50">
      <div className="container-race">
        <dl className="grid grid-cols-2 gap-px bg-asphalt-800 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="relative flex flex-col gap-3 bg-asphalt-950 px-4 py-8 sm:px-6 lg:py-10"
            >
              <span aria-hidden className="absolute top-0 left-0 h-[2px] w-12" style={{ background: SECTOR[i % 4] }} />
              <dt className="order-2 flex flex-col gap-1">
                <span className="text-sm text-kerb/90">{s.label}</span>
                {s.f1Label && <span className="label-mono text-[10px] text-tyre-grey">{s.f1Label}</span>}
              </dt>
              <dd className="order-1 flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-tyre-grey tabular">P{pad(i + 1)}</span>
                <CountUp
                  value={s.value}
                  suffix={s.suffix}
                  className="font-mono text-5xl font-bold tracking-tight tabular lg:text-6xl"
                />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
