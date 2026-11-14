"use client";

import { useFlag, type FlagType } from "@/components/f1/FlagBanner";

export function FlagDemo() {
  const showFlag = useFlag();
  return (
    <div className="flex flex-wrap gap-2">
      {(["green", "yellow", "red", "chequered"] as FlagType[]).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => showFlag({ type: t, title: `${t} flag`, message: "Sample flag banner." })}
          className="eyebrow rounded-full border border-line-strong px-4 py-2 hover:border-fg/50"
        >
          {t}
        </button>
      ))}
    </div>
  );
}
