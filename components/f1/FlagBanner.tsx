"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { EASE } from "@/lib/motion";

export type FlagType = "green" | "yellow" | "red" | "chequered";
type Flag = { id: number; type: FlagType; title: string; message?: string };

const FlagContext = createContext<(flag: Omit<Flag, "id">) => void>(() => {});

/** `const showFlag = useFlag(); showFlag({ type: "green", title: "…" })` */
export function useFlag() {
  return useContext(FlagContext);
}

const meta: Record<FlagType, { label: string; bg: string }> = {
  green: { label: "Green flag", bg: "var(--green)" },
  yellow: { label: "Yellow flag", bg: "var(--yellow)" },
  red: { label: "Red flag", bg: "var(--red)" },
  chequered: { label: "Chequered flag", bg: "repeating-conic-gradient(#ededed 0 25%, #060607 0 50%) 0 0 / 6px 6px" },
};

export function FlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Flag[]>([]);
  const next = useRef(0);
  const dismiss = useCallback((id: number) => setFlags((f) => f.filter((x) => x.id !== id)), []);
  const show = useCallback(
    (flag: Omit<Flag, "id">) => {
      const id = ++next.current;
      setFlags((f) => [...f.slice(-2), { ...flag, id }]);
      window.setTimeout(() => dismiss(id), 6000);
    },
    [dismiss],
  );

  return (
    <FlagContext.Provider value={show}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[110] flex w-[min(400px,calc(100vw-32px))] flex-col gap-3">
        <AnimatePresence initial={false}>
          {flags.map((f) => (
            <motion.div
              key={f.id}
              layout
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 12, filter: "blur(6px)", transition: { duration: 0.3 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="pointer-events-auto flex items-start gap-4 rounded-[6px] border border-line bg-ink-850/90 p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)] backdrop-blur-xl"
            >
              <span aria-hidden className="mt-1 h-3 w-4 shrink-0 rounded-[1px]" style={{ background: meta[f.type].bg }} />
              <div className="flex-1">
                <p className="eyebrow">{meta[f.type].label}</p>
                <p className="mt-1.5 text-[15px] font-medium">{f.title}</p>
                {f.message && <p className="mt-0.5 text-sm text-muted">{f.message}</p>}
              </div>
              <button type="button" onClick={() => dismiss(f.id)} className="text-muted transition-colors hover:text-fg" aria-label="Dismiss notification">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FlagContext.Provider>
  );
}
