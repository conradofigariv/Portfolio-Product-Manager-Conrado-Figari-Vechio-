'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useLang } from '../context/LanguageContext'

// Alternating sides; index into this by position, not by project identity.
const poses: Array<'left' | 'right'> = ['right', 'left']

export default function ProjectTimeline() {
  const { t, content, media } = useLang()
  const p = content.projects
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [openProject, setOpenProject] = useState<number | null>(null)
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    p.items.forEach((_, idx) => {
      const el = document.getElementById(`project-item-${idx}`)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, idx]))
          }
        },
        { threshold: 0.2 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [p.items])

  const gallery =
    openProject !== null ? media.projectImages[p.items[openProject].id] || [] : []

  const closeGallery = () => setOpenProject(null)
  const prevPhoto = () => setPhotoIdx((i) => (i - 1 + gallery.length) % gallery.length)
  const nextPhoto = () => setPhotoIdx((i) => (i + 1) % gallery.length)

  useEffect(() => {
    if (openProject === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGallery()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openProject, gallery.length])

  return (
    <section id="projects" ref={sectionRef} className="section-padding bg-gradient-to-b from-dark-900 to-dark-800/30">
      <div className="container-main">
        <div className="mb-20">
          <h2 className="heading-md mb-4">{p.title}</h2>
          <p className="text-dark-400 text-lg max-w-2xl">{p.subtitle}</p>
        </div>

        <div className="space-y-16 md:space-y-32">
          {p.items.map((project, idx) => {
            const isRight = poses[idx % poses.length] === 'right'
            const isVisible = visibleItems.has(idx)
            const projectGallery = media.projectImages[project.id]
            const photo = projectGallery?.[0]
            const hasGallery = !!projectGallery && projectGallery.length > 0

            return (
              <div
                key={project.id}
                id={`project-item-${idx}`}
                className="relative"
              >
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center ${isRight ? '' : 'md:[&>*:first-child]:order-2'}`}>

                  {/* Visual side */}
                  <div
                    role={hasGallery ? 'button' : undefined}
                    tabIndex={hasGallery ? 0 : undefined}
                    onClick={() => {
                      if (!hasGallery) return
                      setPhotoIdx(0)
                      setOpenProject(idx)
                    }}
                    onKeyDown={(e) => {
                      if (!hasGallery) return
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setPhotoIdx(0)
                        setOpenProject(idx)
                      }
                    }}
                    className={`group relative h-64 md:h-[22rem] rounded-2xl overflow-hidden border border-dark-700 transition-all duration-700 ${
                      hasGallery ? 'cursor-pointer' : ''
                    } ${
                      isVisible
                        ? 'opacity-100 translate-x-0 translate-y-0'
                        : isRight
                        ? 'md:opacity-0 md:-translate-x-12 opacity-0 -translate-y-8'
                        : 'md:opacity-0 md:translate-x-12 opacity-0 -translate-y-8'
                    }`}
                  >
                    {/* Project visual - photo, or the portrait faded back when a project has none */}
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-800">
                      {(photo || media.portrait) && (
                        <Image
                          src={photo ? photo.src : media.portrait!.src}
                          alt={photo ? photo.alt : project.title}
                          fill
                          className={`transition-transform duration-500 ${hasGallery ? 'group-hover:scale-105' : ''} ${
                            photo
                              ? `object-cover ${photo.position || 'object-left'} opacity-90`
                              : 'object-cover object-top opacity-20 scale-110'
                          }`}
                        />
                      )}
                    </div>

                    {/* Gradient for text legibility over photo */}
                    {photo && <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />}

                    {/* Gallery affordance badge */}
                    {hasGallery && (
                      <div className="absolute top-4 md:top-8 right-4 md:right-8 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-900/70 backdrop-blur border border-dark-600 text-dark-100 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 16l5-5 4 4 5-6 4 5M3 5h18v14H3V5z"
                          />
                        </svg>
                        {projectGallery.length > 1
                          ? `${t.projects.gallery.viewGallery} · ${projectGallery.length}`
                          : t.projects.gallery.viewPhoto}
                      </div>
                    )}

                    {/* Year + title overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8">
                      <span className="text-dark-400 text-xs font-mono tracking-widest uppercase mb-1 md:mb-2">
                        {project.year}
                      </span>
                      <h3 className="text-xl md:text-3xl font-bold text-dark-50 leading-tight">
                        {project.title}
                      </h3>
                    </div>

                    {/* Decorative line */}
                    <div className="absolute top-4 md:top-8 left-4 md:left-8 w-6 md:w-8 h-0.5 bg-dark-50/40" />
                  </div>

                  {/* Content side */}
                  <div
                    className={`transition-all duration-700 delay-150 ${
                      isVisible
                        ? 'opacity-100 translate-x-0 translate-y-0'
                        : isRight
                        ? 'md:opacity-0 md:translate-x-12 opacity-0 translate-y-8'
                        : 'md:opacity-0 md:-translate-x-12 opacity-0 translate-y-8'
                    }`}
                  >
                    {/* Narrative */}
                    <div className="space-y-2 md:space-y-3 mb-5 md:mb-7">
                      {project.narrative.map((line, i) => (
                        <p key={i} className="text-dark-300 text-sm md:text-base leading-relaxed flex items-start gap-2 md:gap-3">
                          <span className="text-dark-500 font-light mt-0.5 text-xs md:text-sm select-none flex-shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{line}</span>
                        </p>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-5 md:mb-7 py-4 md:py-5 border-y border-dark-700">
                      {project.metrics.map((metric, i) => (
                        <div key={i}>
                          <p className="text-dark-400 text-xs uppercase tracking-wider mb-1 md:mb-2">{metric.label}</p>
                          <p className="text-lg md:text-2xl font-bold text-dark-50">{metric.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 md:px-3 py-1 bg-dark-700/60 text-dark-300 text-xs rounded-full border border-dark-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">{p.ctaTitle}</h3>
          <p className="text-dark-400 mb-8">{p.ctaDescription}</p>
        </div>
      </div>

      {openProject !== null &&
        gallery.length > 0 &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={closeGallery}
          >
            <div
              className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-4xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700">
                <span className="text-dark-50 font-semibold text-sm">
                  {p.items[openProject].title}
                  {gallery.length > 1 && (
                    <span className="text-dark-400 font-normal ml-2">
                      {photoIdx + 1} / {gallery.length}
                    </span>
                  )}
                </span>
                <button
                  onClick={closeGallery}
                  aria-label={t.projects.gallery.close}
                  className="text-dark-300 hover:text-dark-50 transition p-1.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="relative h-[50vh] md:h-[65vh] bg-dark-900">
                <Image
                  key={gallery[photoIdx].src}
                  src={gallery[photoIdx].src}
                  alt={gallery[photoIdx].alt}
                  fill
                  className="object-contain"
                />

                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      aria-label={t.projects.gallery.previous}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-dark-900/70 border border-dark-600 text-dark-100 hover:bg-dark-900 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextPhoto}
                      aria-label={t.projects.gallery.next}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-dark-900/70 border border-dark-600 text-dark-100 hover:bg-dark-900 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="flex items-center gap-2 px-4 py-3 border-t border-dark-700 overflow-x-auto">
                  {gallery.map((g, i) => (
                    <button
                      key={g.src}
                      onClick={() => setPhotoIdx(i)}
                      className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition ${
                        i === photoIdx ? 'border-dark-50' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={g.src} alt={g.alt} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}
