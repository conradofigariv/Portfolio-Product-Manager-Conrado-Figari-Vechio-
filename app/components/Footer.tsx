'use client'

import { useLang } from '../context/LanguageContext'
import EditableText from './EditableText'

export default function Footer() {
  const { t, content } = useLang()
  const n = t.nav
  // Defensive: same reasoning as Contact.tsx — an older stored document may
  // predate this field.
  const socials = content.contact.socials ?? []

  return (
    <footer className="bg-dark-800/40 border-t border-dark-700">
      <div className="container-main py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-dark-50 font-bold mb-3">{content.hero.name}</h3>
            <p className="text-dark-400 text-sm leading-relaxed">
              <EditableText path="footer.tagline" placeholder="Closing line" />
            </p>
          </div>
          <div>
            <h4 className="text-dark-50 font-semibold mb-4 text-sm">{t.footer.quickLinks}</h4>
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
          {socials.length > 0 && (
            <div>
              <h4 className="text-dark-50 font-semibold mb-4 text-sm">{t.footer.social}</h4>
              <ul className="space-y-2 text-sm text-dark-400">
                {socials.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-dark-50 transition"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="border-t border-dark-700 pt-8 flex flex-col md:flex-row justify-between items-center text-dark-400 text-xs gap-4">
          <p>
            <EditableText path="footer.rights" placeholder="© Your name" />
          </p>
        </div>
      </div>
    </footer>
  )
}
