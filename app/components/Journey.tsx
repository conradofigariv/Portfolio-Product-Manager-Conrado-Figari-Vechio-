'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import RichText from './editor/EditableText'
import EditableChapterPhoto from './EditableChapterPhoto'
import { AddButton, RemoveButton } from './EditControls'

function newChapterId() {
  return `chapter-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export default function Journey() {
  const { content, media, editing, updateBoth } = useLang()
  const chapters = content.journey.chapters
  const [visible, setVisible] = useState<Set<number>>(new Set())
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    refs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible((v) => new Set([...v, i]))
        },
        { threshold: 0.25 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [chapters.length])

  function addChapter() {
    const id = newChapterId()
    updateBoth((c) => ({
      ...c,
      journey: {
        ...c.journey,
        chapters: [...c.journey.chapters, { id, tag: '', heading: 'New chapter', body: '' }],
      },
    }))
  }

  function removeChapter(id: string) {
    updateBoth((c) => ({
      ...c,
      journey: { ...c.journey, chapters: c.journey.chapters.filter((ch) => ch.id !== id) },
    }))
  }

  return (
    // Overrides section-padding's bottom side only (utilities layer beats
    // components layer regardless of class order): Projects right below it
    // already has its own full top padding, so both together were doubling
    // up into a much bigger gap than either section alone intended.
    <section id="about" className="section-padding pb-4 md:pb-6 lg:pb-8">
      <div className="container-main">
        <h2 className="heading-md mb-6 md:mb-8">
          <RichText blockKey="journey.title" section="journey" placeholder="Section title" />
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-dark-600 via-dark-700 to-transparent hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {chapters.map((chapter, i) => {
              const isVisible = visible.has(i)
              const isLast = i === chapters.length - 1
              // Editing shows the photo slot for every chapter, including an
              // "Add photo" placeholder, not only the ones that already have one.
              const showPhotoColumn = editing || !!media.chapterPhotos[chapter.id]

              return (
                <div
                  key={chapter.id}
                  ref={(el) => { refs.current[i] = el }}
                  className={`relative md:pl-12 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-0 top-1 w-px hidden md:block">
                    <div
                      className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 -translate-x-[5px] ${
                        isVisible ? 'bg-dark-50 border-dark-50' : 'bg-dark-700 border-dark-600'
                      } ${isLast ? 'bg-dark-400 border-dark-400' : ''}`}
                    />
                  </div>

                  {/* A flat two-column layout (text | photo), not a spanning
                      grid area: with the photo's height stretched to match
                      the text column (items-stretch below), a spanning grid
                      area would inflate whichever text row falls short,
                      opening a gap between the heading and the body that has
                      nothing to do with either one's own margin. */}
                  <div className={`grid grid-cols-1 items-stretch ${showPhotoColumn ? 'md:grid-cols-[1fr_auto] md:gap-8' : ''}`}>
                    <div>
                      {/* Tag + Heading */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-sm md:text-base font-mono text-dark-50 uppercase tracking-widest">
                            <RichText blockKey={`journey.chapters.${chapter.id}.tag`} section="journey" placeholder="Tag" />
                          </span>

                          <h3
                            className={`mt-2 mb-0 md:mb-3 font-bold leading-tight ${
                              isLast ? 'text-2xl text-dark-300 italic' : 'text-2xl md:text-3xl text-dark-50'
                            }`}
                          >
                            <RichText
                              blockKey={`journey.chapters.${chapter.id}.heading`}
                              section="journey"
                              placeholder="Heading"
                            />
                          </h3>
                        </div>

                        {editing && (
                          <RemoveButton onClick={() => removeChapter(chapter.id)} label="Remove chapter" />
                        )}
                      </div>

                      {/* Body */}
                      <p className="text-dark-300 leading-relaxed text-base md:text-lg max-w-2xl">
                        <RichText blockKey={`journey.chapters.${chapter.id}.body`} section="journey" placeholder="Body" />
                      </p>
                    </div>

                    {/* Photo */}
                    {showPhotoColumn && (
                      <div className="mt-4 md:mt-0">
                        <EditableChapterPhoto chapterId={chapter.id} heading={chapter.heading} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {editing && (
            <div className="mt-8 md:pl-12">
              <AddButton onClick={addChapter} label="Add chapter" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
