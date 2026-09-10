'use client'

import { useEffect, useRef, useState } from 'react'
import { LanguageProvider, useLang } from '../context/LanguageContext'
import { useBlockList } from '../lib/editor/useBlockList'
import { demoPortfolio, DEMO_PROJECT_ID } from '../lib/demo-portfolio'
import type { Lang } from '../lib/portfolio'
import RichText from './editor/EditableText'
import { AddButton, DragHandle, RemoveButton } from './EditControls'

// The landing page's try-it-out skeleton: a trimmed copy of the portfolio
// layout (the cover, plus one project card) that a visitor can actually edit
// before signing up for anything.
//
// The *fields* are the real thing — the same RichText/Tiptap component, the
// same floating toolbar, the same add/remove/drag controls, the same
// useBlockList — so what a visitor tries here behaves exactly like the editor
// they get after signing in. Only the surrounding layout is a trimmed copy
// rather than Hero/ProjectTimeline themselves, which would drag in the
// portrait, the background video and the photo gallery/lightbox: all of them
// upload-backed, and there is no signed-in user here to upload as.
//
// Nothing persists. See demo-portfolio.ts and LanguageProvider's `demo` flag.

const LABELS = {
  es: {
    addLine: 'Agregar línea',
    addTag: 'Agregar tag',
    removeLine: 'Quitar línea',
    removeTag: 'Quitar tag',
    line: 'Línea',
    tag: 'Tag',
  },
  en: {
    addLine: 'Add line',
    addTag: 'Add tag',
    removeLine: 'Remove line',
    removeTag: 'Remove tag',
    line: 'Line',
    tag: 'Tag',
  },
} as const

/** A reorderable block list with its own drag state — narrative lines and tags
 *  differ only in how each row is laid out, so the shared behaviour lives here. */
function useDragList(prefix: string) {
  const list = useBlockList({ prefix, section: 'projects' })
  const [dragKey, setDragKey] = useState<string | null>(null)
  const [overKey, setOverKey] = useState<string | null>(null)

  function drop(targetKey: string) {
    setOverKey(null)
    if (!dragKey || dragKey === targetKey) {
      setDragKey(null)
      return
    }
    list.reorder(dragKey, targetKey)
    setDragKey(null)
  }

  const rowClass = (blockKey: string) =>
    `${dragKey === blockKey ? 'opacity-40' : ''} ${
      overKey === blockKey && dragKey !== null && dragKey !== blockKey
        ? 'outline outline-2 outline-offset-4 outline-dark-50/60'
        : ''
    }`

  const dragProps = (blockKey: string) => ({
    onDragOver: (e: React.DragEvent) => {
      if (!dragKey) return
      e.preventDefault()
      setOverKey(blockKey)
    },
    onDrop: () => drop(blockKey),
  })

  const handleProps = (blockKey: string) => ({
    onDragStart: () => setDragKey(blockKey),
    onDragEnd: () => {
      setDragKey(null)
      setOverKey(null)
    },
  })

  return { ...list, rowClass, dragProps, handleProps }
}

