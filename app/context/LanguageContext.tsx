'use client'

import { createContext, useCallback, useContext, useState, ReactNode } from 'react'
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
  // Bumped to Date.now() by useBlockPersistence every time *any* field's
  // autosave completes — separate from `dirty` on purpose, since autosave
  // never touches that. EditBar watches this to flash a brief "Saved"
  // confirmation, independent of whatever dirty/Save is doing.
  lastBlockSavedAt: number | null
  notifyBlockSaved: () => void
  // True while at least one field's autosave request is in flight — a
  // ref-counted "how many blocks are currently saving" rather than a single
  // boolean, since more than one field can be mid-save at once (e.g.
  // tabbing away from one field the instant another's debounce fires). Feeds
  // EditBar's Save button, which is the single place save status shows up
  // now (a per-field indicator in FloatingToolbar was tried and dropped —
  // see EditBar's own comment for why).
  blockSaving: boolean
  notifyBlockSavingStart: () => void
  notifyBlockSavingEnd: () => void
  // Throwaway editor mode, used only by the landing page's try-it-out
  // skeleton (see DemoStage.tsx). Nothing here belongs to a signed-in user:
  // there is no portfolio row, no portfolio_blocks row and no storage, so
  // every write that would normally hit a server action instead goes through
  // mutateBlocks below and dies with the tab. The real editor never sets
  // this, and every branch guarded by it is a no-op for the owner.
  demo: boolean
  // The only way a demo edit persists anywhere. Stable across renders (see
  // notifyBlockSaved's comment for why that matters here too).
  mutateBlocks: (update: (blocks: PortfolioBlocks) => PortfolioBlocks) => void
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
  demo = false,
  initialLang = 'en',
}: {
  children: ReactNode
  portfolio?: Portfolio
  editing?: boolean
  demo?: boolean
  initialLang?: Lang
}) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [draft, setDraft] = useState(portfolio.content)
  // Only ever read in demo mode. In the real editor `blocks` is the committed
  // server value and never lives in React state — a field's edits stay inside
  // its own Tiptap instance until autosave writes them to the database, which
  // is what keeps this context from re-rendering the whole page per keystroke.
  const [demoBlocks, setDemoBlocks] = useState(portfolio.blocks)
  const mutateBlocks = useCallback(
    (update: (blocks: PortfolioBlocks) => PortfolioBlocks) => setDemoBlocks(update),
    []
  )
  const [dirty, setDirty] = useState(false)
  const [lastBlockSavedAt, setLastBlockSavedAt] = useState<number | null>(null)
  const [savingCount, setSavingCount] = useState(0)
  // Stable across renders (unlike an inline arrow in the provider value
  // below) so it doesn't churn useBlockPersistence's own useCallback deps —
  // this context re-renders on every keystroke in an old-system field, and
  // every mounted Tiptap editor's update/blur listeners would otherwise be
  // torn down and re-attached on each one.
  const notifyBlockSaved = useCallback(() => setLastBlockSavedAt(Date.now()), [])
  const notifyBlockSavingStart = useCallback(() => setSavingCount((n) => n + 1), [])
  // Floored at 0 — a field can call this from its unmount-flush effect after
  // its own save() already settled and decremented once, so the count must
  // never go negative from a double-decrement.
  const notifyBlockSavingEnd = useCallback(() => setSavingCount((n) => Math.max(0, n - 1)), [])

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
        blocks: demo ? demoBlocks : portfolio.blocks,
        toggleLang,
        editing,
        dirty,
        draft,
        setField,
        updateActive,
        updateBoth,
        markSaved: () => setDirty(false),
        lastBlockSavedAt,
        notifyBlockSaved,
        blockSaving: savingCount > 0,
        notifyBlockSavingStart,
        notifyBlockSavingEnd,
        demo,
        mutateBlocks,
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
