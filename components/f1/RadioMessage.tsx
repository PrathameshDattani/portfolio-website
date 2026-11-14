"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { Radio } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const BARS = 22;

/** Team-radio bubble with a live waveform; the message types itself out. */
export function RadioMessage({
  from,
  message,
  start = true,
  delay = 0,
  speed = 28,
  className,
}: {
  from: string;
  message: string;
  /** Begin typing when true (and in view) */
  start?: boolean;
  delay?: number;
  /** ms per character */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const typing = count < message.length;

  useEffect(() => {
    if (!start || !inView) return;
    if (reduce) {
      setCount(message.length);
      return;
    }
    let i = 0;
    let interval = 0;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= message.length) window.clearInterval(interval);
      }, speed);
    }, delay * 1000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [start, inView, reduce, message, delay, speed]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900/80 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-asphalt-700/80 px-4 py-2.5">
        <Radio size={14} className="text-livery-ink" aria-hidden />
        <span className="label-mono font-bold text-kerb">{from}</span>
        <span className="label-mono text-tyre-grey">Team radio</span>
        <div className="ml-auto flex h-4 items-center gap-[2px]" aria-hidden>
          {Array.from({ length: BARS }, (_, i) => (
            <span
              key={i}
              className="wave-bar w-[2px] rounded-full bg-livery-ink"
              style={{
                height: `${30 + Math.abs(Math.sin(i * 1.7)) * 70}%`,
                animationDelay: `${(i * 73) % 900}ms`,
                animationPlayState: typing && start ? "running" : "paused",
                opacity: typing && start ? 1 : 0.35,
                transition: "opacity .4s",
              }}
            />
          ))}
        </div>
      </div>
      <p className="px-4 py-3.5 text-[15px] leading-relaxed text-kerb sm:text-base">
        <span className="sr-only">{message}</span>
        <span aria-hidden>
          &ldquo;{message.slice(0, count)}
          {!typing && <>&rdquo;</>}
          <span className={cn("ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-livery-ink", !typing && "caret")} />
          {typing && <span className="opacity-0">{message.slice(count)}&rdquo;</span>}
        </span>
      </p>
    </div>
  );
}
