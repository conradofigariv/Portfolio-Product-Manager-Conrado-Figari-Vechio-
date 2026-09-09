// A curated set of font families rather than a free-form picker — same
// whitelist-only approach as colors.ts and fontSize.ts, shared between the
// toolbar's dropdown and the server-side sanitizer (render-html.ts) so the
// two can't drift apart. All ten are OS-provided (no next/font/Google Fonts
// loading needed), so a style applied in the editor renders identically on
// the public page with no extra network request and no flash of unstyled
// text — the same reason the rest of this app avoids loading fonts.
// "Sans" and "Mono" deliberately match the page's own existing defaults
// (Tailwind's font-sans/font-mono stacks) so switching to another option and
// back reproduces the original look exactly, not just something close to it.
// Single quotes around multi-word family names, not double — these values
// get embedded straight into an HTML `style="..."` attribute (render-html.ts),
// which is itself double-quoted, so a literal `"` here would close that
// attribute early. CSS accepts either quote style for a quoted family name.
export const FONT_FAMILIES = [
  { label: 'Sans', value: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
  { label: 'Mono', value: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Courier New', monospace" },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet', value: "'Trebuchet MS', sans-serif" },
  { label: 'Georgia', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Palatino', value: "Palatino, 'Palatino Linotype', 'Book Antiqua', serif" },
  { label: 'Garamond', value: "Garamond, 'EB Garamond', serif" },
  { label: 'Courier', value: "'Courier New', Courier, monospace" },
] as const

const ALLOWED_FONT_FAMILY_VALUES = new Set<string>(FONT_FAMILIES.map((f) => f.value))

export function isAllowedFontFamily(value: unknown): value is string {
  return typeof value === 'string' && ALLOWED_FONT_FAMILY_VALUES.has(value)
}
