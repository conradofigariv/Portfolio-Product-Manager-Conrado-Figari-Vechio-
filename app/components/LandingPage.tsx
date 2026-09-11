'use client'

import { useState } from 'react'
import GoogleSignInButton from './GoogleSignInButton'
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

        <header className="relative z-[3] flex items-center justify-between sm:justify-end gap-4 px-5 sm:px-9 lg:px-[72px] py-6">
          {/* Absolutely centered from `sm` up, so it stays dead-center
              regardless of how wide the right-side cluster gets — a flex/grid
              split would need the left side to carry matching weight, and
              there's nothing to put there now that the lang toggle moved to
              the right, next to Iniciar sesión/Empieza gratis, matching the
              portfolio Navbar's own layout (lang toggle grouped with the
              other header actions).

              Below `sm`, `static` instead: the header's own justify-between
              puts this first child on the left and the right-side cluster on
              the right, in normal flex flow rather than layered independently
              — reported live as an overlapping mess at mobile widths
              ("EN/ES" toggle, the logo, "Iniciar sesión", and "Empieza
              gratis" all stacked on top of each other), since an
              always-absolute-centered logo and a `justify-end` cluster don't
              coordinate with each other about how much space either one
              actually needs; on a narrow screen the cluster's natural width
              alone exceeds half the viewport, so it runs straight through the
              centered logo's fixed position regardless of its own width. The
              "Portfolio App" wordmark is also dropped below `sm` (icon only)
              to free up enough width for the toggle + CTA to fit without
              wrapping. */}
          <div className="static sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 flex items-center gap-2.5">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-[#d8ff3e] flex items-center justify-center text-[15px] font-semibold text-[#08080a] tracking-[-0.03em] flex-shrink-0">
              P
            </div>
            <span className="hidden sm:inline text-[17px] font-semibold tracking-[-0.02em]">Portfolio App</span>
          </div>

          <div className="flex items-center gap-4">
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

            {/* Redundant with "Empieza gratis" right next to it (both start
                the same Google sign-in) — dropped below `sm` purely to make
                room; kept from `sm` up, where there's space for both. */}
            <GoogleSignInButton
              showIcon={false}
              label={t.signIn}
              pendingLabel={t.redirecting}
              className="hidden sm:inline-flex text-[14.5px] text-[#d4d4d8] hover:text-white transition-colors disabled:opacity-60"
            />
            <GoogleSignInButton
              showIcon={false}
              label={t.startFree}
              pendingLabel={t.redirecting}
              className="inline-flex items-center h-10 px-5 rounded-full bg-[#d8ff3e] text-[#08080a] text-[14.5px] font-semibold tracking-[-0.01em] transition-[filter] hover:brightness-110 disabled:opacity-60 flex-shrink-0"
            />
          </div>
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

    </>
  )
}
