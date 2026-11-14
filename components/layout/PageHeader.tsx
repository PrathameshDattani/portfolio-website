import type { ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal, Rule } from "@/components/ui/Reveal";

/** Editorial page opener: index + label, oversized title, intro copy, drawn rule. */
export function PageHeader({
  index,
  label,
  plain,
  title,
  intro,
  aside,
}: {
  index: string;
  label: string;
  plain: string;
  title: string;
  intro?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="wrap pt-[calc(var(--nav-h)+clamp(56px,10vw,140px))] pb-[clamp(48px,7vw,96px)]">
      <Reveal className="flex items-center gap-3" y={12}>
        <span className="eyebrow !text-livery-ink">({index})</span>
        <span className="eyebrow">
          {label} — {plain}
        </span>
      </Reveal>
      <SplitReveal as="h1" text={title} className="display mt-6 text-[clamp(52px,11vw,180px)] font-[750]" duration={1.25} />
      <Rule className="mt-[clamp(32px,5vw,64px)]" delay={0.3} />
      {(intro || aside) && (
        <div className="mt-8 grid gap-8 md:grid-cols-12">
          {intro && (
            <Reveal delay={0.35} className="md:col-span-6 md:col-start-7">
              <div className="max-w-xl text-[17px] leading-relaxed text-fg/80">{intro}</div>
            </Reveal>
          )}
          {aside && (
            <Reveal delay={0.25} className="md:col-span-5 md:row-start-1">
              {aside}
            </Reveal>
          )}
        </div>
      )}
    </section>
  );
}

/** Section opener used inside pages. */
export function SectionLabel({ index, children, className }: { index: string; children: ReactNode; className?: string }) {
  return (
    <Reveal y={12} className={`flex items-center gap-3 ${className ?? ""}`}>
      <span className="eyebrow !text-livery-ink">({index})</span>
      <span className="eyebrow">{children}</span>
    </Reveal>
  );
}
