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
          className="label-mono rounded-[3px] border border-asphalt-700 px-3 py-2 hover:border-kerb/50"
        >
          {t}
        </button>
      ))}
    </div>
  );
}
