'use client'

import { useLang } from '../context/LanguageContext'

export default function Skills() {
  const { t } = useLang()
  const s = t.skills

  return (
    <section id="skills" className="bg-dark-800/40 section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-4">{s.title}</h2>
        <p className="text-dark-400 text-lg mb-16 max-w-2xl">{s.subtitle}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {s.categories.map((cat) => (
            <div
              key={cat.category}
              className="bg-dark-900/50 border border-dark-700 rounded-xl p-6 hover:border-dark-500 transition"
            >
              <h3 className="text-base font-semibold mb-4 text-dark-50">{cat.category}</h3>
              <ul className="space-y-2">
                {cat.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-3 text-dark-300 text-sm">
                    <span className="w-1 h-1 bg-dark-400 rounded-full" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-16 pt-16 border-t border-dark-700">
          <h3 className="text-xl font-semibold mb-8 text-dark-50">{s.certifications}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {s.certs.map((cert) => (
              <div
                key={cert.title}
                className="flex items-start gap-4 bg-dark-900/50 p-6 rounded-xl border border-dark-700 hover:border-dark-500 transition"
              >
                <span className="text-xl">📜</span>
                <div>
                  <h4 className="font-semibold text-dark-50 mb-1 text-sm leading-snug">{cert.title}</h4>
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
