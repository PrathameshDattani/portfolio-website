"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { navItems } from "@/lib/nav";
import { EASE } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";
import { useLenis } from "./SmoothScroll";

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 300 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a");
    window.setTimeout(() => first?.focus(), 400);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("a,button");
        const a = items[0];
        const b = items[items.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b?.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const btn = menuBtn.current;
    return () => {
      html.style.overflow = "";
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open, lenis]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-[background-color,backdrop-filter,border-color] duration-700 ease-out",
            scrolled ? "border-b border-line bg-ink-950/60 backdrop-blur-xl" : "border-b border-transparent",
          )}
        >
          <nav aria-label="Main" className="wrap flex h-[var(--nav-h)] items-center justify-between">
            <Link href="/" className="group flex items-baseline gap-2.5" aria-label={`${profile.fullName}, home`}>
              <span className="display text-[22px] font-[750]">{profile.shortName}</span>
              <span className="font-mono text-[11px] text-livery-ink tabular">{pad(profile.driverNumber)}</span>
            </Link>

            <ul className="hidden items-center gap-8 lg:flex">
              {navItems.map((item, i) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-label={`${item.label} (${item.plain})`}
                      aria-current={active ? "page" : undefined}
                      className="group relative flex items-baseline gap-1.5 py-2"
                    >
                      <span className="font-mono text-[10px] text-muted tabular">{pad(i + 1)}</span>
                      <span className={cn("roll text-[14px] font-medium", active ? "text-fg" : "text-fg/75")}>
                        <span>{item.label}</span>
                        <span aria-hidden className="text-fg">
                          {item.plain}
                        </span>
                      </span>
                      {active && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute -bottom-0.5 left-1/2 size-1 rounded-full bg-livery"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <button
              ref={menuBtn}
              type="button"
              className="group flex h-10 items-center gap-3 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="eyebrow !text-fg">{open ? "Close" : "Menu"}</span>
              <span className="relative block h-3 w-6">
                <span className={cn("absolute left-0 h-px w-full bg-fg transition-all duration-500 ease-out", open ? "top-1.5 rotate-45" : "top-0")} />
                <span className={cn("absolute left-0 h-px w-full bg-fg transition-all duration-500 ease-out", open ? "top-1.5 -rotate-45" : "top-3")} />
              </span>
            </button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink-900 pt-[var(--nav-h)] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 } }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="wrap mt-6 flex flex-1 flex-col justify-center gap-1">
              {[{ href: "/", label: "Grid", plain: "Home" }, ...navItems].map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-line">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%", transition: { duration: 0.4 } }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) || (item.href === "/" && pathname === "/") ? "page" : undefined}
                      className="flex items-baseline justify-between py-3"
                    >
                      <span className="display text-[clamp(36px,10vw,64px)] font-[650]">{item.label}</span>
                      <span className="eyebrow">{item.plain}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              className="wrap flex justify-between pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.7 } }}
              exit={{ opacity: 0 }}
            >
              <a href={profile.resumeUrl} download className="eyebrow !text-fg">
                Spec sheet ↓
              </a>
              <span className="eyebrow">{profile.location}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
