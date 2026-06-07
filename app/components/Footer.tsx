import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark-800/50 border-t border-dark-700">
      <div className="container-main py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-dark-50 font-bold mb-4">Conrado Figari</h3>
            <p className="text-dark-400 text-sm">
              Product Manager apasionado por crear productos que impactan.
            </p>
          </div>

          <div>
            <h4 className="text-dark-50 font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2 text-sm text-dark-400">
              <li>
                <a href="#about" className="hover:text-dark-50 transition">
                  Sobre mí
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-dark-50 transition">
                  Proyectos
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-dark-50 transition">
                  Habilidades
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-dark-50 transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-dark-50 font-semibold mb-4">Redes sociales</h4>
            <ul className="space-y-2 text-sm text-dark-400">
              <li>
                <a
                  href="https://linkedin.com/in/conradofigari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-dark-50 transition"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/conradofigari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-dark-50 transition"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/conradofigari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-dark-50 transition"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8 flex flex-col md:flex-row justify-between items-center text-dark-400 text-sm">
          <p>&copy; 2024 Conrado Figari. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-dark-50 transition">
              Privacidad
            </a>
            <a href="/terms" className="hover:text-dark-50 transition">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
