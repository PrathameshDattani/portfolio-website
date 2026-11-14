/**
 * Font size for wide display type that never overflows: the longest single word
 * (which can't wrap) must fit the available width.
 *
 * @param text      the heading text
 * @param vw        preferred size in vw
 * @param max       cap in px
 * @param share     fraction of the content width the heading lives in (1 = full width)
 * @param charWidth average glyph width in em for the display face (Archivo wdth 125, caps)
 */
export function fitDisplay(text: string, vw: number, max: number, share = 1, charWidth = 0.9): string {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  return `min(${max}px, ${vw}vw, calc((100vw - 2 * var(--gutter)) * ${share} / ${(longest * charWidth).toFixed(2)}))`;
}
