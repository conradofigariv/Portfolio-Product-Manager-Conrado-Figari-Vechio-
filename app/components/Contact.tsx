'use client'

import { useLang } from '../context/LanguageContext'

export default function Contact() {
  const { t, content } = useLang()
  const c = content.contact

  return (
    <section id="contact" className="section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-4">{c.title}</h2>
        <p className="text-dark-400 text-base md:text-lg mb-8 md:mb-16 max-w-2xl">{c.subtitle}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8">
              <h3 className="font-semibold text-dark-50 mb-6">{t.contact.otherWays}</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">Email</p>
                  <a
                    href="mailto:conradofigari.v@gmail.com"
                    className="text-dark-50 hover:text-dark-100 transition font-medium break-all"
                  >
                    conradofigari.v@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">LinkedIn</p>
                  <a
                    href="https://www.linkedin.com/in/conradofigarivechio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-50 hover:text-dark-100 transition font-medium flex items-center gap-1"
                  >
                    linkedin.com/in/conradofigarivechio ↗
                  </a>
                </div>
                <div>
                  <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">GitHub</p>
                  <a
                    href="https://github.com/conradofigariv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-50 hover:text-dark-100 transition font-medium flex items-center gap-1"
                  >
                    github.com/conradofigariv ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8">
              <h3 className="font-semibold text-dark-50 mb-4">{t.contact.availability}</h3>
              <p className="text-dark-400 text-sm mb-4">{t.contact.availableFor}</p>
              <ul className="space-y-2">
                {c.availableItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-dark-300 text-sm">
                    <span className="text-dark-50 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
