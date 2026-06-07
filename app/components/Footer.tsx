'use client'

import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer
  const n = t.nav

  return (
    <footer className="bg-dark-800/40 border-t border-dark-700">
      <div className="container-main py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-dark-50 font-bold mb-3">Conrado Figari</h3>
            <p className="text-dark-400 text-sm leading-relaxed">{f.tagline}</p>
          </div>
          <div>
            <h4 className="text-dark-50 font-semibold mb-4 text-sm">{f.quickLinks}</h4>
            <ul className="space-y-2 text-sm text-dark-400">
              {[
                { label: n.about, href: '#about' },
                { label: n.projects, href: '#projects' },
                { label: n.skills, href: '#skills' },
                { label: n.contact, href: '#contact' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-dark-50 transition">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-dark-50 font-semibold mb-4 text-sm">{f.social}</h4>
            <ul className="space-y-2 text-sm text-dark-400">
              {[
                { label: 'LinkedIn', href: 'https://linkedin.com/in/conradofigari' },
                { label: 'Twitter / X', href: 'https://twitter.com/conradofigari' },
                { label: 'GitHub', href: 'https://github.com/conradofigari' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-dark-50 transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-700 pt-8 flex flex-col md:flex-row justify-between items-center text-dark-400 text-xs gap-4">
          <p>{f.rights}</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-dark-50 transition">{f.privacy}</a>
            <a href="/terms" className="hover:text-dark-50 transition">{f.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