function DemoStageInner({ lang }: { lang: Lang }) {
  const { content, editing } = useLang()
  const l = LABELS[lang]
  const project = `projects.items.${DEMO_PROJECT_ID}`
  const narrative = useDragList(`${project}.narrative`)
  const tags = useDragList(`${project}.tags`)

  return (
    // demo-stage: shows every field's edit outline at rest rather than only on
    // hover, so the demo doesn't read as a static screenshot. See globals.css.
    <div className="demo-stage bg-dark-900 divide-y divide-dark-700">
      {/* Cover */}
      <div className="px-5 py-8 sm:px-8 sm:py-12">
        <div className="text-dark-400 font-mono tracking-widest uppercase text-xs mb-2">
          <RichText blockKey="hero.greeting" section="hero" placeholder="Greeting" />
        </div>
        <h3 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight text-dark-50">
          <RichText blockKey="hero.name" section="hero" placeholder="Your name" />
        </h3>
        <div className="text-lg sm:text-2xl text-dark-200 mb-4 leading-tight font-light">
          <RichText blockKey="hero.tagline" section="hero" placeholder="Headline" />
        </div>
        <div className="text-sm text-dark-400 max-w-xl mb-5 leading-relaxed">
          <RichText blockKey="hero.description" section="hero" placeholder="Description" />
        </div>

        <div className="pt-4 border-t border-dark-700 grid grid-cols-3 gap-3 sm:gap-6">
          {content.stats.map((_, i) => (
            <div key={i} className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-dark-50">
                <RichText blockKey={`stats.${i}.value`} section="hero" placeholder="Value" />
              </div>
              <div className="text-dark-400 text-xs mt-1">
                <RichText blockKey={`stats.${i}.label`} section="hero" placeholder="Label" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* One project */}
      <div className="px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex items-baseline gap-3 mb-1">
          <div className="text-dark-500 font-mono text-xs">
            <RichText blockKey={`${project}.year`} section="projects" placeholder="Year" />
          </div>
          {/* flex-1 min-w-0: without real width a direct flex-row item shrink-wraps
              to its own text, and the toolbar's alignment buttons then do nothing. */}
          <div className="flex-1 min-w-0 text-dark-50 font-mono tracking-widest uppercase text-xs">
            <RichText blockKey={`${project}.tag`} section="projects" placeholder="Category" />
          </div>
        </div>

        <h4 className="text-xl sm:text-3xl font-bold text-dark-50 mb-5 tracking-tight">
          <RichText blockKey={`${project}.title`} section="projects" placeholder="Project title" />
        </h4>

        <div className="space-y-2 mb-6">
          {narrative.items.map((item, i) => (
            <div
              key={item.blockKey}
              className={`text-dark-300 text-sm leading-relaxed flex items-start gap-2 rounded-lg transition-all ${narrative.rowClass(
                item.blockKey
              )}`}
              {...narrative.dragProps(item.blockKey)}
            >
              {editing && <DragHandle {...narrative.handleProps(item.blockKey)} />}
              <span className="text-dark-500 font-light mt-0.5 text-xs select-none flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 min-w-0">
                <RichText blockKey={item.blockKey} section="projects" placeholder={l.line} />
              </span>
              {editing && (
                <RemoveButton label={l.removeLine} onClick={() => narrative.remove(item.blockKey)} />
              )}
            </div>
          ))}
          {editing && <AddButton label={l.addLine} onClick={narrative.add} />}
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 py-5 border-y border-dark-700 mb-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="text-center">
              <div className="text-dark-500 font-mono tracking-widest uppercase text-[10px] mb-1">
                <RichText
                  blockKey={`${project}.metrics.${i}.label`}
                  section="projects"
                  placeholder="Label"
                />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-dark-50">
                <RichText
                  blockKey={`${project}.metrics.${i}.value`}
                  section="projects"
                  placeholder="Value"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tags.items.map((item) => (
            <span
              key={item.blockKey}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-600 text-dark-300 text-xs transition-all ${tags.rowClass(
                item.blockKey
              )}`}
              {...tags.dragProps(item.blockKey)}
            >
              {editing && <DragHandle {...tags.handleProps(item.blockKey)} />}
              <span className="min-w-0">
                <RichText blockKey={item.blockKey} section="projects" placeholder={l.tag} />
              </span>
              {editing && (
                <RemoveButton label={l.removeTag} onClick={() => tags.remove(item.blockKey)} />
              )}
            </span>
          ))}
          {editing && <AddButton label={l.addTag} onClick={tags.add} />}
        </div>
      </div>
    </div>
  )
}

export default function DemoStage({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  // Mounting straight into editing mode resolves RichEditableField's dynamic
  // import immediately, which put Tiptap — 426KB, a third of the landing's
  // total JS — into the initial load of a marketing page most visitors never
  // interact with. Waiting for the section to approach the viewport means
  // someone who bounces at the hero never downloads the editor at all.
  //
  // rootMargin fires this well before the demo is actually on screen, so the
  // static-to-editable swap happens out of sight and nobody watches the
  // controls pop in. Until then the seed renders as ordinary HTML through
  // EditableText's non-editing path, which also means it server-renders.
  //
  // The import has to resolve *before* `live` flips, not after: EditableText
  // reaches RichEditableField through next/dynamic with ssr:false and no
  // loading state, so flipping first leaves every field rendering nothing
  // until the chunk lands — a blank card, which is exactly what a visitor
  // scrolling quickly would catch. Awaiting the same module the dynamic
  // import will ask for means it's already in memory by the time it does.
  useEffect(() => {
    if (live || !ref.current) return
    let cancelled = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        import('./editor/RichEditableField').then(() => {
          if (!cancelled) setLive(true)
        })
      },
      // 300px, deliberately: the demo card sits only ~420px below the fold on
      // a laptop viewport, so a larger margin intersects on load and the
      // bounce visitor pays for the editor after all — which is the whole
      // thing this is avoiding. Small enough not to fire at rest, big enough
      // that the ~300ms of empty Tiptap containers (useEditor runs with
      // immediatelyRender: false, so EditorContent is blank until the editor
      // instance initialises) elapses before the card is actually on screen.
      { rootMargin: '300px' }
    )
    observer.observe(ref.current)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [live])

  return (
    <div ref={ref}>
      {/* key={lang}: the seed content is per-language and the provider holds
          the demo's edits in its own state, so switching the landing's
          language remounts with the other language's seed. That does discard
          whatever was typed — acceptable for a throwaway demo, and the
          alternative (syncing the prop into existing state from an effect) is
          the setState-in-effect pattern this project's lint rules reject. */}
      <LanguageProvider
        key={lang}
        portfolio={demoPortfolio(lang)}
        editing={live}
        demo
        initialLang={lang}
      >
        <DemoStageInner lang={lang} />
      </LanguageProvider>
    </div>
  )
}
