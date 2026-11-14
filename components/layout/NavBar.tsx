"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { navItems } from "@/lib/nav";
import { EASE } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";
import { useLenis } from "./SmoothScroll";

function DriverBadge() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${profile.fullName}, home`}>
      <span className="skew-speed flex h-9 items-stretch overflow-hidden rounded-[3px] border border-asphalt-700">
        <span className="flex items-center bg-livery px-2.5 transition-[padding] duration-300 ease-race group-hover:px-3.5">
          <span className="unskew-speed font-mono text-sm font-bold text-white tabular">
            {pad(profile.driverNumber)}
          </span>
        </span>
        <span className="flex items-center bg-asphalt-900 px-2.5">
          <span className="unskew-speed font-display text-[15px] font-black tracking-[0.12em]">
            {profile.shortName}
          </span>
        </span>
      </span>
      <span className="label-mono hidden text-tyre-grey xl:block">{profile.teamName}</span>
    </Link>
  );
}

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
    setScrolled(y > 12);
    setHidden(y > 240 && y > prev && !open);
  });

  // close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  // menu: lock scroll, focus management, Esc to close
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
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
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-race",
            scrolled
              ? "border-asphalt-700/80 bg-asphalt-950/75 backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent bg-transparent",
          )}
        >
          <nav aria-label="Main" className="container-race flex h-[var(--nav-h)] items-center justify-between gap-6">
            <DriverBadge />

            <ul className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-label={`${item.label} (${item.plain})`}
                      aria-current={active ? "page" : undefined}
                      className="group relative flex flex-col items-center px-3.5 py-2"
                    >
                      <span
                        className={cn(
                          "font-display text-[14px] font-bold tracking-[0.1em] uppercase transition-colors duration-300",
                          active ? "text-kerb" : "text-kerb/70 group-hover:text-kerb",
                        )}
                      >
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "label-mono mt-1 text-[9.5px] transition-colors duration-300",
                          active ? "text-livery-ink" : "text-tyre-grey/80 group-hover:text-tyre-grey",
                        )}
                      >
                        {item.plain}
                      </span>
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-[1px] h-[2px] -skew-x-12 bg-livery"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <a
                href={profile.resumeUrl}
                download
                className="group hidden h-9 items-center gap-2 rounded-[3px] border border-asphalt-700 px-3.5 text-tyre-grey transition-colors duration-300 hover:border-kerb/40 hover:text-kerb sm:flex"
              >
                <Download size={14} aria-hidden />
                <span className="label-mono">Spec sheet</span>
              </a>
              <button
                ref={menuBtn}
                type="button"
                className="flex size-10 items-center justify-center rounded-[3px] border border-asphalt-700 bg-asphalt-900/60 lg:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile pit-lane panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[70] flex flex-col bg-asphalt-950 lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div aria-hidden className="livery-stripes absolute inset-y-0 left-0 w-1.5 opacity-80" />
            <div className="container-race flex h-[var(--nav-h)] items-center justify-between">
              <span className="label-mono text-tyre-grey">Pit lane · Menu</span>
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-[3px] border border-asphalt-700"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <motion.ul
              className="container-race mt-4 flex flex-1 flex-col"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
            >
              <motion.li
                variants={{ hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } } }}
                className="border-b border-asphalt-800"
              >
                <Link href="/" className="flex items-baseline justify-between py-4">
                  <span className="font-display text-3xl font-black italic tracking-wide uppercase">Grid</span>
                  <span className="label-mono text-tyre-grey">Home</span>
                </Link>
              </motion.li>
              {navItems.map((item, i) => (
                <motion.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } } }}
                  className="border-b border-asphalt-800"
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex items-baseline justify-between py-4"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-tyre-grey tabular">{pad(i + 1)}</span>
                      <span
                        className={cn(
                          "font-display text-3xl font-black italic tracking-wide uppercase",
                          isActive(item.href) && "text-livery",
                        )}
                      >
                        {item.label}
                      </span>
                    </span>
                    <span className="label-mono text-tyre-grey">{item.plain}</span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <div className="container-race pb-8">
              <a
                href={profile.resumeUrl}
                download
                className="flex h-12 items-center justify-center gap-2 rounded-[3px] bg-livery font-display font-bold tracking-widest uppercase"
              >
                <Download size={16} aria-hidden /> Download spec sheet
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
