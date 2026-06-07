export default function Projects() {
  const projects = [
    {
      id: 1,
      title: 'Plataforma de Pagos Digital',
      description: 'Lideré el rediseño completo de la plataforma de pagos, aumentando la conversión en un 45% y reduciendo el tiempo de transacción.',
      metrics: [
        { label: 'Conversión', value: '+45%' },
        { label: 'Usuarios', value: '500K+' },
        { label: 'Tiempo mejora', value: '-2.5s' },
      ],
      tags: ['Fintech', 'UX Design', 'Estrategia'],
      year: '2023',
    },
    {
      id: 2,
      title: 'App Móvil de Delivery',
      description: 'Producto desde cero que alcanzó 100K descargas en 6 meses. Implementé features basadas en user research y data-driven decisions.',
      metrics: [
        { label: 'Descargas', value: '100K' },
        { label: 'Rating', value: '4.8⭐' },
        { label: 'Usuarios activos', value: '50K/mes' },
      ],
      tags: ['Mobile', 'Startups', 'Growth'],
      year: '2022',
    },
    {
      id: 3,
      title: 'Sistema de Recomendaciones ML',
      description: 'Implementación de algoritmos de recomendación que personalizan la experiencia de cada usuario. Aumentó el engagement en 60%.',
      metrics: [
        { label: 'Engagement', value: '+60%' },
        { label: 'Relevancia', value: '92%' },
        { label: 'Implementación', value: '3 meses' },
      ],
      tags: ['Machine Learning', 'Data', 'Personalización'],
      year: '2021',
    },
    {
      id: 4,
      title: 'Marketplace B2B',
      description: 'Creé la estrategia y ejecuté el lanzamiento de un marketplace que conecta proveedores con compradores empresariales.',
      metrics: [
        { label: 'Proveedores', value: '1K+' },
        { label: 'GMV', value: '$5M/mes' },
        { label: 'Satisfacción', value: '4.7⭐' },
      ],
      tags: ['Marketplace', 'B2B', 'Scaling'],
      year: '2020',
    },
  ]

  return (
    <section id="projects" className="section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-4">Mis Proyectos</h2>
        <p className="text-dark-400 text-lg mb-12 max-w-2xl">
          Casos de estudio de productos que he liderado desde la concepción hasta el éxito en el mercado.
        </p>

        <div className="grid gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-dark-800/50 border border-dark-700 rounded-xl p-8 hover:border-dark-500 transition"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <span className="text-dark-400 text-sm font-mono">{project.year}</span>
                  <h3 className="heading-sm mt-2 mb-3 group-hover:text-dark-100 transition">
                    {project.title}
                  </h3>
                </div>
              </div>

              <p className="text-dark-300 mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-6 py-6 border-t border-b border-dark-700">
                {project.metrics.map((metric, idx) => (
                  <div key={idx}>
                    <p className="text-dark-400 text-sm mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-dark-50">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-dark-700 text-dark-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="mt-6 text-dark-50 hover:text-dark-100 transition font-semibold flex items-center gap-2">
                Leer caso de estudio
                <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
