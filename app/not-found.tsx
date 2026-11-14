import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "DNF · Page not found" };

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-[var(--nav-h)]">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      <div className="container-race grid items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-4">
            {/* red flag */}
            <svg width="56" height="64" viewBox="0 0 56 64" aria-hidden>
              <rect x="4" y="2" width="3" height="62" rx="1" fill="var(--tyre-grey)" />
              <g className="flag-wave">
                <path d="M7 4h44v28H7Z" fill="var(--flag-red)" />
              </g>
            </svg>
            <span className="label-mono text-flag-red">Red flag · Error 404</span>
          </div>
          <h1 className="mt-8 text-6xl font-black italic sm:text-7xl lg:text-8xl">
            <span className="text-livery">DNF</span>
          </h1>
          <p className="mt-6 font-display text-2xl font-bold tracking-wide uppercase sm:text-3xl">
            This page retired from the race.
          </p>
          <p className="mt-4 max-w-md text-tyre-grey">
            It went off at the first corner and is beached in the gravel. The marshals are on it, but you&apos;ll
            be quicker heading back to the pits.
          </p>
          <div className="mt-10 pl-1.5">
            <Button href="/">Return to pit lane</Button>
          </div>
        </div>

        {/* car in the gravel trap */}
        <div aria-hidden className="relative [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_55%,transparent)]">
          <svg viewBox="0 0 480 300" className="h-auto w-full">
            <defs>
              <pattern id="gravel" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="4" r="1.6" fill="#3a3a42" />
                <circle cx="10" cy="9" r="1.2" fill="#2a2a30" />
                <circle cx="7" cy="13" r="1" fill="#3a3a42" />
              </pattern>
            </defs>
            <path d="M0 40 C160 20 320 60 480 30 L480 120 C320 150 160 110 0 140Z" fill="var(--asphalt-800)" />
            <path d="M0 132 C160 102 320 142 480 112" stroke="var(--kerb-white)" strokeWidth="6" strokeDasharray="20 20" opacity=".6" />
            <path d="M0 140 C160 110 320 150 480 120 L480 300 L0 300Z" fill="url(#gravel)" />
            <path d="M0 140 C160 110 320 150 480 120 L480 300 L0 300Z" fill="#b08d57" opacity=".08" />
            {/* skid marks */}
            <path d="M120 96 C170 120 200 160 226 200" stroke="#000" strokeWidth="6" opacity=".5" fill="none" />
            <path d="M136 90 C186 114 220 152 246 192" stroke="#000" strokeWidth="6" opacity=".5" fill="none" />
            {/* the car, top-down and rotated */}
            <g transform="translate(250 214) rotate(-28)">
              <rect x="-62" y="-28" width="14" height="56" rx="2" fill="var(--kerb-white)" />
              <rect x="-50" y="-30" width="18" height="12" rx="3" fill="#000" />
              <rect x="-50" y="18" width="18" height="12" rx="3" fill="#000" />
              <path d="M-48 -6 L30 -16 L52 -10 L52 10 L30 16 L-48 6Z" fill="var(--livery)" />
              <ellipse cx="6" cy="0" rx="12" ry="6" fill="#0a0a0b" />
              <rect x="28" y="-34" width="22" height="14" rx="3" fill="#000" />
              <rect x="28" y="20" width="22" height="14" rx="3" fill="#000" />
              <rect x="52" y="-22" width="10" height="44" rx="2" fill="var(--kerb-white)" />
            </g>
            {/* dust */}
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                className="dust"
                cx={230 + i * 18}
                cy={236}
                r={6 + (i % 3) * 3}
                fill="#b08d57"
                opacity=".4"
                style={{ animationDelay: `${i * 0.35}s`, ["--dx" as string]: `${(i - 2) * 10}px` }}
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
