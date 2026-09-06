'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { translations, Lang } from '../lib/translations'
import { Portfolio, PortfolioContent, PortfolioMedia, defaultPortfolio } from '../lib/portfolio'

interface LanguageContextType {
  lang: Lang
  // Interface labels, identical for every portfolio.
  t: (typeof translations)['en']
  // The content of the portfolio being displayed, in the active language.
  content: PortfolioContent
  media: PortfolioMedia
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({
  children,
  portfolio = defaultPortfolio,
}: {
  children: ReactNode
  portfolio?: Portfolio
}) {
  const [lang, setLang] = useState<Lang>('en')

  const toggleLang = () => setLang((l) => (l === 'en' ? 'es' : 'en'))

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t: translations[lang],
        content: portfolio.content[lang],
        media: portfolio.media,
        toggleLang,
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
