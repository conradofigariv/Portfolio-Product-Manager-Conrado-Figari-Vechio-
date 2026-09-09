// Inline SVGs instead of flag emoji (🇪🇸/🇺🇸) — regional-indicator flag emoji
// have no reliable fallback glyph on Linux without a full color-emoji font
// installed, and render as bare "ES"/"US" text instead of a flag (reported:
// screenshot from the sandbox itself showed exactly that). An SVG renders
// identically everywhere regardless of the OS's font support.

export function FlagES({ className = 'w-4 h-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={`${className} shrink-0 rounded-[2px]`} aria-hidden="true">
      <rect width="20" height="14" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
    </svg>
  )
}

export function FlagUS({ className = 'w-4 h-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={`${className} shrink-0 rounded-[2px]`} aria-hidden="true">
      <rect width="20" height="14" fill="#B31942" />
      <rect y="2" width="20" height="2" fill="#fff" />
      <rect y="6" width="20" height="2" fill="#fff" />
      <rect y="10" width="20" height="2" fill="#fff" />
      <rect width="9" height="8" fill="#0A3161" />
    </svg>
  )
}
