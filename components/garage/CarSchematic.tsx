"use client";

import type { KeyboardEvent } from "react";
import type { SkillZone } from "@/content/types";
import { zoneMeta } from "@/content/skills";
import { cn } from "@/lib/utils";

type ZoneShape = { zone: SkillZone; paths: string[]; label: { x: number; y: number } };

/** Original top-down car (nose up). Each zone is a focusable, labelled button. Draw order = stacking order. */
const ZONES: ZoneShape[] = [
  {
    zone: "aero",
    paths: [
      // front wing
      "M40 62 L280 62 L284 88 L250 96 L170 92 L150 92 L70 96 L36 88Z",
      // rear wing
      "M78 612 L242 612 L246 650 L74 650Z",
    ],
    label: { x: 160, y: 40 },
  },
  {
    zone: "pit-crew",
    paths: [
      "M18 128 h46 a6 6 0 0 1 6 6 v76 a6 6 0 0 1 -6 6 h-46 a6 6 0 0 1 -6 -6 v-76 a6 6 0 0 1 6 -6Z",
      "M256 128 h46 a6 6 0 0 1 6 6 v76 a6 6 0 0 1 -6 6 h-46 a6 6 0 0 1 -6 -6 v-76 a6 6 0 0 1 6 -6Z",
      "M10 478 h56 a6 6 0 0 1 6 6 v92 a6 6 0 0 1 -6 6 h-56 a6 6 0 0 1 -6 -6 v-92 a6 6 0 0 1 6 -6Z",
      "M254 478 h56 a6 6 0 0 1 6 6 v92 a6 6 0 0 1 -6 6 h-56 a6 6 0 0 1 -6 -6 v-92 a6 6 0 0 1 6 -6Z",
    ],
    label: { x: 40, y: 600 },
  },
  {
    zone: "chassis",
    paths: [
      "M142 210 L178 210 L186 248 C230 262 248 290 250 330 L252 452 L216 470 L104 470 L68 452 L70 330 C72 290 90 262 134 248Z",
    ],
    label: { x: 286, y: 360 },
  },
  {
    zone: "telemetry",
    paths: ["M150 96 L170 96 L178 210 L142 210Z"],
    label: { x: 236, y: 160 },
  },
  {
    zone: "electronics",
    paths: ["M134 268 C134 246 186 246 186 268 L190 350 C190 366 130 366 130 350Z"],
    label: { x: 160, y: 236 },
  },
  {
    zone: "power-unit",
    paths: ["M118 370 L202 370 L210 470 L196 560 L124 560 L110 470Z"],
    label: { x: 160, y: 520 },
  },
];

export function CarSchematic({
  active,
  onSelect,
}: {
  active: SkillZone;
  onSelect: (z: SkillZone) => void;
}) {
  const onKey = (e: KeyboardEvent, z: SkillZone) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(z);
    }
  };

  return (
    <svg viewBox="0 0 320 680" className="mx-auto h-auto w-full max-w-[340px]" role="group" aria-label="Car schematic: choose a component">
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--asphalt-600)" strokeWidth="1" />
        </pattern>
      </defs>
      {/* suspension + floor (decorative) */}
      <g aria-hidden stroke="var(--asphalt-600)" strokeWidth="2.5" fill="none">
        <path d="M70 150 L146 190 M70 196 L144 206 M250 150 L174 190 M250 196 L176 206" />
        <path d="M72 500 L112 470 M72 556 L118 540 M248 500 L208 470 M248 556 L202 540" />
        <path d="M60 600 L260 600 L250 612 L70 612Z" fill="url(#hatch)" />
      </g>

      {ZONES.map(({ zone, paths }) => {
        const on = active === zone;
        const meta = zoneMeta[zone];
        return (
          <g
            key={zone}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${meta.title}: ${meta.plain}`}
            onClick={() => onSelect(zone)}
            onKeyDown={(e) => onKey(e, zone)}
            className="group cursor-pointer outline-none"
          >
            <title>{`${meta.title} · ${meta.plain}`}</title>
            {paths.map((d, i) => (
              <path
                key={i}
                d={d}
                className={cn(
                  "transition-[fill,stroke,fill-opacity] duration-300 ease-race",
                  on
                    ? "fill-livery stroke-kerb [fill-opacity:0.85]"
                    : zone === "pit-crew"
                      ? "fill-[#050506] stroke-asphalt-600 group-hover:stroke-kerb/70 group-focus-visible:stroke-livery-ink"
                      : "fill-asphalt-800 stroke-asphalt-600 group-hover:fill-asphalt-700 group-hover:stroke-kerb/70 group-focus-visible:stroke-livery-ink",
                )}
                strokeWidth={on ? 2 : 1.5}
                strokeLinejoin="round"
              />
            ))}
          </g>
        );
      })}

      {/* cockpit opening + halo (decorative, sits above zones) */}
      <g aria-hidden pointerEvents="none">
        <ellipse cx="160" cy="300" rx="16" ry="26" fill="var(--asphalt-950)" opacity=".85" />
        <path d="M144 282 C144 262 176 262 176 282" stroke="var(--kerb-white)" strokeOpacity=".5" strokeWidth="3" fill="none" />
        <circle cx="160" cy="388" r="9" fill="var(--asphalt-950)" opacity=".8" />
      </g>
    </svg>
  );
}
