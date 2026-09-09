'use client'

import { useLang } from '../context/LanguageContext'
import { usePairedBlockList } from '../lib/editor/usePairedBlockList'
import RichText from './editor/EditableText'
import SkillCategoryCard from './SkillCategoryCard'
import { AddButton, RemoveButton } from './EditControls'

const CERT_FIELDS = ['title', 'issuer'] as const

function newSkillCategoryId() {
  return `skillcat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export default function Skills() {
  const { t, content, editing, updateActive } = useLang()
  const s = content.skills
  const {
    items: certs,
    add: addCert,
    remove: removeCert,
    busy: certsBusy,
    error: certsError,
  } = usePairedBlockList({ prefix: 'skills.certs', fields: CERT_FIELDS, section: 'skills' })

  return (
    <section id="skills" className="bg-dark-800/40 section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-4">
          <RichText blockKey="skills.title" section="skills" placeholder="Section title" />
        </h2>
        <div className="text-dark-400 text-base md:text-lg mb-6 md:mb-8 max-w-2xl">
          <RichText blockKey="skills.subtitle" section="skills" placeholder="Subtitle" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {s.categories.map((cat) => (
            <SkillCategoryCard
              key={cat.id}
              category={cat}
              onRemove={() =>
                updateActive((c) => ({
                  ...c,
                  skills: {
                    ...c.skills,
                    categories: c.skills.categories.filter((cc) => cc.id !== cat.id),
                  },
                }))
              }
            />
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
                      categories: [...c.skills.categories, { id: newSkillCategoryId(), category: '', skills: [] }],
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
            {certs.map((cert) => (
              <div
                key={cert.itemId}
                className="flex items-start gap-3 md:gap-4 bg-dark-900/50 p-4 md:p-6 rounded-xl border border-dark-700 hover:border-dark-500 transition"
              >
                <span className="text-lg md:text-xl flex-shrink-0">📜</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-dark-50 mb-1 text-xs md:text-sm leading-snug">
                    <RichText blockKey={cert.blockKeys.title} section="skills" placeholder="Certification" />
                  </h4>
                  <div className="text-dark-400 text-xs">
                    <RichText blockKey={cert.blockKeys.issuer} section="skills" placeholder="Issuer" />
                  </div>
                </div>
                {editing && (
                  <RemoveButton
                    label="Remove certification"
                    disabled={certsBusy}
                    onClick={() => removeCert(cert.itemId)}
                  />
                )}
              </div>
            ))}
          </div>
          {editing && (
            <div className="mt-4">
              <AddButton label="Add certification" disabled={certsBusy} onClick={addCert} />
            </div>
          )}
          {certsError && <p className="text-xs text-red-400 mt-2">{certsError}</p>}
        </div>
      </div>
    </section>
  )
}
