import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  /** Show the "DRS" flap on hover (primary CTAs) */
  drs?: boolean;
  external?: boolean;
  download?: boolean;
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "children">;

const base =
  "btn-drs group relative inline-flex h-12 items-center rounded-[4px] px-6 font-display text-[15px] font-bold tracking-[0.08em] uppercase select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-livery text-white shadow-[0_10px_40px_-12px_var(--livery-glow)] hover:shadow-[0_14px_50px_-10px_var(--livery-glow)]",
  ghost:
    "border border-asphalt-600 bg-asphalt-900/60 text-kerb backdrop-blur hover:border-kerb/60 hover:bg-asphalt-800",
};

/** Skewed motorsport button. Inner content is counter-skewed so text stays upright. */
export function Button({
  href,
  children,
  variant = "primary",
  icon,
  drs = variant === "primary",
  external,
  download,
  className,
  ...rest
}: Props) {
  const inner = (
    <>
      <span className="unskew-speed flex items-center gap-2.5">
        {children}
        {icon ?? <ArrowRight aria-hidden size={17} strokeWidth={2.5} className="btn-arrow" />}
      </span>
      {drs && (
        <span
          aria-hidden
          className="drs-flap absolute -top-2.5 right-3 rounded-[2px] bg-drs px-1.5 py-[3px] font-mono text-[9px] leading-none font-bold tracking-[0.15em] text-asphalt-950"
        >
          DRS
        </span>
      )}
    </>
  );

  const cls = cn(base, variants[variant], className);

  if (external || download || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={cls}
        download={download || undefined}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}
