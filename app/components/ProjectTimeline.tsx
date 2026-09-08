'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useLang } from '../context/LanguageContext'
import EditableText from './EditableText'
import RichText from './editor/EditableText'
import EditableProjectGallery from './EditableProjectGallery'
import ProjectNarrative from './ProjectNarrative'
import ProjectTags from './ProjectTags'
import { AddButton, RemoveButton } from './EditControls'

// Alternating sides; index into this by position, not by project identity.
const poses: Array<'left' | 'right'> = ['right', 'left']

function newProjectId() {
  return `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export default function ProjectTimeline() {
  const { t, content, media, editing, updateBoth } = useLang()
  const p = content.projects
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [openProject, setOpenProject] = useState<number | null>(null)
  const [managingProject, setManagingProject] = useState<number | null>(null)
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

  const galleryLength = gallery.length
  const closeGallery = useCallback(() => setOpenProject(null), [])
  const prevPhoto = useCallback(
    () => setPhotoIdx((i) => (i - 1 + galleryLength) % galleryLength),
    [galleryLength]
  )
  const nextPhoto = useCallback(
    () => setPhotoIdx((i) => (i + 1) % galleryLength),
    [galleryLength]
  )

  useEffect(() => {
    if (openProject === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGallery()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openProject, closeGallery, prevPhoto, nextPhoto])

  function addProject() {
    const id = newProjectId()
    updateBoth((c) => ({
      ...c,
      projects: {
        ...c.projects,
        items: [
          ...c.projects.items,
          {
            id,
            year: new Date().getFullYear().toString(),
            tag: '',
            title: 'New project',
            narrative: ['What the problem was.'],
            metrics: [
              { label: 'Metric', value: '—' },
              { label: 'Metric', value: '—' },
              { label: 'Metric', value: '—' },
            ],
            tags: [],
          },
        ],
      },
    }))
  }

  function removeProject(id: string) {
    updateBoth((c) => ({
      ...c,
      projects: { ...c.projects, items: c.projects.items.filter((item) => item.id !== id) },
    }))
  }

  return (
    <section id="projects" ref={sectionRef} className="section-padding bg-gradient-to-b from-dark-900 to-dark-800/30">
      <div className="container-main">
        <div className="mb-6 md:mb-8">
          <h2 className="heading-md mb-4">
            <RichText blockKey="projects.title" section="projects" placeholder="Section title" />
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl">
            <RichText blockKey="projects.subtitle" section="projects" placeholder="Subtitle" />
          </p>
        </div>

        <div className="space-y-16 md:space-y-32">
          {p.items.map((project, idx) => {
            const isRight = poses[idx % poses.length] === 'right'
            const isVisible = visibleItems.has(idx)
            const projectGallery = media.projectImages[project.id] ?? []
            const photo = projectGallery[0]
            const hasGallery = projectGallery.length > 0

            return (
              <div
                key={project.id}
                id={`project-item-${idx}`}
                className="relative"
              >
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-stretch ${isRight ? '' : 'md:[&>*:first-child]:order-2'}`}>

                  {/* Visual side */}
                  <div
                    role={hasGallery || editing ? 'button' : undefined}
                    tabIndex={hasGallery || editing ? 0 : undefined}
                    onClick={() => {
                      if (editing) {
                        setManagingProject(idx)
                        return
                      }
                      if (!hasGallery) return
                      setPhotoIdx(0)
                      setOpenProject(idx)
                    }}
                    onKeyDown={(e) => {
                      if (!hasGallery && !editing) return
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        if (editing) setManagingProject(idx)
                        else {
                          setPhotoIdx(0)
                          setOpenProject(idx)
                        }
                      }
                    }}
                    className={`group relative h-64 md:h-full md:min-h-[22rem] rounded-2xl overflow-hidden border border-dark-700 transition-all duration-700 ${
                      hasGallery || editing ? 'cursor-pointer' : ''
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
                          quality={90}
                          unoptimized={photo?.src.startsWith('blob:')}
                          style={photo ? { objectPosition: photo.position || 'left center' } : undefined}
                          className={`transition-transform duration-500 ${hasGallery ? 'group-hover:scale-105' : ''} ${
                            photo ? 'object-cover opacity-90' : 'object-cover object-top opacity-20 scale-110'
                          }`}
                        />
                      )}
                    </div>

                    {/* Gradient for text legibility over photo */}
                    {photo && <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />}

                    {/* Gallery affordance badge */}
                    {(hasGallery || editing) && (
                      <div className="absolute top-4 md:top-8 right-4 md:right-8 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-900/70 backdrop-blur border border-dark-600 text-dark-100 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 16l5-5 4 4 5-6 4 5M3 5h18v14H3V5z"
                          />
                        </svg>
                        {editing
                          ? `Edit photos${projectGallery.length ? ` · ${projectGallery.length}` : ''}`
                          : projectGallery.length > 1
                          ? `${t.projects.gallery.viewGallery} · ${projectGallery.length}`
                          : t.projects.gallery.viewPhoto}
                      </div>
                    )}

                    {/* Year + title overlay. Sits inside the whole card's own
                        onClick (opens the photo manager while editing) —
                        without stopping propagation here, clicking into
                        the title to edit it immediately re-triggers that
                        same click and the photo modal steals it back. Only
                        while editing: a visitor's click here should still
                        open the lightbox/gallery as before. */}
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-4 md:p-8"
                      onClick={(e) => {
                        if (editing) e.stopPropagation()
                      }}
                    >
                      <span className="text-dark-400 text-xs font-mono tracking-widest uppercase mb-1 md:mb-2">
                        <EditableText path={`projects.items.${idx}.year`} placeholder="Year" />
                      </span>
                      <h3 className="text-xl md:text-3xl font-bold text-dark-50 leading-tight">
                        <RichText blockKey={`projects.items.${project.id}.title`} section="projects" placeholder="Title" />
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
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-sm md:text-base font-mono text-dark-50 uppercase tracking-widest">
                        <EditableText path={`projects.items.${idx}.tag`} placeholder="Category" />
                      </span>
                      {editing && (
                        <RemoveButton onClick={() => removeProject(project.id)} label="Remove project" />
                      )}
                    </div>

                    {/* Narrative */}
                    <ProjectNarrative projectId={project.id} />

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-5 md:mb-7 py-4 md:py-5 border-y border-dark-700">
                      {project.metrics.map((_, i) => (
                        <div key={i} className="text-center">
                          <p className="text-dark-400 text-xs uppercase tracking-wider mb-1 md:mb-2">
                            <EditableText path={`projects.items.${idx}.metrics.${i}.label`} placeholder="Metric" />
                          </p>
                          <p className="text-lg md:text-2xl font-bold text-dark-50">
                            <EditableText path={`projects.items.${idx}.metrics.${i}.value`} placeholder="Value" />
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <ProjectTags projectId={project.id} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {editing && (
          <div className="mt-8 max-w-md mx-auto">
            <AddButton label="Add project" onClick={addProject} />
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-32 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">
            <RichText blockKey="projects.ctaTitle" section="projects" placeholder="CTA title" />
          </h3>
          <p className="text-dark-400 mb-8">
            <RichText blockKey="projects.ctaDescription" section="projects" placeholder="CTA description" />
          </p>
        </div>
      </div>

      {managingProject !== null &&
        createPortal(
          <EditableProjectGallery
            projectId={p.items[managingProject].id}
            title={p.items[managingProject].title}
            photos={media.projectImages[p.items[managingProject].id] ?? []}
            onClose={() => setManagingProject(null)}
          />,
          document.body
        )}

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
                  quality={90}
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
