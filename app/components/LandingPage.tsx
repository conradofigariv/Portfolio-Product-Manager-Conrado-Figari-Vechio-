'use client'

import { useState } from 'react'
import GoogleSignInButton from './GoogleSignInButton'
import DemoStage from './DemoStage'
import { FlagES, FlagUS } from './FlagIcon'

// The landing page has its own small EN/ES copy table rather than reusing
// LanguageContext — that context holds one portfolio owner's *content*,
// fetched per-user from portfolio_blocks/portfolios.content. This page has
// no portfolio, no owner, and no signed-in user yet, so there's nothing to
// fetch; the strings below are the entire bilingual surface.
const COPY = {
  es: {
    signIn: 'Iniciar sesión',
    startFree: 'Empieza gratis',
    redirecting: 'Redirigiendo…',
    headlineLine1: 'Tu trabajo se merece',
    headlineLine2: 'más que un PDF',
    subheading:
      'Creá tu espacio profesional para contar tu historia, mostrar tus proyectos y conectar con nuevas oportunidades.',
    errorTitle: 'Algo salió mal al iniciar sesión.',
    howNav: 'Probalo',
    howTitle: 'Probalo acá mismo',
    howSubtitle:
      'Esto no es una captura: es el editor de verdad. Hacé click en cualquier texto y escribí encima, sumá líneas, cambiá el orden. Así se edita tu portfolio, sobre el diseño final y sin formularios.',
    howHints: [
      {
        title: 'Click y escribís',
        body: 'En cualquier texto. Seleccioná algo y aparece la barrita: negrita, tamaño, tipografía, color.',
      },
      {
        title: 'Sumá y sacá',
        body: 'Agregá líneas y tags con los botones punteados, o sacá los que no van con la ×.',
      },
      {
        title: 'Arrastrá para ordenar',
        body: 'Tomá cualquier línea o tag del asa de la izquierda y movela de lugar.',
      },
    ],
    demoChrome: 'demo — no se guarda',
    demoDisclaimer:
      'Es una demo: nada de lo que escribas acá se guarda. Creá tu cuenta para tener el tuyo de verdad.',
    howCtaTitle: 'Empezá el tuyo ahora',
    howCtaBody: 'Entrás con Google y ya estás editando. Tu portfolio queda online desde el primer minuto.',
    howCtaButton: 'Crear mi portfolio gratis',
    howCtaFoot: 'Gratis. Sin tarjeta.',
  },
  en: {
    signIn: 'Sign in',
    startFree: 'Start for free',
    redirecting: 'Redirecting…',
    headlineLine1: 'Your work deserves',
    headlineLine2: 'more than a PDF',
    subheading:
      'Create your professional space to tell your story, showcase your projects, and connect with new opportunities.',
    errorTitle: 'Something went wrong signing in.',
    howNav: 'Try it',
    howTitle: 'Try it right here',
    howSubtitle:
      'This is not a screenshot — it is the real editor. Click any text and type over it, add lines, change the order. This is how you edit your portfolio: on the finished design, with no forms.',
    howHints: [
      {
        title: 'Click and type',
        body: 'On any text. Select something and the toolbar appears: bold, size, font, color.',
      },
      {
        title: 'Add and remove',
        body: 'Add lines and tags with the dashed buttons, or drop the ones you do not want with the ×.',
      },
      {
        title: 'Drag to reorder',
        body: 'Grab any line or tag by the handle on its left and move it.',
      },
    ],
    demoChrome: 'demo — nothing is saved',
    demoDisclaimer:
      'This is a demo: nothing you type here is saved. Create your account to get one for real.',
    howCtaTitle: 'Start yours now',
    howCtaBody: 'Sign in with Google and you are already editing. Your portfolio is online from minute one.',
    howCtaButton: 'Create my portfolio — free',
    howCtaFoot: 'Free. No card.',
  },
} as const

type Lang = keyof typeof COPY

