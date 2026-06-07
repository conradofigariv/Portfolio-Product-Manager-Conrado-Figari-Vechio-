export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center section-padding">
      <div className="container-main w-full">
        <div className="max-w-3xl">
          <p className="text-dark-400 text-lg mb-4">Hola, soy</p>
          <h1 className="heading-lg mb-6 bg-gradient-to-r from-dark-50 to-dark-200 bg-clip-text text-transparent">
            Conrado Figari
          </h1>
          <p className="text-2xl md:text-3xl text-dark-200 mb-8">
            Product Manager apasionado por crear productos que resuelven problemas reales.
          </p>
          <p className="text-lg text-dark-400 max-w-2xl mb-12 leading-relaxed">
            Especializado en estrategia digital, diseño de experiencias de usuario y liderazgo de equipos cross-funcionales.
            Transformo ideas en productos de impacto que generan valor real para los usuarios.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="button-primary">
              Ver mis proyectos
            </a>
            <a href="#contact" className="button-secondary">
              Contactarme
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
