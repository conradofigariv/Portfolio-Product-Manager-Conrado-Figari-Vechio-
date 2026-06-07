'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '../context/LanguageContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { t, lang, toggleLang } = useLang()

  const navLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.contact, href: '#contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur border-b border-dark-700">
      <div className="container-main flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold hover:text-dark-100 transition tracking-tight">
          CF
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-dark-300 hover:text-dark-50 transition text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: Lang toggle + CV */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-600 text-dark-300 hover:text-dark-50 hover:border-dark-400 transition text-sm font-mono"
            aria-label="Toggle language"
          >
            <span className={lang === 'en' ? 'text-dark-50 font-bold' : ''}>EN</span>
            <span className="text-dark-600">/</span>
            <span className={lang === 'es' ? 'text-dark-50 font-bold' : ''}>ES</span>
          </button>

          <a href="/cv-conrado-figari.pdf" className="button-secondary text-sm py-2">
            {t.nav.downloadCV}
          </a>
        </div>

        {/* Mobile: lang toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-dark-300 hover:text-dark-50 transition text-sm font-mono"
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <button
            className="text-dark-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
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
            <a href="/cv-conrado-figari.pdf" className="button-secondary inline-block text-center text-sm">
              {t.nav.downloadCV}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
