'use client'

import { useState, useEffect } from 'react'
import Avatar from './Avatar'

interface Project {
  id: number
  year: string
  title: string
  description: string
  narrative: string[]
  metrics: { label: string; value: string }[]
  tags: string[]
  pose: 'thinking' | 'presenting' | 'analyzing'
}

export default function ProjectTimeline() {
  const [isInView, setIsInView] = useState(false)

  const projects: Project[] = [
    {
      id: 1,
      year: '2023',
      title: 'Plataforma de Pagos Digital',
      description: 'Transformación digital de pagos',
      narrative: [
        'Identificamos que el flujo de checkout tenía fricción innecesaria.',
        'Hicimos research con 100+ usuarios para entender sus pain points.',
        'Rediseñamos la experiencia, reduciendo pasos de 8 a 3.',
        'El resultado: +45% conversión y usuarios 3x más felices.',
      ],
      metrics: [
        { label: 'Conversión', value: '+45%' },
        { label: 'Usuarios', value: '500K+' },
        { label: 'Tiempo mejora', value: '-2.5s' },
      ],
      tags: ['Fintech', 'UX Design', 'Estrategia'],
      pose: 'analyzing',
    },
    {
      id: 2,
      year: '2022',
      title: 'App Móvil de Delivery',
      description: 'Producto desde cero',
      narrative: [
        'Soñábamos con revolucionar el delivery en LATAM.',
        'Validamos la idea con 200 entrevistas en Buenos Aires y CDMX.',
        'Construimos MVP en 3 meses con equipo cross-funcional.',
        'Launch exitoso: 100K descargas en 6 meses, 4.8⭐ rating.',
      ],
      metrics: [
        { label: 'Descargas', value: '100K' },
        { label: 'Rating', value: '4.8⭐' },
        { label: 'Usuarios activos', value: '50K/mes' },
      ],
      tags: ['Mobile', 'Startups', 'Growth'],
      pose: 'presenting',
    },
    {
      id: 3,
      year: '2021',
      title: 'Sistema de Recomendaciones ML',
      description: 'Personalización con IA',
      narrative: [
        'Los usuarios no encontraban productos relevantes.',
        'Implementamos algoritmos de ML para personalizar cada experiencia.',
        'La clave fue balancear novedad con relevancia.',
        'Resultado: +60% engagement y 92% accuracy en recomendaciones.',
      ],
      metrics: [
        { label: 'Engagement', value: '+60%' },
        { label: 'Relevancia', value: '92%' },
        { label: 'Implementación', value: '3 meses' },
      ],
      tags: ['Machine Learning', 'Data', 'Personalización'],
      pose: 'thinking',
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    )

    const element = document.getElementById('project-timeline')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="section-padding bg-gradient-to-b from-dark-900 to-dark-800/50">
      <div className="container-main">
        <div className="mb-16">
          <h2 className="heading-md mb-4">Mis Proyectos</h2>
          <p className="text-dark-400 text-lg max-w-2xl">
            Casos de estudio donde lideré la estrategia, la ejecución y obtuvimos resultados reales.
          </p>
        </div>

        <div id="project-timeline" className="space-y-24">
          {projects.map((project, idx) => (
            <div key={project.id} className="relative">
              {/* Timeline line */}
              {idx < projects.length - 1 && (
                <div className="absolute left-1/2 top-96 w-0.5 h-32 bg-gradient-to-b from-dark-500 to-transparent transform -translate-x-1/2" />
              )}

              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Avatar & Visual */}
                <div
                  className={`relative h-96 ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  } transition-all duration-700`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl border border-dark-600 p-8 flex items-center justify-center">
                    <Avatar pose={project.pose} className="w-48 h-64" />
                  </div>

                  {/* Year badge */}
                  <div className="absolute -top-6 -left-6 bg-dark-50 text-dark-900 px-4 py-2 rounded-full font-bold text-sm">
                    {project.year}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  } transition-all duration-700 delay-100`}
                >
                  <h3 className="heading-md mb-6 text-dark-50">{project.title}</h3>

                  {/* Narrative */}
                  <div className="space-y-4 mb-8">
                    {project.narrative.map((line, i) => (
                      <p
                        key={i}
                        className="text-dark-300 leading-relaxed flex items-start gap-3"
                      >
                        <span className="text-dark-50 font-bold mt-1 text-sm">→</span>
                        <span>{line}</span>
                      </p>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-dark-800/50 rounded-xl border border-dark-700">
                    {project.metrics.map((metric, idx) => (
                      <div key={idx}>
                        <p className="text-dark-400 text-xs mb-2 uppercase tracking-wider">
                          {metric.label}
                        </p>
                        <p className="text-2xl font-bold text-dark-50">{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-dark-700 text-dark-300 text-sm rounded-full hover:bg-dark-600 transition"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="group text-dark-50 hover:text-dark-100 transition font-semibold flex items-center gap-2">
                    Leer caso de estudio completo
                    <span className="group-hover:translate-x-1 transition">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 pt-16 border-t border-dark-700">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="heading-sm mb-4">Quiero conocer más proyectos</h3>
            <p className="text-dark-400 mb-8">
              Estos son algunos de mis trabajos más impactantes. Tengo muchas más historias sobre cómo
              hemos transformado productos y escalado negocios.
            </p>
            <a href="#contact" className="button-primary inline-block">
              Hablemos de tu proyecto
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
