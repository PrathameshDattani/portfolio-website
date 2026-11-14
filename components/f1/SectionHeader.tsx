import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Props = {
  /** Skewed label, e.g. "Sector 1" */
  sector: string;
  /** Plain meaning shown next to the label, e.g. "Projects" */
  plain?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
};

export function SectorLabel({ sector, plain }: { sector: string; plain?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="skew-speed inline-block bg-livery px-2.5 py-1.5">
        <span className="unskew-speed label-mono block font-bold text-white">{sector}</span>
      </span>
      {plain && <span className="label-mono text-tyre-grey">{plain}</span>}
    </div>
  );
}

export function SectionHeader({
  sector,
  plain,
  title,
  subtitle,
  as: Tag = "h2",
  align = "left",
  className,
  children,
}: Props) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <SectorLabel sector={sector} plain={plain} />
      <Tag
        className={cn(
          "display-italic font-black",
          Tag === "h1"
            ? "text-[44px] sm:text-6xl lg:text-[80px]"
            : "text-[34px] sm:text-5xl lg:text-[56px]",
        )}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className={cn("max-w-2xl text-base text-tyre-grey sm:text-lg", align === "center" && "mx-auto")}>
          {subtitle}
        </p>
      )}
      {children}
    </Reveal>
  );
}
