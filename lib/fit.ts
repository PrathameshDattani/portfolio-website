/**
 * Font size for wide display type that never overflows: the longest single word
 * (which can't wrap) must fit the available width.
 *
 * @param text      the heading text
 * @param vw        preferred size in vw
 * @param max       cap in px
 * @param share     fraction of the content width the heading lives in (1 = full width)
 * @param charWidth average glyph width in em for the display face (Archivo wdth 125, heavy caps measure ~1.04em)
 */
export function fitDisplay(text: string, vw: number, max: number, share = 1, charWidth = 1.06): string {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  // content width is capped by `.wrap` (max-width 1440px), not the viewport
  return `min(${max}px, ${vw}vw, calc((min(100vw, 1440px) - 2 * var(--gutter)) * ${share} / ${(longest * charWidth).toFixed(2)}))`;
}
