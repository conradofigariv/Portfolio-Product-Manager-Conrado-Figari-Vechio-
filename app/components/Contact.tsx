'use client'

import { useLang } from '../context/LanguageContext'
import EditableText from './EditableText'
import { AddButton, RemoveButton } from './EditControls'

export default function Contact() {
  const { t, content, editing, updateActive } = useLang()
  const c = content.contact
  // Defensive: content can be an older document saved before these fields
  // existed. The loader normalizes this too, but nothing here should crash
  // if it is ever fed content that bypassed that step.
  const socials = c.socials ?? []
  const email = c.email ?? ''
  const hasSocials = editing || email || socials.length > 0

  return (
    <section id="contact" className="section-padding">
      <div className="container-main">
        <h2 className="heading-md mb-4">
          <EditableText path="contact.title" placeholder="Title" />
        </h2>
        <p className="text-dark-400 text-base md:text-lg mb-8 md:mb-16 max-w-2xl">
          <EditableText path="contact.subtitle" placeholder="Subtitle" />
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            {hasSocials && (
              <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8">
                <h3 className="font-semibold text-dark-50 mb-6">{t.contact.otherWays}</h3>
                <div className="space-y-5">
                  {(email || editing) && (
                    <div>
                      <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">Email</p>
                      {editing ? (
                        <p className="text-dark-50 font-medium">
                          <EditableText path="contact.email" placeholder="you@email.com" />
                        </p>
                      ) : (
                        <a
                          href={`mailto:${email}`}
                          className="text-dark-50 hover:text-dark-100 transition font-medium break-all"
                        >
                          {email}
                        </a>
                      )}
                    </div>
                  )}

                  {socials.map((social, i) => (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {editing ? (
                          <>
                            <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">Label</p>
                            <p className="text-dark-50 font-medium mb-2">
                              <EditableText path={`contact.socials.${i}.label`} placeholder="linkedin.com/in/you" />
                            </p>
                            <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">URL</p>
                            <p className="text-dark-300 text-sm break-all">
                              <EditableText path={`contact.socials.${i}.url`} placeholder="https://..." />
                            </p>
                          </>
                        ) : (
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-dark-50 hover:text-dark-100 transition font-medium flex items-center gap-1 break-all"
                          >
                            {social.label} ↗
                          </a>
                        )}
                      </div>
                      {editing && (
                        <RemoveButton
                          label="Remove link"
                          onClick={() =>
                            updateActive((cc) => ({
                              ...cc,
                              contact: {
                                ...cc.contact,
                                socials: (cc.contact.socials ?? []).filter((_, j) => j !== i),
                              },
                            }))
                          }
                        />
                      )}
                    </div>
                  ))}

                  {editing && (
                    <AddButton
                      label="Add link"
                      onClick={() =>
                        updateActive((cc) => ({
                          ...cc,
                          contact: {
                            ...cc.contact,
                            socials: [...(cc.contact.socials ?? []), { label: '', url: '' }],
                          },
                        }))
                      }
                    />
                  )}
                </div>
              </div>
            )}

            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8">
              <h3 className="font-semibold text-dark-50 mb-4">{t.contact.availability}</h3>
              <p className="text-dark-400 text-sm mb-4">{t.contact.availableFor}</p>
              <ul className="space-y-2">
                {c.availableItems.map((_, i) => (
                  <li key={i} className="flex items-start gap-3 text-dark-300 text-sm">
                    <span className="text-dark-50 mt-0.5">✓</span>
                    <span className="flex-1">
                      <EditableText path={`contact.availableItems.${i}`} placeholder="Item" />
                    </span>
                    {editing && (
                      <RemoveButton
                        label="Remove item"
                        onClick={() =>
                          updateActive((cc) => ({
                            ...cc,
                            contact: {
                              ...cc.contact,
                              availableItems: cc.contact.availableItems.filter((_, j) => j !== i),
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
                    label="Add item"
                    onClick={() =>
                      updateActive((cc) => ({
                        ...cc,
                        contact: { ...cc.contact, availableItems: [...cc.contact.availableItems, ''] },
                      }))
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
