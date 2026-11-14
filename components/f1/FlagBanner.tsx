"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type FlagType = "green" | "yellow" | "red" | "chequered";

type Flag = { id: number; type: FlagType; title: string; message?: string };

const FlagContext = createContext<(flag: Omit<Flag, "id">) => void>(() => {});

/** Show a flag-styled toast: `const showFlag = useFlag(); showFlag({ type: "green", title: "…" })` */
export function useFlag() {
  return useContext(FlagContext);
}

const flagMeta: Record<FlagType, { label: string; color: string }> = {
  green: { label: "Green flag", color: "var(--sector-green)" },
  yellow: { label: "Yellow flag", color: "var(--sector-yellow)" },
  red: { label: "Red flag", color: "var(--flag-red)" },
  chequered: { label: "Chequered flag", color: "var(--kerb-white)" },
};

export function FlagSwatch({ type, className }: { type: FlagType; className?: string }) {
  if (type === "chequered") return <span aria-hidden className={cn("chequered block", className)} />;
  return (
    <span aria-hidden className={cn("block", className)} style={{ background: flagMeta[type].color }} />
  );
}

export function FlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Flag[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setFlags((f) => f.filter((x) => x.id !== id)), []);

  const show = useCallback(
    (flag: Omit<Flag, "id">) => {
      const id = ++nextId.current;
      setFlags((f) => [...f.slice(-2), { ...flag, id }]);
      window.setTimeout(() => dismiss(id), 6000);
    },
    [dismiss],
  );

  const value = useMemo(() => show, [show]);

  return (
    <FlagContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-4 z-[80] flex w-[min(380px,calc(100vw-32px))] flex-col gap-3"
      >
        <AnimatePresence initial={false}>
          {flags.map((flag) => (
            <motion.div
              key={flag.id}
              layout
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
              transition={{ duration: 0.45, ease: EASE }}
              className="pointer-events-auto flex overflow-hidden rounded-md border border-asphalt-700 bg-asphalt-900/95 shadow-2xl shadow-black/60 backdrop-blur"
            >
              <FlagSwatch type={flag.type} className="w-2.5 shrink-0" />
              <div className="flex-1 px-4 py-3">
                <p className="label-mono text-tyre-grey">{flagMeta[flag.type].label}</p>
                <p className="mt-1.5 font-display text-base font-bold tracking-wide uppercase">
                  {flag.title}
                </p>
                {flag.message && <p className="mt-0.5 text-sm text-tyre-grey">{flag.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(flag.id)}
                className="self-start p-3 text-tyre-grey transition-colors hover:text-kerb"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FlagContext.Provider>
  );
}
