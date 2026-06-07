'use client'

import { useEffect, useState } from 'react'
import Avatar from './Avatar'

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center section-padding bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800/50">
      <div className="container-main w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <p className="text-dark-400 text-lg mb-4 font-mono">Hola, me llamo</p>
            <h1 className="heading-lg mb-6 bg-gradient-to-r from-dark-50 to-dark-300 bg-clip-text text-transparent">
              Conrado Figari
            </h1>
            <p className="text-2xl md:text-3xl text-dark-200 mb-8 leading-tight">
              Creo <span className="text-dark-50 font-semibold">productos</span> que resuelven problemas reales.
            </p>
            <p className="text-lg text-dark-400 max-w-xl mb-12 leading-relaxed">
              Producto Manager especializado en estrategia digital, experiencia de usuario y liderazgo de equipos.
              Transformo ideas en productos de impacto.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="button-primary">
                Ver mis proyectos
              </a>
              <a href="#contact" className="button-secondary">
                Contactarme
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-12 pt-8 border-t border-dark-700 grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-bold text-dark-50">5+</p>
                <p className="text-dark-400 text-sm">Años en PM</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-dark-50">500K+</p>
                <p className="text-dark-400 text-sm">Usuarios impactados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-dark-50">100%</p>
                <p className="text-dark-400 text-sm">Productos lanzados</p>
              </div>
            </div>
          </div>

          {/* Right: Avatar */}
          <div
            className={`relative h-96 hidden md:flex items-center justify-center transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            {/* Gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark-700/50 to-dark-800/50 rounded-3xl blur-3xl" />

            {/* Avatar container */}
            <div className="relative z-10 w-64 h-80 bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl border border-dark-600 p-8 flex items-center justify-center hover:border-dark-500 transition">
              <Avatar pose="presenting" className="w-full h-full" />
            </div>

            {/* Floating element */}
            <div className="absolute -bottom-4 -right-4 bg-dark-50 text-dark-900 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
              Hola 👋
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
