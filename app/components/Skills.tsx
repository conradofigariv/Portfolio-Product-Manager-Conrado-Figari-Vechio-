'use client'

import { useLang } from '../context/LanguageContext'

export default function Skills() {
  const { t, content } = useLang()
  const s = content.skills

  return (
    <section id="skills" className="bg-dark-800/40 section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-4">{s.title}</h2>
        <p className="text-dark-400 text-base md:text-lg mb-8 md:mb-16 max-w-2xl">{s.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {s.categories.map((cat) => (
            <div
              key={cat.category}
              className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 md:p-6 hover:border-dark-500 transition"
            >
              <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-dark-50">{cat.category}</h3>
              <ul className="space-y-2">
                {cat.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-3 text-dark-300 text-xs md:text-sm">
                    <span className="w-1 h-1 bg-dark-400 rounded-full flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-8 md:mt-16 pt-8 md:pt-16 border-t border-dark-700">
          <h3 className="text-lg md:text-xl font-semibold mb-6 md:mb-8 text-dark-50">{t.skills.certifications}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {s.certs.map((cert) => (
              <div
                key={cert.title}
                className="flex items-start gap-3 md:gap-4 bg-dark-900/50 p-4 md:p-6 rounded-xl border border-dark-700 hover:border-dark-500 transition"
              >
                <span className="text-lg md:text-xl flex-shrink-0">📜</span>
                <div>
                  <h4 className="font-semibold text-dark-50 mb-1 text-xs md:text-sm leading-snug">{cert.title}</h4>
                  <p className="text-dark-400 text-xs">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
