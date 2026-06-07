'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useLang } from '../context/LanguageContext'

const poses: Array<'left' | 'right'> = ['right', 'left', 'right']

export default function ProjectTimeline() {
  const { t } = useLang()
  const p = t.projects
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())

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

  return (
    <section id="projects" ref={sectionRef} className="section-padding bg-gradient-to-b from-dark-900 to-dark-800/30">
      <div className="container-main">
        <div className="mb-20">
          <h2 className="heading-md mb-4">{p.title}</h2>
          <p className="text-dark-400 text-lg max-w-2xl">{p.subtitle}</p>
        </div>

        <div className="space-y-32">
          {p.items.map((project, idx) => {
            const isRight = poses[idx] === 'right'
            const isVisible = visibleItems.has(idx)

            return (
              <div
                key={idx}
                id={`project-item-${idx}`}
                className="relative"
              >
                <div className={`grid md:grid-cols-2 gap-16 items-center ${isRight ? '' : 'md:[&>*:first-child]:order-2'}`}>

                  {/* Visual side */}
                  <div
                    className={`relative h-80 rounded-2xl overflow-hidden border border-dark-700 transition-all duration-700 ${
                      isVisible
                        ? 'opacity-100 translate-x-0'
                        : isRight
                        ? 'opacity-0 -translate-x-12'
                        : 'opacity-0 translate-x-12'
                    }`}
                  >
                    {/* Project visual - photo as background (blurred/darkened) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-800">
                      <Image
                        src="/conrado.jpg"
                        alt={project.title}
                        fill
                        className="object-cover object-top opacity-20 scale-110"
                      />
                    </div>

                    {/* Year + title overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <span className="text-dark-400 text-xs font-mono tracking-widest uppercase mb-2">
                        {project.year}
                      </span>
                      <h3 className="text-2xl font-bold text-dark-50 leading-tight">
                        {project.title}
                      </h3>
                    </div>

                    {/* Decorative line */}
                    <div className="absolute top-8 left-8 w-8 h-0.5 bg-dark-50/40" />
                  </div>

                  {/* Content side */}
                  <div
                    className={`transition-all duration-700 delay-150 ${
                      isVisible
                        ? 'opacity-100 translate-x-0'
                        : isRight
                        ? 'opacity-0 translate-x-12'
                        : 'opacity-0 -translate-x-12'
                    }`}
                  >
                    {/* Narrative */}
                    <div className="space-y-4 mb-8">
                      {project.narrative.map((line, i) => (
                        <p key={i} className="text-dark-300 leading-relaxed flex items-start gap-3">
                          <span className="text-dark-500 font-light mt-1 text-sm select-none">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{line}</span>
                        </p>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-dark-700">
                      {project.metrics.map((metric, i) => (
                        <div key={i}>
                          <p className="text-dark-400 text-xs uppercase tracking-wider mb-2">{metric.label}</p>
                          <p className="text-2xl font-bold text-dark-50">{metric.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-dark-700/60 text-dark-300 text-xs rounded-full border border-dark-600">
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
          <h3 className="text-2xl font-bold mb-4">{p.cta.title}</h3>
          <p className="text-dark-400 mb-8">{p.cta.description}</p>
          <a href="#contact" className="button-primary inline-block">
            {p.cta.button}
          </a>
        </div>
      </div>
    </section>
  )
}
