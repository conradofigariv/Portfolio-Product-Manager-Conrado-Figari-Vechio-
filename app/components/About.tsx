'use client'

import { useLang } from '../context/LanguageContext'

export default function About() {
  const { t, lang } = useLang()
  const a = t.about

  return (
    <section id="about" className="bg-dark-800/40 section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-12">{a.title}</h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-lg text-dark-300 mb-5 leading-relaxed">{a.bio1}</p>
            <p className="text-lg text-dark-300 mb-5 leading-relaxed">{a.bio2}</p>
            <p className="text-lg text-dark-300 mb-5 leading-relaxed">
              {a.bio3}{' '}
              <span className="text-dark-50 font-semibold">{a.currentRole}</span>{' '}
              {a.currentRoleAs}
            </p>

            <div className="mt-8 pt-8 border-t border-dark-700">
              <h3 className="text-lg font-semibold mb-4 text-dark-50">{a.experience}</h3>
              <ul className="space-y-3 text-dark-300">
                {a.jobs.map((job) => (
                  <li key={job.period} className="flex items-start gap-3">
                    <span className="text-dark-50 mt-1">•</span>
                    <span>
                      <span className="text-dark-100 font-medium">{job.role}</span>{' '}
                      {lang === 'en' ? 'at' : 'en'}{' '}
                      {job.company} — {job.period}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-dark-900/50 rounded-xl p-8 border border-dark-700">
            <h3 className="text-lg font-semibold mb-6 text-dark-50">{a.education}</h3>
            <div className="space-y-6 mb-8">
              {a.degrees.map((d) => (
                <div key={d.title}>
                  <h4 className="text-dark-50 font-semibold mb-1">{d.title}</h4>
                  <p className="text-dark-400 text-sm">{d.institution} · {d.years}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-dark-700">
              <h3 className="text-lg font-semibold mb-3 text-dark-50">{a.location}</h3>
              <p className="text-dark-300">{a.city}</p>
              <p className="text-dark-400 text-sm mt-1">{a.remote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
