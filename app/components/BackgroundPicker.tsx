'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '../context/LanguageContext'
import { setBackgroundVideos } from '../lib/portfolio-actions'
import { MAX_BACKGROUND_VIDEOS, PRESET_BACKGROUND_VIDEOS } from '../lib/preset-media'

/**
 * Backgrounds are chosen from the set that ships with the site. They are not
 * uploadable on purpose: video is by far the heaviest asset here, and one
 * 10MB file per account would exhaust the storage tier long before anything
 * else does. Serving the same few files from /public costs nothing per account.
 */
export default function BackgroundPicker() {
  const { editing, media } = useLang()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (!editing) return null

  const current = media.backgroundVideos
  const chosen = (src: string) => current.includes(src)

  async function apply(next: string[]) {
    setBusy(true)
    setError(null)
    const result = await setBackgroundVideos(next)
    setBusy(false)
    if (result.ok) router.refresh()
    else setError(result.error)
  }

  function toggle(src: string) {
    if (chosen(src)) apply(current.filter((item) => item !== src))
    else if (current.length < MAX_BACKGROUND_VIDEOS) apply([...current, src])
    else apply([...current.slice(1), src])
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 rounded-lg border border-dark-400/40 bg-dark-900/70 backdrop-blur text-dark-200 hover:text-dark-50 hover:border-dark-200 transition text-xs font-mono"
      >
        Background
      </button>

      {open && (
        <div className="w-64 rounded-xl border border-dark-600 bg-dark-900/95 backdrop-blur p-3 space-y-2 shadow-xl">
          <p className="text-xs text-dark-400">Pick up to {MAX_BACKGROUND_VIDEOS}.</p>

          {PRESET_BACKGROUND_VIDEOS.map((preset) => (
            <button
              key={preset.src}
              type="button"
              disabled={busy}
              onClick={() => toggle(preset.src)}
              className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs transition disabled:opacity-50 ${
                chosen(preset.src)
                  ? 'border-dark-300 text-dark-50 bg-dark-50/10'
                  : 'border-dark-600 text-dark-300 hover:text-dark-50 hover:border-dark-400'
              }`}
            >
              {preset.label}
              <span>{chosen(preset.src) ? 'Selected' : 'Use'}</span>
            </button>
          ))}

          {current.length > 0 && (
            <button
              type="button"
              disabled={busy}
              onClick={() => apply([])}
              className="w-full text-xs text-dark-500 hover:text-dark-300 py-1"
            >
              No background
            </button>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      )}
    </div>
  )
}
