'use client'

import { useLang } from '../context/LanguageContext'
import EditableText from './EditableText'
import { AddButton, RemoveButton } from './EditControls'

export default function Skills() {
  const { t, content, editing, updateActive } = useLang()
  const s = content.skills

  return (
    <section id="skills" className="bg-dark-800/40 section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-4">
          <EditableText path="skills.title" placeholder="Section title" />
        </h2>
        <p className="text-dark-400 text-base md:text-lg mb-8 md:mb-16 max-w-2xl">
          <EditableText path="skills.subtitle" placeholder="Subtitle" />
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {s.categories.map((cat, ci) => (
            <div
              key={ci}
              className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 md:p-6 hover:border-dark-500 transition"
            >
              <div className="flex items-start justify-between gap-2 mb-3 md:mb-4">
                <h3 className="text-sm md:text-base font-semibold text-dark-50">
                  <EditableText path={`skills.categories.${ci}.category`} placeholder="Category" />
                </h3>
                {editing && (
                  <RemoveButton
                    label="Remove category"
                    onClick={() =>
                      updateActive((c) => ({
                        ...c,
                        skills: {
                          ...c.skills,
                          categories: c.skills.categories.filter((_, j) => j !== ci),
                        },
                      }))
                    }
                  />
                )}
              </div>
              <ul className="space-y-2">
                {cat.skills.map((_, si) => (
                  <li key={si} className="flex items-center gap-3 text-dark-300 text-xs md:text-sm">
                    <span className="w-1 h-1 bg-dark-400 rounded-full flex-shrink-0" />
                    <span className="flex-1">
                      <EditableText path={`skills.categories.${ci}.skills.${si}`} placeholder="Skill" />
                    </span>
                    {editing && (
                      <RemoveButton
                        label="Remove skill"
                        onClick={() =>
                          updateActive((c) => ({
                            ...c,
                            skills: {
                              ...c.skills,
                              categories: c.skills.categories.map((cc, j) =>
                                j === ci ? { ...cc, skills: cc.skills.filter((_, k) => k !== si) } : cc
                              ),
                            },
                          }))
                        }
                      />
                    )}
                  </li>
                ))}
              </ul>
              {editing && (
                <div className="mt-3">
                  <AddButton
                    label="Add skill"
                    onClick={() =>
                      updateActive((c) => ({
                        ...c,
                        skills: {
                          ...c.skills,
                          categories: c.skills.categories.map((cc, j) =>
                            j === ci ? { ...cc, skills: [...cc.skills, 'Skill'] } : cc
                          ),
                        },
                      }))
                    }
                  />
                </div>
              )}
            </div>
          ))}

          {editing && (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-dark-700 p-4 md:p-6">
              <AddButton
                label="Add category"
                onClick={() =>
                  updateActive((c) => ({
                    ...c,
                    skills: {
                      ...c.skills,
                      categories: [...c.skills.categories, { category: 'Category', skills: [] }],
                    },
                  }))
                }
              />
            </div>
          )}
        </div>

        {/* Certifications */}
        <div className="mt-8 md:mt-16 pt-8 md:pt-16 border-t border-dark-700">
          <h3 className="text-lg md:text-xl font-semibold mb-6 md:mb-8 text-dark-50">{t.skills.certifications}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {s.certs.map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 md:gap-4 bg-dark-900/50 p-4 md:p-6 rounded-xl border border-dark-700 hover:border-dark-500 transition"
              >
                <span className="text-lg md:text-xl flex-shrink-0">📜</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-dark-50 mb-1 text-xs md:text-sm leading-snug">
                    <EditableText path={`skills.certs.${i}.title`} placeholder="Certification" />
                  </h4>
                  <p className="text-dark-400 text-xs">
                    <EditableText path={`skills.certs.${i}.issuer`} placeholder="Issuer" />
                  </p>
                </div>
                {editing && (
                  <RemoveButton
                    label="Remove certification"
                    onClick={() =>
                      updateActive((c) => ({
                        ...c,
                        skills: { ...c.skills, certs: c.skills.certs.filter((_, j) => j !== i) },
                      }))
                    }
                  />
                )}
              </div>
            ))}
          </div>
          {editing && (
            <div className="mt-4">
              <AddButton
                label="Add certification"
                onClick={() =>
                  updateActive((c) => ({
                    ...c,
                    skills: { ...c.skills, certs: [...c.skills.certs, { title: 'Certification', issuer: '' }] },
                  }))
                }
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
