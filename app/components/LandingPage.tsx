'use client'

import { useState } from 'react'
import Image from 'next/image'
import GoogleSignInButton from './GoogleSignInButton'
import { FlagES, FlagUS } from './FlagIcon'

// Real screenshots of the real editor (public/como/*.webp) — see CLAUDE.md.
// `points` are the numbered badges overlaid on each one, as percentages of
// that image's own box. They line up with the same-numbered captions below the
// figure, and their order matches each language's `howShots[i].items` order.
//
// Each point sits *beside* the thing it labels, never on top of it: a badge
// covering the very control it points at (the EN/ES pill, a drag handle, a
// metric) makes the figure less readable, not more. Coordinates were read off
// these exact images at their native pixel size, so they must be re-derived if
// the screenshots are ever re-taken.
const SHOTS = [
  {
    src: '/como/hero.webp',
    width: 1349,
    height: 599,
    points: [
      { x: 28.2, y: 38.4 }, // the name field — just past the end of "Vechio"
      { x: 62.3, y: 25 }, // the portrait — its top-left corner, off his face
      { x: 63.9, y: 4.7 }, // the EN/ES toggle — in the empty nav space left of it
      { x: 57.2, y: 93.5 }, // the autosave bar — just right of the pill
    ],
  },
  {
    src: '/como/story.webp',
    width: 1349,
    height: 598,
    points: [
      { x: 18.2, y: 21.2 }, // a chapter's period tag — in the margin beside it
      { x: 65.9, y: 17.6 }, // its drag handle — directly above the grip
      { x: 71.5, y: 23.4 }, // the chapter photo — its top-left corner
    ],
  },
  {
    src: '/como/projects.webp',
    width: 1350,
    height: 599,
    points: [
      { x: 21.1, y: 55.1 }, // the project gallery — in the margin left of it
      { x: 57, y: 56.1 }, // "+ Add line" — just right of the button
      { x: 78.9, y: 66.8 }, // the metrics row — just right of the last metric
    ],
  },
] as const

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
    howTitle: 'Así se edita, en vivo',
    howSubtitle:
      'Estas son capturas reales del editor. Todo lo que ves acá se toca con un click, sobre el diseño final: no hay panel de administración ni formularios que llenar.',
    howShots: [
      {
        title: 'Tu portada',
        body: 'Lo primero que ve quien te busca.',
        alt: 'Portada del portfolio en modo edición: nombre, título, foto y estadísticas',
        items: [
          {
            title: 'Escribís sobre el diseño',
            body: 'Click en tu nombre, tu título o cualquier texto, y escribís encima. Podés cambiar tipografía, tamaño y color.',
          },
          {
            title: 'Tu foto, bien encuadrada',
            body: 'La subís y elegís qué parte se ve. Se recorta sola en cada pantalla.',
          },
          {
            title: 'Español e inglés',
            body: 'Cargás cada texto en los dos idiomas y quien te visita elige con un click.',
          },
          {
            title: 'Se guarda solo',
            body: 'Cada cambio queda guardado mientras escribís. No existe el “perdí todo”.',
          },
        ],
      },
      {
        title: 'Tu historia',
        body: 'De dónde venís, contado por vos.',
        alt: 'Sección de historia en modo edición: capítulos con período, título, relato y foto',
        items: [
          {
            title: 'Capítulo por capítulo',
            body: 'Cada etapa con su período, su título y su relato. Sumás los que quieras.',
          },
          {
            title: 'Arrastrá para ordenar',
            body: 'Cambiás el orden tirando del asa. Sin menús ni configuración.',
          },
          {
            title: 'Una foto por capítulo',
            body: 'Le ponés cara a cada momento de tu carrera.',
          },
        ],
      },
      {
        title: 'Tus proyectos',
        body: 'Con fotos, resultados y las herramientas que usaste.',
        alt: 'Sección de proyectos en modo edición: galería, puntos clave, métricas y tags',
        items: [
          {
            title: 'Galería por proyecto',
            body: 'Varias fotos por proyecto, en el orden que vos elijas.',
          },
          {
            title: 'Los puntos clave',
            body: 'Agregás, editás y reordenás las líneas que cuentan qué hiciste.',
          },
          {
            title: 'Métricas y tecnologías',
            body: 'Tres números que resumen el impacto, más los tags de lo que usaste.',
          },
        ],
      },
    ],
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
    howNav: 'How it works',
    howTitle: 'This is the editor, live',
    howSubtitle:
      'These are real screenshots of the editor. Everything you see here is one click away, right on the finished design — no admin panel, no forms to fill in.',
    howShots: [
      {
        title: 'Your cover',
        body: 'The first thing anyone looking you up will see.',
        alt: 'Portfolio cover in editing mode: name, headline, photo and stats',
        items: [
          {
            title: 'Type on the design itself',
            body: 'Click your name, your headline or any text and type over it. Change the font, size and color too.',
          },
          {
            title: 'Your photo, framed right',
            body: 'Upload it and pick which part shows. It crops itself on every screen size.',
          },
          {
            title: 'English and Spanish',
            body: 'Write each text in both languages and let visitors switch with one click.',
          },
          {
            title: 'It saves itself',
            body: 'Every change is saved as you type. There is no "I lost it all".',
          },
        ],
      },
      {
        title: 'Your story',
        body: 'Where you come from, told by you.',
        alt: 'Story section in editing mode: chapters with period, title, text and photo',
        items: [
          {
            title: 'Chapter by chapter',
            body: 'Each stage with its period, title and story. Add as many as you want.',
          },
          {
            title: 'Drag to reorder',
            body: 'Change the order by pulling the handle. No menus, no settings.',
          },
          {
            title: 'A photo per chapter',
            body: 'Put a face to every moment of your career.',
          },
        ],
      },
      {
        title: 'Your projects',
        body: 'With photos, results, and the tools you used.',
        alt: 'Projects section in editing mode: gallery, key points, metrics and tags',
        items: [
          {
            title: 'A gallery per project',
            body: 'Several photos per project, in whatever order you choose.',
          },
          {
            title: 'The key points',
            body: 'Add, edit and reorder the lines that tell what you actually did.',
          },
          {
            title: 'Metrics and tech',
            body: 'Three numbers that sum up the impact, plus tags for what you used.',
          },
        ],
      },
    ],
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

          <div className="mt-12 sm:mt-16 space-y-16 sm:space-y-24">
            {t.howShots.map((shot, shotIndex) => {
              const meta = SHOTS[shotIndex]
              // Numbering runs across all three figures (1..10) rather than
              // restarting per figure, so a badge on an image and its caption
              // below are never ambiguous about which one they pair with.
              const firstNumber = t.howShots.slice(0, shotIndex).reduce((n, s) => n + s.items.length, 0) + 1

              return (
                <div key={shot.title}>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-5">
                    <h3 className="m-0 text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em]">{shot.title}</h3>
                    <p className="m-0 text-[15px] text-[#a1a1aa]">{shot.body}</p>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c0f]">
                    <Image
                      src={meta.src}
                      alt={shot.alt}
                      width={meta.width}
                      height={meta.height}
                      quality={90}
                      className="block w-full h-auto"
                    />
                    {meta.points.map((point, i) => (
                      <span
                        key={i}
                        aria-hidden="true"
                        className="absolute flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8ff3e] text-[#08080a] text-[11px] sm:text-[12px] font-bold ring-4 ring-[#d8ff3e]/25 shadow-lg"
                        style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      >
                        {firstNumber + i}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-x-8 gap-y-6">
                    {shot.items.map((item, i) => (
                      <div key={item.title} className="flex gap-3 flex-1 min-w-[220px] max-w-[340px]">
                        <span className="mt-0.5 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-[#d8ff3e]/40 text-[#d8ff3e] text-[11px] font-bold">
                          {firstNumber + i}
                        </span>
                        <div>
                          <p className="m-0 text-[14.5px] font-semibold">{item.title}</p>
                          <p className="m-0 mt-1 text-[13.5px] text-[#a1a1aa] leading-relaxed">{item.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* The whole section exists to end here — the walkthrough is the
              argument, this is the ask. */}
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
