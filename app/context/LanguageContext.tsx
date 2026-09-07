'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { translations, Lang } from '../lib/translations'
import { Portfolio, PortfolioContent, PortfolioMedia, defaultPortfolio } from '../lib/portfolio'
import { setAtPath } from '../lib/content-path'

interface LanguageContextType {
  lang: Lang
  // Interface labels, identical for every portfolio.
  t: (typeof translations)['en']
  // The content of the portfolio being displayed, in the active language.
  content: PortfolioContent
  media: PortfolioMedia
  toggleLang: () => void
  // Editing, only ever true for the portfolio's owner.
  editing: boolean
  dirty: boolean
  draft: Record<Lang, PortfolioContent>
  setField: (path: string, value: string) => void
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

  // Edits land on the language being viewed; the other one is untouched.
  function setField(path: string, value: string) {
    setDraft((prev) => {
      const current = prev[lang]
      const next = setAtPath(current, path, value)
      return { ...prev, [lang]: next }
    })
    setDirty(true)
  }

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t: translations[lang],
        content: draft[lang],
        media: portfolio.media,
        toggleLang,
        editing,
        dirty,
        draft,
        setField,
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
