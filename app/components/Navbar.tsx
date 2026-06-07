'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'Sobre mí', href: '#about' },
    { label: 'Proyectos', href: '#projects' },
    { label: 'Habilidades', href: '#skills' },
    { label: 'Contacto', href: '#contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur border-b border-dark-700">
      <div className="container-main flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold hover:text-dark-100 transition">
          CF
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-dark-300 hover:text-dark-50 transition"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Download CV Button */}
        <div className="hidden md:block">
          <a
            href="/cv-conrado-figari.pdf"
            className="button-secondary"
          >
            Descargar CV
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-dark-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700">
          <div className="container-main py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-dark-300 hover:text-dark-50 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/cv-conrado-figari.pdf"
              className="button-secondary inline-block text-center"
            >
              Descargar CV
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
