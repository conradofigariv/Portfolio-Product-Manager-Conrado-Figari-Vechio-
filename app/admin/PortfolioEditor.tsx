'use client'

import { useState } from 'react'
import type { Lang, PortfolioContent } from '../lib/portfolio'
import { savePortfolio } from './actions'
import { AddButton, Field, LineList, RepeatableItem, Section, TextArea } from './fields'

type Content = Record<Lang, PortfolioContent>
type SaveState = { status: 'idle' | 'saving' | 'saved' | 'error'; message?: string }

function move<T>(items: T[], from: number, to: number): T[] {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export default function PortfolioEditor({
  username,
  initialContent,
  initialPublished,
}: {
  username: string | null
  initialContent: Content
  initialPublished: boolean
}) {
  const [content, setContent] = useState<Content>(initialContent)
  const [published, setPublished] = useState(initialPublished)
  const [lang, setLang] = useState<Lang>('en')
  const [dirty, setDirty] = useState(false)
  const [save, setSave] = useState<SaveState>({ status: 'idle' })

  const active = content[lang]

  // Text edits touch only the language being edited.
  function edit(patch: (c: PortfolioContent) => PortfolioContent) {
    setContent((prev) => ({ ...prev, [lang]: patch(prev[lang]) }))
    setDirty(true)
    setSave({ status: 'idle' })
  }

  // Structural edits touch both languages, so the two stay aligned — project
  // and chapter ids are what photos are attached to, so they must match.
  function editBoth(patch: (c: PortfolioContent, lang: Lang) => PortfolioContent) {
    setContent((prev) => ({ en: patch(prev.en, 'en'), es: patch(prev.es, 'es') }))
    setDirty(true)
    setSave({ status: 'idle' })
  }

  async function onSave() {
    setSave({ status: 'saving' })
    const result = await savePortfolio({ content, published })
    if (result.ok) {
      setDirty(false)
      setSave({ status: 'saved' })
    } else {
      setSave({ status: 'error', message: result.error })
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-dark-700">
        <div className="container-main py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="font-bold text-dark-50">Portfolio App</span>
            {username && (
              <a
                href={`/${username}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-dark-400 hover:text-dark-50 underline"
              >
                /{username}
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-dark-600 overflow-hidden text-sm">
              {(['en', 'es'] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-3 py-1.5 font-mono uppercase transition ${
                    lang === code ? 'bg-dark-50 text-dark-900' : 'text-dark-300 hover:text-dark-50'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm text-dark-300">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => {
                  setPublished(e.target.checked)
                  setDirty(true)
                  setSave({ status: 'idle' })
                }}
                className="accent-dark-50"
              />
              Published
            </label>

            <button
              type="button"
              onClick={onSave}
              disabled={save.status === 'saving' || !dirty}
              className="button-primary text-sm py-2 disabled:opacity-50"
            >
              {save.status === 'saving' ? 'Saving…' : dirty ? 'Save' : 'Saved'}
            </button>

            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm text-dark-400 hover:text-dark-50">
                Sign out
              </button>
            </form>
          </div>
        </div>

        {save.status === 'error' && (
          <p className="container-main pb-3 text-sm text-red-400">{save.message}</p>
        )}
        {save.status === 'saved' && (
          <p className="container-main pb-3 text-sm text-green-400">
            Saved{published ? '' : ' — still a draft, tick Published to make it public'}
          </p>
        )}
      </header>

      <div className="container-main py-8 space-y-6 max-w-3xl">
        <p className="text-sm text-dark-400">
          Editing the <strong className="text-dark-200">{lang === 'en' ? 'English' : 'Spanish'}</strong>{' '}
          version. Adding or removing projects and chapters applies to both languages.
        </p>

        <Section title="Intro" description="The first thing a visitor reads.">
          <Field
            label="Greeting"
            value={active.hero.greeting}
            onChange={(v) => edit((c) => ({ ...c, hero: { ...c.hero, greeting: v } }))}
          />
          <Field
            label="Name"
            value={active.hero.name}
            onChange={(v) => edit((c) => ({ ...c, hero: { ...c.hero, name: v } }))}
          />
          <Field
            label="Headline"
            value={active.hero.tagline}
            onChange={(v) => edit((c) => ({ ...c, hero: { ...c.hero, tagline: v } }))}
          />
          <TextArea
            label="Description"
            rows={3}
            value={active.hero.description}
            onChange={(v) => edit((c) => ({ ...c, hero: { ...c.hero, description: v } }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {active.stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <Field
                  label={`Stat ${i + 1}`}
                  value={stat.value}
                  onChange={(v) =>
                    edit((c) => ({
                      ...c,
                      stats: c.stats.map((s, j) => (i === j ? { ...s, value: v } : s)),
                    }))
                  }
                />
                <Field
                  label="Label"
                  value={stat.label}
                  onChange={(v) =>
                    edit((c) => ({
                      ...c,
                      stats: c.stats.map((s, j) => (i === j ? { ...s, label: v } : s)),
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Story" description="Your path, told in chapters.">
          <Field
            label="Section title"
            value={active.journey.title}
            onChange={(v) => edit((c) => ({ ...c, journey: { ...c.journey, title: v } }))}
          />

          {active.journey.chapters.map((chapter, i) => (
            <RepeatableItem
              key={chapter.id}
              title={`Chapter ${i + 1}`}
              onRemove={() =>
                editBoth((c) => ({
                  ...c,
                  journey: {
                    ...c.journey,
                    chapters: c.journey.chapters.filter((ch) => ch.id !== chapter.id),
                  },
                }))
              }
              onMoveUp={
                i > 0
                  ? () =>
                      editBoth((c) => ({
                        ...c,
                        journey: { ...c.journey, chapters: move(c.journey.chapters, i, i - 1) },
                      }))
                  : undefined
              }
              onMoveDown={
                i < active.journey.chapters.length - 1
                  ? () =>
                      editBoth((c) => ({
                        ...c,
                        journey: { ...c.journey, chapters: move(c.journey.chapters, i, i + 1) },
                      }))
                  : undefined
              }
            >
              <Field
                label="Tag"
                value={chapter.tag}
                onChange={(v) =>
                  edit((c) => ({
                    ...c,
                    journey: {
                      ...c.journey,
                      chapters: c.journey.chapters.map((ch) =>
                        ch.id === chapter.id ? { ...ch, tag: v } : ch
                      ),
                    },
                  }))
                }
              />
              <Field
                label="Heading"
                value={chapter.heading}
                onChange={(v) =>
                  edit((c) => ({
                    ...c,
                    journey: {
                      ...c.journey,
                      chapters: c.journey.chapters.map((ch) =>
                        ch.id === chapter.id ? { ...ch, heading: v } : ch
                      ),
                    },
                  }))
                }
              />
              <TextArea
                label="Body"
                rows={5}
                value={chapter.body}
                onChange={(v) =>
                  edit((c) => ({
                    ...c,
                    journey: {
                      ...c.journey,
                      chapters: c.journey.chapters.map((ch) =>
                        ch.id === chapter.id ? { ...ch, body: v } : ch
                      ),
                    },
                  }))
                }
              />
            </RepeatableItem>
          ))}

          <AddButton
            label="Add chapter"
            onClick={() => {
              const chapterId = newId('chapter')
              editBoth((c) => ({
                ...c,
                journey: {
                  ...c.journey,
                  chapters: [
                    ...c.journey.chapters,
                    { id: chapterId, tag: '', heading: '', body: '' },
                  ],
                },
              }))
            }}
          />
        </Section>

        <Section title="Projects" description="Photos for each project are managed separately.">
          <Field
            label="Section title"
            value={active.projects.title}
            onChange={(v) => edit((c) => ({ ...c, projects: { ...c.projects, title: v } }))}
          />
          <Field
            label="Subtitle"
            value={active.projects.subtitle}
            onChange={(v) => edit((c) => ({ ...c, projects: { ...c.projects, subtitle: v } }))}
          />

          {active.projects.items.map((project, i) => (
            <RepeatableItem
              key={project.id}
              title={project.title || `Project ${i + 1}`}
              onRemove={() =>
                editBoth((c) => ({
                  ...c,
                  projects: {
                    ...c.projects,
                    items: c.projects.items.filter((p) => p.id !== project.id),
                  },
                }))
              }
              onMoveUp={
                i > 0
                  ? () =>
                      editBoth((c) => ({
                        ...c,
                        projects: { ...c.projects, items: move(c.projects.items, i, i - 1) },
                      }))
                  : undefined
              }
              onMoveDown={
                i < active.projects.items.length - 1
                  ? () =>
                      editBoth((c) => ({
                        ...c,
                        projects: { ...c.projects, items: move(c.projects.items, i, i + 1) },
                      }))
                  : undefined
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  label="Year"
                  value={project.year}
                  onChange={(v) =>
                    edit((c) => ({
                      ...c,
                      projects: {
                        ...c.projects,
                        items: c.projects.items.map((p) =>
                          p.id === project.id ? { ...p, year: v } : p
                        ),
                      },
                    }))
                  }
                />
                <Field
                  label="Category"
                  value={project.tag}
                  onChange={(v) =>
                    edit((c) => ({
                      ...c,
                      projects: {
                        ...c.projects,
                        items: c.projects.items.map((p) =>
                          p.id === project.id ? { ...p, tag: v } : p
                        ),
                      },
                    }))
                  }
                />
              </div>
              <Field
                label="Title"
                value={project.title}
                onChange={(v) =>
                  edit((c) => ({
                    ...c,
                    projects: {
                      ...c.projects,
                      items: c.projects.items.map((p) =>
                        p.id === project.id ? { ...p, title: v } : p
                      ),
                    },
                  }))
                }
              />
              <LineList
                label="Narrative"
                rows={5}
                hint="One numbered line per row, as shown on the site"
                value={project.narrative}
                onChange={(v) =>
                  edit((c) => ({
                    ...c,
                    projects: {
                      ...c.projects,
                      items: c.projects.items.map((p) =>
                        p.id === project.id ? { ...p, narrative: v } : p
                      ),
                    },
                  }))
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[0, 1, 2].map((m) => {
                  const metric = project.metrics[m] ?? { label: '', value: '' }
                  const setMetric = (patch: Partial<typeof metric>) =>
                    edit((c) => ({
                      ...c,
                      projects: {
                        ...c.projects,
                        items: c.projects.items.map((p) => {
                          if (p.id !== project.id) return p
                          const metrics = [0, 1, 2].map(
                            (k) => p.metrics[k] ?? { label: '', value: '' }
                          )
                          metrics[m] = { ...metrics[m], ...patch }
                          return { ...p, metrics }
                        }),
                      },
                    }))

                  return (
                    <div key={m} className="space-y-2">
                      <Field
                        label={`Metric ${m + 1}`}
                        value={metric.label}
                        onChange={(v) => setMetric({ label: v })}
                      />
                      <Field
                        label="Value"
                        value={metric.value}
                        onChange={(v) => setMetric({ value: v })}
                      />
                    </div>
                  )
                })}
              </div>

              <LineList
                label="Tags"
                rows={3}
                value={project.tags}
                onChange={(v) =>
                  edit((c) => ({
                    ...c,
                    projects: {
                      ...c.projects,
                      items: c.projects.items.map((p) =>
                        p.id === project.id ? { ...p, tags: v } : p
                      ),
                    },
                  }))
                }
              />
            </RepeatableItem>
          ))}

          <AddButton
            label="Add project"
            onClick={() => {
              const projectId = newId('project')
              editBoth((c) => ({
                ...c,
                projects: {
                  ...c.projects,
                  items: [
                    ...c.projects.items,
                    {
                      id: projectId,
                      year: new Date().getFullYear().toString(),
                      tag: '',
                      title: '',
                      narrative: [],
                      metrics: [
                        { label: '', value: '' },
                        { label: '', value: '' },
                        { label: '', value: '' },
                      ],
                      tags: [],
                    },
                  ],
                },
              }))
            }}
          />
        </Section>

        <Section title="Skills">
          <Field
            label="Section title"
            value={active.skills.title}
            onChange={(v) => edit((c) => ({ ...c, skills: { ...c.skills, title: v } }))}
          />
          <Field
            label="Subtitle"
            value={active.skills.subtitle}
            onChange={(v) => edit((c) => ({ ...c, skills: { ...c.skills, subtitle: v } }))}
          />

          {active.skills.categories.map((category, i) => (
            <RepeatableItem
              key={i}
              title={category.category || `Category ${i + 1}`}
              onRemove={() =>
                editBoth((c) => ({
                  ...c,
                  skills: {
                    ...c.skills,
                    categories: c.skills.categories.filter((_, j) => j !== i),
                  },
                }))
              }
              onMoveUp={
                i > 0
                  ? () =>
                      editBoth((c) => ({
                        ...c,
                        skills: { ...c.skills, categories: move(c.skills.categories, i, i - 1) },
                      }))
                  : undefined
              }
              onMoveDown={
                i < active.skills.categories.length - 1
                  ? () =>
                      editBoth((c) => ({
                        ...c,
                        skills: { ...c.skills, categories: move(c.skills.categories, i, i + 1) },
                      }))
                  : undefined
              }
            >
              <Field
                label="Category"
                value={category.category}
                onChange={(v) =>
                  edit((c) => ({
                    ...c,
                    skills: {
                      ...c.skills,
                      categories: c.skills.categories.map((cat, j) =>
                        j === i ? { ...cat, category: v } : cat
                      ),
                    },
                  }))
                }
              />
              <LineList
                label="Skills"
                value={category.skills}
                onChange={(v) =>
                  edit((c) => ({
                    ...c,
                    skills: {
                      ...c.skills,
                      categories: c.skills.categories.map((cat, j) =>
                        j === i ? { ...cat, skills: v } : cat
                      ),
                    },
                  }))
                }
              />
            </RepeatableItem>
          ))}

          <AddButton
            label="Add category"
            onClick={() =>
              editBoth((c) => ({
                ...c,
                skills: { ...c.skills, categories: [...c.skills.categories, { category: '', skills: [] }] },
              }))
            }
          />

          <div className="pt-2 space-y-4">
            <span className="block text-xs uppercase tracking-wider text-dark-400">
              Certifications
            </span>
            {active.skills.certs.map((cert, i) => (
              <RepeatableItem
                key={i}
                title={cert.title || `Certification ${i + 1}`}
                onRemove={() =>
                  editBoth((c) => ({
                    ...c,
                    skills: { ...c.skills, certs: c.skills.certs.filter((_, j) => j !== i) },
                  }))
                }
              >
                <Field
                  label="Title"
                  value={cert.title}
                  onChange={(v) =>
                    edit((c) => ({
                      ...c,
                      skills: {
                        ...c.skills,
                        certs: c.skills.certs.map((ct, j) => (j === i ? { ...ct, title: v } : ct)),
                      },
                    }))
                  }
                />
                <Field
                  label="Issuer"
                  value={cert.issuer}
                  onChange={(v) =>
                    edit((c) => ({
                      ...c,
                      skills: {
                        ...c.skills,
                        certs: c.skills.certs.map((ct, j) => (j === i ? { ...ct, issuer: v } : ct)),
                      },
                    }))
                  }
                />
              </RepeatableItem>
            ))}
            <AddButton
              label="Add certification"
              onClick={() =>
                editBoth((c) => ({
                  ...c,
                  skills: { ...c.skills, certs: [...c.skills.certs, { title: '', issuer: '' }] },
                }))
              }
            />
          </div>
        </Section>

        <Section title="Contact and footer">
          <Field
            label="Contact title"
            value={active.contact.title}
            onChange={(v) => edit((c) => ({ ...c, contact: { ...c.contact, title: v } }))}
          />
          <TextArea
            label="Contact subtitle"
            rows={2}
            value={active.contact.subtitle}
            onChange={(v) => edit((c) => ({ ...c, contact: { ...c.contact, subtitle: v } }))}
          />
          <LineList
            label="Open to"
            value={active.contact.availableItems}
            onChange={(v) => edit((c) => ({ ...c, contact: { ...c.contact, availableItems: v } }))}
          />
          <Field
            label="Footer tagline"
            value={active.footer.tagline}
            onChange={(v) => edit((c) => ({ ...c, footer: { ...c.footer, tagline: v } }))}
          />
          <Field
            label="Footer rights"
            value={active.footer.rights}
            onChange={(v) => edit((c) => ({ ...c, footer: { ...c.footer, rights: v } }))}
          />
        </Section>
      </div>
    </div>
  )
}
