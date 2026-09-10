'use client'

import { useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useLang } from '../context/LanguageContext'
import BackgroundPicker from './BackgroundPicker'
import LanguageHint from './LanguageHint'
import { FlagES, FlagUS } from './FlagIcon'
import { dismissLanguageHint } from '../lib/portfolio-actions'

// Nothing ever subscribes to this — it exists only so useSyncExternalStore
// below has a no-op to call, which is the point: this is the officially
// documented zero-effect way to detect "hydration has finished, we're
// genuinely client-side now" (getServerSnapshot runs during SSR *and* during
// the initial client render that has to match it, getSnapshot only takes over
// after that). A `useEffect(() => setMounted(true), [])` does the same thing
// but calling setState synchronously inside a bare effect body is exactly
// what this project's react-hooks/set-state-in-effect rule flags (the same
// rule Hero.tsx already has a known, unfixed instance of) — this sidesteps
// it by never calling setState at all.
const noopSubscribe = () => () => {}

export default function Navbar({ showLanguageHint = false }: { showLanguageHint?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCVOpen, setIsCVOpen] = useState(false)
  const { t, lang, toggleLang, content, media, editing } = useLang()

  // Closing with "Entendido" always hides the callout for the rest of this
  // visit — hintDismissed is plain client state, not persisted. Only ticking
  // the checkbox first makes that permanent (see dismissLanguageHint): if the
  // owner just clicks through without checking it, the hint comes back next
  // time they load the editor, which is the point of having a separate box
  // rather than treating any dismissal as "never show again".
  const [hintDismissed, setHintDismissed] = useState(false)
  const [rememberHint, setRememberHint] = useState(false)
  const hintVisible = showLanguageHint && !hintDismissed

  // The CV modal's own portal below never needs this — isCVOpen always starts
  // false, so its first (server) render never reaches document.body. This
  // one's visibility comes straight from a server-computed prop, so it can be
  // true on that very first render, and `document` does not exist there.
  // false during SSR and through the client's initial (hydration-matching)
  // render, true from the next client render on — see noopSubscribe above.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )

  function confirmHint() {
    setHintDismissed(true)
    if (rememberHint) void dismissLanguageHint()
  }

  const initials = content.hero.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  const navLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.contact, href: '#contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur border-b border-dark-700">
      <div className="container-main flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold hover:text-dark-100 transition tracking-tight">
          {initials}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-dark-300 hover:text-dark-50 transition text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: Lang toggle + CV */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle — relative wrapper so the callout below can
              anchor to it, same convention as BackgroundPicker's own
              dropdown right below. */}
          <div className="relative">
            <button
              onClick={toggleLang}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-400/40 text-dark-300 hover:text-dark-50 hover:border-dark-200 transition text-xs font-mono ${
                hintVisible ? 'shadow-[0_0_0_3px_rgba(216,255,62,0.35)]' : ''
              }`}
              aria-label="Toggle language"
            >
              <span className={`flex items-center gap-1 ${lang === 'en' ? 'text-dark-50 font-bold' : ''}`}>
                <FlagUS /> EN
              </span>
              <span className="text-dark-600">/</span>
              <span className={`flex items-center gap-1 ${lang === 'es' ? 'text-dark-50 font-bold' : ''}`}>
                <FlagES /> ES
              </span>
            </button>
            {hintVisible && (
              <LanguageHint
                t={t.languageHint}
                remember={rememberHint}
                onToggleRemember={setRememberHint}
                onConfirm={confirmHint}
              />
            )}
          </div>

          <BackgroundPicker />

          {editing && (
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-dark-300 hover:text-dark-50 transition text-sm">
                Cerrar sesión
              </button>
            </form>
          )}

          {media.cv && (
            <button
              onClick={() => setIsCVOpen(true)}
              className="button-secondary text-sm py-2"
            >
              {t.nav.viewCV}
            </button>
          )}
        </div>

        {/* Mobile: lang toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <div className="relative">
            <button
              onClick={toggleLang}
              className={`flex items-center gap-1 text-dark-300 hover:text-dark-50 transition text-xs font-mono rounded ${
                hintVisible ? 'shadow-[0_0_0_3px_rgba(216,255,62,0.35)]' : ''
              }`}
            >
              {lang === 'en' ? (
                <>
                  <FlagES /> ES
                </>
              ) : (
                <>
                  <FlagUS /> EN
                </>
              )}
            </button>
            {hintVisible && (
              <LanguageHint
                t={t.languageHint}
                remember={rememberHint}
                onToggleRemember={setRememberHint}
                onConfirm={confirmHint}
              />
            )}
          </div>
          <BackgroundPicker />
          {editing && (
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-dark-300 hover:text-dark-50 transition text-sm">
                Cerrar sesión
              </button>
            </form>
          )}
          <button
            className="text-dark-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700">
          <div className="container-main py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-dark-300 hover:text-dark-50 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {media.cv && (
              <button
                onClick={() => {
                  setIsOpen(false)
                  setIsCVOpen(true)
                }}
                className="button-secondary inline-block text-center text-sm"
              >
                {t.nav.viewCV}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Dims the rest of the page while the callout is up. Portalled to
          body with a z-index *below* nav's own z-50 rather than above it —
          nav establishes its own stacking context (sticky + z-index), so
          everything inside it, including this callout, already paints above
          any lower-z sibling of nav regardless of where in the DOM that
          sibling lives. Putting the overlay above nav's z-index instead would
          also dim the toggle it's supposed to be spotlighting.
          pointer-events-none: this is a visual cue, not a click-trap — the
          rest of the page stays fully usable while it's up, and the callout
          only ever closes via its own "Entendido" button. */}
      {mounted &&
        hintVisible &&
        createPortal(
          <div className="fixed inset-0 z-40 bg-black/50 pointer-events-none" aria-hidden="true" />,
          document.body
        )}

      {isCVOpen &&
        media.cv &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setIsCVOpen(false)}
          >
            <div
              className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700">
                <span className="text-dark-50 font-semibold text-sm">CV</span>
                <div className="flex items-center gap-2">
                  <a
                    href={media.cv}
                    download
                    className="button-secondary text-sm py-1.5"
                  >
                    {t.nav.downloadCVAction}
                  </a>
                  <button
                    onClick={() => setIsCVOpen(false)}
                    aria-label={t.nav.closeCV}
                    className="text-dark-300 hover:text-dark-50 transition p-1.5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <iframe
                src={`${media.cv}#view=FitH`}
                title="CV"
                className="flex-1 w-full bg-white"
              />
            </div>
          </div>,
          document.body
        )}
    </nav>
  )
}
