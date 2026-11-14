import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: string;
  variant?: "solid" | "outline";
  icon?: ReactNode;
  download?: boolean;
  external?: boolean;
  className?: string;
};

/** Pill button with a text-roll hover and magnetic pull. */
export function Button({ href, children, variant = "solid", icon, download, external, className }: Props) {
  const cls = cn(
    "group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full pr-2 pl-7 text-[15px] font-medium transition-colors duration-500 ease-out",
    variant === "solid"
      ? "bg-fg text-ink-950"
      : "border border-line-strong text-fg hover:border-fg/40",
    className,
  );
  const inner = (
    <>
      {/* fill that wipes up on hover */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-out group-hover:translate-y-0",
          variant === "solid" ? "bg-livery" : "bg-fg",
        )}
      />
      <span className={cn("roll relative", variant === "solid" ? "group-hover:text-white" : "group-hover:text-ink-950")}>
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      <span
        aria-hidden
        className={cn(
          "relative flex size-10 items-center justify-center rounded-full transition-transform duration-500 ease-out group-hover:rotate-45",
          variant === "solid" ? "bg-ink-950 text-fg" : "bg-fg text-ink-950 group-hover:bg-ink-950 group-hover:text-fg",
        )}
      >
        {icon ?? <ArrowUpRight size={17} />}
      </span>
    </>
  );

  const isExternal = external || href.startsWith("http") || href.startsWith("mailto:");
  return (
    <Magnetic strength={0.25}>
      {isExternal || download ? (
        <a
          href={href}
          className={cls}
          download={download || undefined}
          {...(isExternal && !href.startsWith("mailto:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {inner}
        </Link>
      )}
    </Magnetic>
  );
}

/** Small inline link with an arrow and a drawn underline. */
export function ArrowLink({ href, children, className }: { href: string; children: string; className?: string }) {
  const ext = href.startsWith("http");
  const Comp = ext ? "a" : Link;
  return (
    <Comp
      href={href}
      {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn("group inline-flex items-center gap-2 text-sm text-fg", className)}
    >
      <span className="u-draw pb-0.5">{children}</span>
      <ArrowUpRight size={15} className="transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
    </Comp>
  );
}
