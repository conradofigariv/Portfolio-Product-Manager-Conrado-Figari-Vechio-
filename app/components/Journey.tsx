'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLang } from '../context/LanguageContext'

const CHAPTER_PHOTOS: Record<number, { src: string; alt: string; position: string; positionMobile?: string }> = {
  0: { src: '/aveit-raffle.png', alt: 'AVEIT raffle tickets', position: 'center center' },
  1: { src: '/aveit-hr-team.jpeg', alt: 'AVEIT HR team', position: 'center center' },
  2: { src: '/tiktok-plugstore.png', alt: 'Plug Store TikTok account with 4,500 followers', position: 'left center', positionMobile: 'center top' },
  3: { src: '/reading-book-park.jpeg', alt: 'Conrado reading in the park', position: 'center center', positionMobile: 'center 90%' },
  4: { src: '/EPEC.jpg', alt: 'EPEC building', position: 'right center' },
}

export default function Journey() {
  const { t } = useLang()
  const chapters = t.journey.chapters
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

  return (
    <section id="about" className="section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-12 md:mb-20">{t.journey.title}</h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-dark-600 via-dark-700 to-transparent hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {chapters.map((chapter, i) => {
              const isVisible = visible.has(i)
              const photo = CHAPTER_PHOTOS[i]
              const isLast = i === chapters.length - 1

              return (
                <div
                  key={i}
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

                  <div className={`journey-chapter-grid ${photo ? 'journey-chapter-grid--with-photo' : 'journey-chapter-grid--no-photo'}`}>
                    {/* Tag + Heading */}
                    <div style={{ gridArea: 'header' }}>
                      <span className="text-xs font-mono text-dark-500 uppercase tracking-widest">
                        {chapter.tag}
                      </span>

                      <h3
                        className={`mt-2 mb-0 md:mb-5 font-bold leading-tight ${
                          isLast ? 'text-2xl text-dark-300 italic' : 'text-2xl md:text-3xl text-dark-50'
                        }`}
                      >
                        {chapter.heading}
                      </h3>
                    </div>

                    {/* Photo (selected chapters) */}
                    {photo && (
                      <div style={{ gridArea: 'photo' }}>
                        <div className="w-full h-44 md:w-48 md:h-52 rounded-xl overflow-hidden border border-dark-700 relative flex-shrink-0">
                          {/* Mobile position */}
                          <div className="md:hidden absolute inset-0">
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              className="object-cover"
                              style={{ objectPosition: photo.positionMobile || photo.position }}
                            />
                          </div>
                          {/* Desktop position */}
                          <div className="hidden md:block absolute inset-0">
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              className="object-cover"
                              style={{ objectPosition: photo.position }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Body */}
                    <div style={{ gridArea: 'body' }}>
                      <p className="text-dark-300 leading-relaxed text-base md:text-lg max-w-2xl">
                        {chapter.body}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
