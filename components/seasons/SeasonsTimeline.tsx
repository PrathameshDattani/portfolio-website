"use client";

import { useEffect, useRef } from "react";
import type { Experience } from "@/content/types";
import { LiveryCard } from "@/components/f1/LiveryCard";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { formatRange, yearOf } from "@/lib/utils";

function TopDownCar() {
  return (
    <svg viewBox="0 0 24 48" width="22" height="44" aria-hidden>
      <rect x="2" y="3" width="20" height="5" rx="1.5" fill="var(--kerb-white)" />
      <rect x="0" y="9" width="5" height="9" rx="1.5" fill="#000" />
      <rect x="19" y="9" width="5" height="9" rx="1.5" fill="#000" />
      <path d="M9 4h6l2 14 3 6v12l-3 6H7l-3-6V24l3-6Z" fill="var(--livery)" />
      <ellipse cx="12" cy="24" rx="3" ry="4.5" fill="#0a0a0b" />
      <rect x="0" y="30" width="6" height="11" rx="1.5" fill="#000" />
      <rect x="18" y="30" width="6" height="11" rx="1.5" fill="#000" />
      <rect x="3" y="43" width="18" height="4" rx="1" fill="var(--kerb-white)" />
    </svg>
  );
}

export function SeasonsTimeline({ seasons }: { seasons: Experience[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const progress = progressRef.current;
    const car = carRef.current;
    if (!list || !progress || !car) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.style.transform = "scaleY(1)";
      car.style.display = "none";
      return;
    }
    let killed = false;
    let cleanup = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = {
        trigger: list,
        start: "top 55%",
        end: "bottom 55%",
        scrub: 0.7,
        invalidateOnRefresh: true,
      };
      const a = gsap.fromTo(progress, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st });
      const b = gsap.fromTo(
        car,
        { y: 0 },
        { y: () => list.offsetHeight - car.offsetHeight, ease: "none", scrollTrigger: { ...st } },
      );
      cleanup = () => {
        a.scrollTrigger?.kill();
        b.scrollTrigger?.kill();
        a.kill();
        b.kill();
      };
    })();
    return () => {
      killed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="relative">
      {/* track column */}
      <div aria-hidden className="absolute top-0 bottom-0 left-[11px] w-[2px] md:left-[199px]">
        <div className="absolute inset-0 bg-asphalt-700" />
        <div className="absolute inset-0 [background:repeating-linear-gradient(to_bottom,var(--kerb-white)_0_10px,transparent_10px_20px)] opacity-10" />
        <div ref={progressRef} className="absolute inset-0 origin-top bg-livery" style={{ transform: "scaleY(0)" }} />
        <div ref={carRef} className="absolute -left-[10px] top-0 z-10 drop-shadow-[0_0_14px_var(--livery-glow)]">
          <TopDownCar />
        </div>
      </div>

      <ol ref={listRef} className="relative grid gap-14 md:gap-20">
        {seasons.map((s, i) => (
          <li key={s.company + s.start} className="grid gap-4 pl-10 md:grid-cols-[160px_80px_1fr] md:gap-0 md:pl-0">
            <Reveal className="md:pt-6 md:text-right">
              <p className="label-mono text-tyre-grey">Season</p>
              <p className="mt-2 font-display text-4xl font-black italic md:text-5xl">{yearOf(s.start)}</p>
            </Reveal>
            <div aria-hidden className="relative hidden md:block">
              <span
                className="absolute top-9 left-[33px] size-3.5 rotate-45 border-2 border-asphalt-950 outline-2"
                style={{ background: s.color, outlineColor: s.color, outlineStyle: "solid" }}
              />
            </div>
            <Reveal delay={0.08}>
              <LiveryCard color={s.color} interactive={false} className="p-6 sm:p-8">
                <div aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: s.color }} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="label-mono text-tyre-grey">
                    {formatRange(s.start, s.end)}
                    {s.location ? ` · ${s.location}` : ""}
                  </span>
                  <Chip color={s.color}>Seat: {s.seat}</Chip>
                </div>
                <h2 className="mt-5 text-3xl font-black italic sm:text-4xl">{s.company}</h2>
                <p className="mt-2 font-display text-lg tracking-wide text-tyre-grey uppercase">{s.role}</p>

                <h3 className="label-mono mt-8 text-kerb">Race results</h3>
                <ol className="mt-4 grid gap-3">
                  {s.results.map((r, ri) => (
                    <li key={r} className="flex gap-4 border-t border-asphalt-700/70 pt-3 text-[15px] leading-relaxed text-kerb/90">
                      <span className="w-7 shrink-0 font-mono text-xs leading-6 font-bold tabular" style={{ color: s.color }}>
                        R{ri + 1}
                      </span>
                      {r}
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {s.stack.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </LiveryCard>
            </Reveal>
            <span className="sr-only">{`Season ${i + 1} of ${seasons.length}`}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
