"use client";

import { useEffect, useState } from "react";

/** Ticking local clock for the owner's timezone. Renders after mount (no hydration mismatch). */
export function LocalClock({ timezone }: { timezone: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return <span className="opacity-0">00:00:00</span>;
  let time: string;
  let zone = timezone;
  try {
    time = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
    zone =
      new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "short" }).formatToParts(now).find((p) => p.type === "timeZoneName")?.value ??
      timezone;
  } catch {
    time = now.toLocaleTimeString();
  }
  return (
    <span>
      {time}
      <span className="ml-2 text-muted">{zone}</span>
    </span>
  );
}
