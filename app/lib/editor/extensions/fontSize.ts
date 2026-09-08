// Tiptap v3 ships an official FontSize extension bundled in
// @tiptap/extension-text-style (editor.commands.setFontSize('16px')),
// storing size as a raw CSS string on the textStyle mark — so this file
// doesn't define an extension of its own, just the whitelist the toolbar
// control and the server-side sanitizer (render-html.ts) both check
// against, kept in one place so they can't drift apart.
// Mirrors Tailwind's own default text-size scale (xs through 8xl) rather
// than an arbitrary list — these fields sit inline among Tailwind-styled
// headings (e.g. the hero name renders at 60px via text-6xl), so the
// options line up with sizes already used on the page instead of topping
// out below them.
export const FONT_SIZES = [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96] as const
export type FontSizeValue = (typeof FONT_SIZES)[number]

const ALLOWED_CSS_VALUES = new Set<string>(FONT_SIZES.map((n) => `${n}px`))

export function isFontSizeCss(value: unknown): value is string {
  return typeof value === 'string' && ALLOWED_CSS_VALUES.has(value)
}

export function fontSizeToCss(size: FontSizeValue): string {
  return `${size}px`
}

export function cssToFontSize(css: unknown): FontSizeValue | undefined {
  if (typeof css !== 'string') return undefined
  const n = parseInt(css, 10)
  return (FONT_SIZES as readonly number[]).includes(n) ? (n as FontSizeValue) : undefined
}
