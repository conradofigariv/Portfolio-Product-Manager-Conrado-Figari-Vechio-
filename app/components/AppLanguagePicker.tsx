'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { FlagES, FlagUS } from './FlagIcon'

/**
 * The dropdown under Navbar's initials icon — picks `uiLang` (the owner's
 * own private tools: the tour, and this dropdown's own label — see
 * LanguageContext's `uiLang` comment), not `lang` (which portfolio content —
 * and everything presented alongside it, like nav labels — is shown in;
 * that's the separate EN/ES pill toggle right next to this one).
 *
 * Same open/close-on-outside-click/Escape shape as BackgroundPicker.tsx.
 * Replaces what used to be a plain `<Link href="/">{initials}</Link>` — the
 * initials button is now this dropdown's trigger instead of a home link.
 */
export default function AppLanguagePicker({ initials }: { initials: string }) {
  const { uiT, uiLang, setUiLang } = useLang()
  const [open, setOpen] = useState(false)
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

  function choose(next: 'en' | 'es') {
    setUiLang(next)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={uiT.appLanguage.label}
        aria-expanded={open}
        className="text-xl font-bold hover:text-dark-100 transition tracking-tight"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-10 w-48 rounded-xl border border-dark-600 bg-dark-900/95 backdrop-blur p-3 space-y-2 shadow-xl">
          <p className="text-xs text-dark-400">{uiT.appLanguage.label}</p>

          <button
            type="button"
            onClick={() => choose('en')}
            className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
              uiLang === 'en'
                ? 'border-dark-300 text-dark-50 bg-dark-50/10'
                : 'border-dark-600 text-dark-300 hover:text-dark-50 hover:border-dark-400'
            }`}
          >
            <FlagUS /> English
          </button>

          <button
            type="button"
            onClick={() => choose('es')}
            className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
              uiLang === 'es'
                ? 'border-dark-300 text-dark-50 bg-dark-50/10'
                : 'border-dark-600 text-dark-300 hover:text-dark-50 hover:border-dark-400'
            }`}
          >
            <FlagES /> Español
          </button>
        </div>
      )}
    </div>
  )
}
