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
    howNav: 'Cómo funciona',
    howTitle: 'Así se edita tu portfolio',
    howSubtitle: 'Este es el portfolio real de Conrado — el mismo diseño que vas a tener vos, explicado en el lugar.',
    exampleName: 'Conrado Figari Vechio',
    exampleTagline: 'The intersection between developers, stakeholders, and product.',
    sections: ['Historia', 'Proyectos', 'Skills', 'Certificaciones y Títulos'],
    features: [
      {
        title: 'Edición en el lugar',
        body: 'Hacé click en cualquier texto y editalo directo sobre el diseño real, sin formularios ni paneles aparte.',
      },
      {
        title: 'Organizado en secciones',
        body: 'Tu historia, tus proyectos, tus habilidades y tus certificaciones, cada uno en su propia sección lista para llenar.',
      },
      {
        title: 'Fotos: subí, recortá, reordená',
        body: 'Arrastrá una foto para subirla, elegí el punto focal y ordená la galería como quieras.',
      },
      {
        title: 'Arrastrá para reordenar',
        body: 'Reordená proyectos, capítulos, tags y más simplemente arrastrando y soltando.',
      },
    ],
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
    howNav: 'How it works',
    howTitle: "Here's how you edit your portfolio",
    howSubtitle: "This is Conrado's real portfolio — the same design you'll get, explained right in place.",
    exampleName: 'Conrado Figari Vechio',
    exampleTagline: 'The intersection between developers, stakeholders, and product.',
    sections: ['Story', 'Projects', 'Skills', 'Certifications & Degrees'],
    features: [
      {
        title: 'Edit right in place',
        body: 'Click any text and edit it directly over the real design — no forms, no separate panel.',
      },
      {
        title: 'Organized into sections',
        body: 'Your story, projects, skills, and certifications, each in its own section ready to fill in.',
      },
      {
        title: 'Photos: upload, crop, reorder',
        body: 'Drag a photo in to upload it, pick its focal point, and arrange the gallery however you like.',
      },
      {
        title: 'Drag to reorder',
        body: 'Reorder projects, chapters, tags and more just by dragging and dropping.',
      },
    ],
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

          {/* The mini "portfolio" mock below reuses Conrado's real name/tagline
              and section names (per explicit request: "mi portfolio sea el
              ejemplo") and the app's own outline-dashed editable-field
              affordance (see CLAUDE.md's CSS conventions) so the mockup reads
              as truthful to the real UI, not an invented illustration style. */}
          <div className="mt-10 sm:mt-14 rounded-2xl border border-white/10 bg-[#0c0c0f] p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
              {/* Editing mock */}
              <div>
                <p className="m-0 mb-2 text-[13px] font-mono text-[#d8ff3e]">01</p>
                <div className="inline-block rounded-md outline outline-dashed outline-1 outline-offset-4 outline-[#d8ff3e]/60 px-1">
                  <p className="m-0 text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em]">{t.exampleName}</p>
                </div>
                <p className="mt-3 text-[15px] text-[#a1a1aa] italic leading-relaxed max-w-[380px]">
                  {t.exampleTagline}
                </p>
                <p className="mt-4 text-[14px] font-semibold">{t.features[0].title}</p>
                <p className="mt-1 text-[13.5px] text-[#a1a1aa] leading-relaxed max-w-[380px]">{t.features[0].body}</p>
              </div>

              {/* Sections mock */}
              <div>
                <p className="m-0 mb-2 text-[13px] font-mono text-[#d8ff3e]">02</p>
                <div className="flex flex-wrap gap-2">
                  {t.sections.map((section) => (
                    <span
                      key={section}
                      className="px-3 py-1.5 rounded-full border border-white/15 text-[13px] text-[#d4d4d8]"
                    >
                      {section}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[14px] font-semibold">{t.features[1].title}</p>
                <p className="mt-1 text-[13.5px] text-[#a1a1aa] leading-relaxed max-w-[380px]">{t.features[1].body}</p>
              </div>

              {/* Photos mock */}
              <div>
                <p className="m-0 mb-2 text-[13px] font-mono text-[#d8ff3e]">03</p>
                <div className="relative w-24 h-24 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth={1.5} className="w-8 h-8">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="9" cy="11" r="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-4.5-4.5a2 2 0 00-2.8 0L7 17" />
                  </svg>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#d8ff3e] text-[#08080a] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                    </svg>
                  </span>
                </div>
                <p className="mt-4 text-[14px] font-semibold">{t.features[2].title}</p>
                <p className="mt-1 text-[13.5px] text-[#a1a1aa] leading-relaxed max-w-[380px]">{t.features[2].body}</p>
              </div>

              {/* Drag-to-reorder mock */}
              <div>
                <p className="m-0 mb-2 text-[13px] font-mono text-[#d8ff3e]">04</p>
                <div className="flex flex-col gap-2 max-w-[220px]">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 ${
                        i === 0 ? 'opacity-40' : 'outline outline-1 outline-[#d8ff3e]/60 outline-offset-2'
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="#71717a">
                        <circle cx="5" cy="3" r="1.4" />
                        <circle cx="11" cy="3" r="1.4" />
                        <circle cx="5" cy="8" r="1.4" />
                        <circle cx="11" cy="8" r="1.4" />
                        <circle cx="5" cy="13" r="1.4" />
                        <circle cx="11" cy="13" r="1.4" />
                      </svg>
                      <span className="h-2 flex-1 rounded-full bg-white/10" />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[14px] font-semibold">{t.features[3].title}</p>
                <p className="mt-1 text-[13.5px] text-[#a1a1aa] leading-relaxed max-w-[380px]">{t.features[3].body}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
