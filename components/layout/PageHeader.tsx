import type { ReactNode } from "react";
import { SectionHeader } from "@/components/f1/SectionHeader";

/** Standard top-of-page header with grid backdrop and livery glow. */
export function PageHeader({
  sector,
  plain,
  title,
  subtitle,
  children,
}: {
  sector: string;
  plain: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pt-[calc(var(--nav-h)+64px)] pb-14 lg:pt-[calc(var(--nav-h)+96px)] lg:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_30%_0%,black,transparent)]" />
        <div className="absolute -top-40 -left-20 h-[420px] w-[620px] rounded-full bg-[radial-gradient(closest-side,var(--livery-glow),transparent)] opacity-30 blur-3xl" />
      </div>
      <div className="container-race">
        <SectionHeader as="h1" sector={sector} plain={plain} title={title} subtitle={subtitle}>
          {children}
        </SectionHeader>
      </div>
    </section>
  );
}
