'use client'

import { useState } from 'react'
import GoogleSignInButton from './GoogleSignInButton'

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
      <header className="relative z-[3] flex items-center justify-between gap-8 px-5 sm:px-9 lg:px-[72px] py-6">
        <div className="flex items-center gap-9">
          <div className="flex items-center gap-2.5">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-[#d8ff3e] flex items-center justify-center text-[15px] font-semibold text-[#08080a] tracking-[-0.03em]">
              P
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.02em]">Portfolio App</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1 text-[13px] font-mono text-[#a1a1aa] hover:text-white transition-colors"
            aria-label="Cambiar idioma / Toggle language"
          >
            <span className={lang === 'es' ? 'text-white font-semibold' : ''}>ES</span>
            <span className="text-white/20">/</span>
            <span className={lang === 'en' ? 'text-white font-semibold' : ''}>EN</span>
          </button>
          <div className="flex items-center gap-4">
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
              className="inline-flex items-center h-10 px-5 rounded-full bg-[#f4f4f5] text-[#08080a] text-[14.5px] font-semibold tracking-[-0.01em] transition-colors hover:bg-white disabled:opacity-60"
            />
          </div>
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

          {/* Centered within this text column's own width (not the full
              page) — the block itself stays left-anchored like the rest of
              the hero, only the CTA is centered relative to the text above it. */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
            <GoogleSignInButton
              showIcon={false}
              label={t.startFree}
              pendingLabel={t.redirecting}
              className="inline-flex items-center h-[52px] px-8 rounded-full bg-[#f4f4f5] text-[#08080a] text-base font-semibold tracking-[-0.01em] transition-colors hover:bg-white disabled:opacity-60"
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
    </>
  )
}
