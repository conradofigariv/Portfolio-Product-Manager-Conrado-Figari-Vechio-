'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { translations, Lang } from '../lib/translations'
import { Portfolio, PortfolioBlocks, PortfolioContent, PortfolioMedia, defaultPortfolio } from '../lib/portfolio'
import { setAtPath } from '../lib/content-path'

interface LanguageContextType {
  lang: Lang
  // Interface labels, identical for every portfolio.
  t: (typeof translations)['en']
  // The content of the portfolio being displayed, in the active language.
  content: PortfolioContent
  media: PortfolioMedia
  // Rich text fields migrated to portfolio_blocks. Unlike content, these are
  // not part of the draft — each field autosaves itself independently (see
  // useBlockPersistence), so this is always the committed server value.
  blocks: PortfolioBlocks
  toggleLang: () => void
  // Editing, only ever true for the portfolio's owner.
  editing: boolean
  dirty: boolean
  draft: Record<Lang, PortfolioContent>
  setField: (path: string, value: string) => void
  // Structural edits (add/remove list items) that only ever touch the language
  // being viewed — used for narrative lines, tags, skills, categories, certs
  // and contact items, none of which anything else is keyed to.
  updateActive: (update: (content: PortfolioContent) => PortfolioContent) => void
  // Structural edits that must land on both languages at once, because
  // chapter and project ids are what photos attach to and the two language
  // documents have to keep matching ids.
  updateBoth: (update: (content: PortfolioContent, lang: Lang) => PortfolioContent) => void
  markSaved: () => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({
  children,
  portfolio = defaultPortfolio,
  editing = false,
}: {
  children: ReactNode
  portfolio?: Portfolio
  editing?: boolean
}) {
  const [lang, setLang] = useState<Lang>('en')
  const [draft, setDraft] = useState(portfolio.content)
  const [dirty, setDirty] = useState(false)

  const toggleLang = () => setLang((l) => (l === 'en' ? 'es' : 'en'))

  function updateActive(update: (content: PortfolioContent) => PortfolioContent) {
    setDraft((prev) => ({ ...prev, [lang]: update(prev[lang]) }))
    setDirty(true)
  }

  function updateBoth(update: (content: PortfolioContent, lang: Lang) => PortfolioContent) {
    setDraft((prev) => ({ en: update(prev.en, 'en'), es: update(prev.es, 'es') }))
    setDirty(true)
  }

  // Edits land on the language being viewed; the other one is untouched.
  function setField(path: string, value: string) {
    updateActive((current) => setAtPath(current, path, value))
  }

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t: translations[lang],
        content: draft[lang],
        media: portfolio.media,
        blocks: portfolio.blocks,
        toggleLang,
        editing,
        dirty,
        draft,
        setField,
        updateActive,
        updateBoth,
        markSaved: () => setDirty(false),
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
