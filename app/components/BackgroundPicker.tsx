'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '../context/LanguageContext'
import { setBackgroundVideos } from '../lib/portfolio-actions'
import { PRESET_BACKGROUND_VIDEOS } from '../lib/preset-media'

/**
 * A single background, chosen from the set that ships with the site — a radio
 * choice, not a multi-select. It is not uploadable on purpose: video is by far
 * the heaviest asset here, and one 10MB file per account would exhaust the
 * storage tier long before anything else. Serving the same few files from
 * /public costs nothing per account.
 */
export default function BackgroundPicker() {
  const { editing, media } = useLang()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!editing) return null

  const current = media.backgroundVideos[0] ?? null

  async function choose(src: string | null) {
    setBusy(true)
    setError(null)
    const result = await setBackgroundVideos(src ? [src] : [])
    setBusy(false)
    if (result.ok) router.refresh()
    else setError(result.error)
  }

  return (
    // relative: the panel below is positioned absolute against this, not
    // left in normal flow — it used to be a plain flex-col sibling of the
    // trigger, so opening it (taller than the navbar row) got vertically
    // centered by the row's own items-center and ended up half-hidden
    // behind the navbar instead of dropping down below it.
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 rounded-lg border border-dark-400/40 bg-dark-900/70 backdrop-blur text-dark-200 hover:text-dark-50 hover:border-dark-200 transition text-xs font-mono"
      >
        Background
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-10 w-64 rounded-xl border border-dark-600 bg-dark-900/95 backdrop-blur p-3 space-y-2 shadow-xl">
          <p className="text-xs text-dark-400">Pick one.</p>

          <button
            type="button"
            disabled={busy}
            onClick={() => choose(null)}
            className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition disabled:opacity-50 ${
              current === null
                ? 'border-dark-300 text-dark-50 bg-dark-50/10'
                : 'border-dark-600 text-dark-300 hover:text-dark-50 hover:border-dark-400'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 ${
                current === null ? 'border-dark-50 bg-dark-50' : 'border-dark-500'
              }`}
            />
            None
          </button>

          {PRESET_BACKGROUND_VIDEOS.map((preset) => (
            <button
              key={preset.src}
              type="button"
              disabled={busy}
              onClick={() => choose(preset.src)}
              className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition disabled:opacity-50 ${
                current === preset.src
                  ? 'border-dark-300 text-dark-50 bg-dark-50/10'
                  : 'border-dark-600 text-dark-300 hover:text-dark-50 hover:border-dark-400'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 ${
                  current === preset.src ? 'border-dark-50 bg-dark-50' : 'border-dark-500'
                }`}
              />
              {preset.label}
            </button>
          ))}

          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      )}
    </div>
  )
}