export default function LandingPage({ error, reason }: { error?: string; reason?: string }) {
  const [lang, setLang] = useState<Lang>('es')
  const t = COPY[lang]

  return (
    <>
      <section className="relative min-h-[min(92vh,860px)] flex flex-col overflow-hidden bg-[#08080a]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[1]"
        >
          <source src="/videos/video-2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-[2] pointer-events-none bg-[linear-gradient(100deg,rgba(8,8,10,0.94)_0%,rgba(8,8,10,0.82)_34%,rgba(8,8,10,0.35)_62%,rgba(8,8,10,0.55)_100%)]" />
        <div className="absolute left-0 right-0 bottom-0 h-[200px] z-[2] pointer-events-none bg-[linear-gradient(to_bottom,rgba(8,8,10,0)_0%,#08080a_96%)]" />

        <header className="relative z-[3] flex items-center justify-end gap-4 px-5 sm:px-9 lg:px-[72px] py-6">
          {/* Absolutely centered so it stays dead-center regardless of how
              wide the right-side cluster below gets — a flex/grid split would
              need the left side to carry matching weight, and there's nothing
              to put there now that the lang toggle moved to the right, next to
              Iniciar sesión/Empieza gratis, matching the portfolio Navbar's own
              layout (lang toggle grouped with the other header actions). */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-[#d8ff3e] flex items-center justify-center text-[15px] font-semibold text-[#08080a] tracking-[-0.03em]">
              P
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.02em]">Portfolio App</span>
          </div>

          <a href="#como" className="text-[14.5px] text-[#d4d4d8] hover:text-white transition-colors">
            {t.howNav}
          </a>

          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 text-[13px] font-mono text-[#a1a1aa] hover:text-white hover:border-white/30 transition-colors"
            aria-label="Cambiar idioma / Toggle language"
          >
            <span className={`flex items-center gap-1 ${lang === 'en' ? 'text-white font-semibold' : ''}`}>
              <FlagUS /> EN
            </span>
            <span className="text-white/20">/</span>
            <span className={`flex items-center gap-1 ${lang === 'es' ? 'text-white font-semibold' : ''}`}>
              <FlagES /> ES
            </span>
          </button>

          <GoogleSignInButton
            showIcon={false}
            label={t.signIn}
            pendingLabel={t.redirecting}
            className="text-[14.5px] text-[#d4d4d8] hover:text-white transition-colors disabled:opacity-60"
          />
          <GoogleSignInButton
            showIcon={false}
            label={t.startFree}
            pendingLabel={t.redirecting}
            className="inline-flex items-center h-10 px-5 rounded-full bg-[#d8ff3e] text-[#08080a] text-[14.5px] font-semibold tracking-[-0.01em] transition-[filter] hover:brightness-110 disabled:opacity-60"
          />
        </header>

        <div className="relative z-[3] flex-1 flex items-center px-5 sm:px-9 lg:px-[72px] py-12 sm:py-16 lg:py-20">
          <div className="max-w-[760px]">
            <h1 className="m-0 text-[40px] sm:text-[56px] lg:text-[76px] leading-[0.98] tracking-[-0.035em] font-medium [text-wrap:balance]">
              {t.headlineLine1}
              <br />
              {t.headlineLine2}
            </h1>

            <p className="mt-5 max-w-[520px] text-[17px] sm:text-[19px] leading-[1.5] text-[#d4d4d8] [text-wrap:balance]">
              {t.subheading}
            </p>

            {/* max-w-[520px] matches the subheading's own width exactly (not
                the wider 760px headline column), so centering within this box
                centers the CTA to the subheading specifically, not to
                whichever line of the headline happens to be widest. */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-9 max-w-[520px]">
              <GoogleSignInButton
                showIcon={false}
                label={t.startFree}
                pendingLabel={t.redirecting}
                className="inline-flex items-center h-[52px] px-8 rounded-full bg-[#d8ff3e] text-[#08080a] text-base font-semibold tracking-[-0.01em] transition-[filter] hover:brightness-110 disabled:opacity-60"
              />
            </div>

            {error && (
              <div className="mt-4">
                <p className="text-sm text-red-400">{t.errorTitle}</p>
                {reason && <p className="text-xs text-[#71717a] mt-1 break-words max-w-md">{reason}</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="como" className="px-5 sm:px-9 lg:px-[72px] py-16 sm:py-24 lg:py-[140px] border-t border-white/[0.08]">
        <div className="max-w-[1180px] mx-auto">
          <h2 className="m-0 max-w-[560px] text-[28px] sm:text-[36px] lg:text-[46px] leading-[1.06] tracking-[-0.03em] font-medium">
            {t.howTitle}
          </h2>
          <p className="mt-4 max-w-[560px] text-[15.5px] sm:text-base text-[#a1a1aa] leading-relaxed">
            {t.howSubtitle}
          </p>

          {/* What each hint points at is right there to be tried, so these stay
              short — they're a nudge toward the first click, not a manual. */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
            {t.howHints.map((hint) => (
              <div key={hint.title} className="flex gap-3 flex-1 min-w-[200px] max-w-[300px]">
                <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#d8ff3e]" />
                <div>
                  <p className="m-0 text-[14.5px] font-semibold">{hint.title}</p>
                  <p className="m-0 mt-1 text-[13.5px] text-[#a1a1aa] leading-relaxed">{hint.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 rounded-2xl overflow-hidden border border-white/10">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.08] bg-[#0c0c0f]">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="ml-2 text-[12px] text-[#71717a] font-mono">{t.demoChrome}</span>
            </div>
            <DemoStage lang={lang} />
          </div>

          {/* Stated plainly and right under the thing itself: someone who types
              their real experience in here and closes the tab loses it, and
              finding that out afterwards would be entirely our fault. */}
          <p className="mt-4 text-[13px] text-[#71717a] text-center">{t.demoDisclaimer}</p>

          {/* The whole section exists to end here — trying it is the argument,
              this is the ask. */}
          <div className="mt-16 sm:mt-24 rounded-2xl border border-white/10 bg-[#0c0c0f] px-6 sm:px-10 py-10 sm:py-12 text-center">
            <h3 className="m-0 text-[24px] sm:text-[32px] font-medium tracking-[-0.03em] [text-wrap:balance]">
              {t.howCtaTitle}
            </h3>
            <p className="mt-3 mx-auto max-w-[460px] text-[15.5px] text-[#a1a1aa] leading-relaxed [text-wrap:balance]">
              {t.howCtaBody}
            </p>
            <div className="flex justify-center mt-7">
              <GoogleSignInButton
                label={t.howCtaButton}
                pendingLabel={t.redirecting}
                className="inline-flex items-center justify-center gap-2.5 h-[52px] px-8 rounded-full bg-[#d8ff3e] text-[#08080a] text-base font-semibold tracking-[-0.01em] transition-[filter] hover:brightness-110 disabled:opacity-60"
              />
            </div>
            <p className="mt-3 text-[13px] text-[#71717a]">{t.howCtaFoot}</p>
          </div>
        </div>
      </section>
    </>
  )
}
