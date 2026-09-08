// A curated palette rather than a free-form color picker — swatches, per the
// brief. Matches the site's own dark-* palette plus the lime accent, with a
// handful of standard colors for flexibility. Shared between the toolbar's
// swatch grid and the server-side sanitizer's whitelist, so the two can't
// drift apart (an arbitrary hex could otherwise reach a public page).
export const TEXT_COLORS = [
  { label: 'White', value: '#f9f9fa' },
  { label: 'Light gray', value: '#d8d8dd' },
  { label: 'Muted gray', value: '#a0a0a6' },
  { label: 'Lime', value: '#d8ff3e' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Blue', value: '#60a5fa' },
  { label: 'Green', value: '#4ade80' },
] as const

const ALLOWED_COLOR_VALUES = new Set<string>(TEXT_COLORS.map((c) => c.value))

export function isAllowedColor(value: unknown): value is string {
  return typeof value === 'string' && ALLOWED_COLOR_VALUES.has(value)
}

// The single fixed highlight color — shared between the Tiptap extension
// config (edit view) and render-html.ts (public read view) so both render
// identically instead of the public page silently losing the styling.
export const HIGHLIGHT_STYLE = 'background-color: rgba(216, 255, 62, 0.35); color: inherit'
