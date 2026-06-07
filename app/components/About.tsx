export default function About() {
  return (
    <section id="about" className="bg-dark-800/50 section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-12">Sobre mí</h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-dark-300 mb-6 leading-relaxed">
              Soy un Product Manager con más de 5 años de experiencia creando productos digitales que impactan a millones de usuarios.
            </p>
            <p className="text-lg text-dark-300 mb-6 leading-relaxed">
              Mi enfoque combina research profundo de usuarios, análisis de datos y pensamiento estratégico para identificar oportunidades de impacto.
              He trabajado en startups ágiles y grandes organizaciones, siempre enfocado en resolver problemas reales.
            </p>
            <p className="text-lg text-dark-300 mb-6 leading-relaxed">
              Actualmente trabajo en <span className="text-dark-50 font-semibold">[Nombre Empresa Actual]</span> como Product Manager, liderando el desarrollo de features que mejoran la experiencia de nuestros usuarios.
            </p>

            <div className="mt-8 pt-8 border-t border-dark-700">
              <h3 className="heading-sm mb-4 text-dark-50">Experiencia</h3>
              <ul className="space-y-3 text-dark-300">
                <li className="flex items-start gap-3">
                  <span className="text-dark-50 font-bold">•</span>
                  <span>Product Manager en [Empresa] (2023 - Presente)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dark-50 font-bold">•</span>
                  <span>Senior Product Manager en [Empresa] (2021 - 2023)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dark-50 font-bold">•</span>
                  <span>Product Manager en [Startup] (2019 - 2021)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-dark-900/50 rounded-xl p-8 border border-dark-700">
            <h3 className="heading-sm mb-6 text-dark-50">Educación</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-dark-50 font-semibold mb-1">Carrera en Administración de Empresas</h4>
                <p className="text-dark-400 text-sm">Universidad Nacional (2015 - 2019)</p>
              </div>
              <div>
                <h4 className="text-dark-50 font-semibold mb-1">Product Management Certificate</h4>
                <p className="text-dark-400 text-sm">Product School (2020)</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-dark-700">
              <h3 className="heading-sm mb-4 text-dark-50">Ubicación</h3>
              <p className="text-dark-300">Buenos Aires, Argentina</p>
              <p className="text-dark-400 text-sm mt-2">Disponible para trabajo remoto</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
