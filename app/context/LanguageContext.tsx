'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { translations, Lang } from '../lib/translations'
import { Portfolio, PortfolioBlocks, PortfolioContent, PortfolioMedia, defaultPortfolio } from '../lib/portfolio'
import { setAtPath } from '../lib/content-path'
import { TOUR_STEPS } from '../lib/onboarding-tour'
import { finishOnboardingTour, pauseOnboardingTour } from '../lib/portfolio-actions'

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
  // Structural edits (add/remove list items) that only ever touch the language
  // being viewed — used for narrative lines, tags, skills, categories, certs
  // and contact items, none of which anything else is keyed to.
  updateActive: (update: (content: PortfolioContent) => PortfolioContent) => void
  // Structural edits that must land on both languages at once, because
  // chapter and project ids are what photos attach to and the two language
  // documents have to keep matching ids.
  updateBoth: (update: (content: PortfolioContent, lang: Lang) => PortfolioContent) => void
  // `savedDraft` is whatever draft object the caller actually persisted (the
  // one it sent to savePortfolio), not "the current one." Only clears `dirty`
  // if the draft hasn't changed since that request went out — if the owner
  // made another edit while the save was still in flight, that edit only
  // ever touched local draft state and was never sent, so clearing `dirty`
  // here would tell the owner (and the beforeunload guard) everything's
  // saved when it isn't. Left `dirty` in that case so Save stays enabled and
  // a follow-up click actually sends the newer edit.
  markSaved: (savedDraft: Record<Lang, PortfolioContent>) => void
  // Onboarding tour (see OnboardingTour.tsx). `active` folds together every
  // reason it might not be showing right now: not the owner's real editor
  // view, already permanently dismissed, the 2s entrance delay hasn't
  // elapsed yet, or it was closed (however) earlier this session.
  tour: {
    active: boolean
    stepIndex: number
    isFirst: boolean
    isLast: boolean
    next: () => void
    back: () => void
    // "Salir" (the small ×): close for now, remembering stepIndex so the
    // tour resumes here next time — unless `remember` is ticked, in which
    // case it behaves like `skipAll` instead. Never both un-persisted and
    // un-resumable at once: it's either "come back to this exact step" or
    // "don't come back at all".
    pause: () => void
    // "Saltear tour": ends it for good, from any step, regardless of
    // `remember` — a one-click "I don't want this" that doesn't need the
    // checkbox ticked first.
    skipAll: () => void
    // Reaching the end and clicking "Entendido": also ends it for good.
    // Same server effect as skipAll, different UI trigger — completing the
    // tour is its own reason to never show it again, independent of the
    // checkbox (which only ever modifies what an early `pause` does).
    finish: () => void
    remember: boolean
    setRemember: (value: boolean) => void
  }
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({
  children,
  portfolio = defaultPortfolio,
  editing = false,
  showTour = false,
  initialTourStep = 0,
}: {
  children: ReactNode
  portfolio?: Portfolio
  editing?: boolean
  // Whether the tour is even eligible to appear at all — decided server-side
  // (owner, not previewing, not already permanently dismissed). See
  // app/[username]/page.tsx.
  showTour?: boolean
  // Which step to resume from, from a previous "Salir". Meaningless unless
  // showTour is also true.
  initialTourStep?: number
}) {
  const [lang, setLang] = useState<Lang>('en')
  const [draft, setDraft] = useState(portfolio.content)
  const [dirty, setDirty] = useState(false)
  // Mirrors `draft` so markSaved can compare against the *latest* draft
  // (as of the most recent render) from inside an async callback, without
  // that callback needing its own stale closure over `draft`.
  const draftRef = useRef(draft)
  useEffect(() => {
    draftRef.current = draft
  }, [draft])
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

  // --- Onboarding tour ---
  const [tourClosed, setTourClosed] = useState(false)
  const [stepIndex, setStepIndex] = useState(initialTourStep)
  const [remember, setRemember] = useState(false)

  // The page itself renders instantly either way — this only delays the
  // tour's first appearance, so the owner sees their own content first and
  // the guide starts a beat later rather than competing with it for
  // attention the moment the page appears. setState inside a setTimeout
  // callback (as opposed to synchronously in the effect body) is what makes
  // a plain effect fine here rather than needing the useSyncExternalStore
  // workaround OnboardingTour.tsx uses for its document.body access — that
  // rule only flags a synchronous call in the effect body itself.
  const [tourReady, setTourReady] = useState(false)
  useEffect(() => {
    if (!showTour) return
    const timer = setTimeout(() => setTourReady(true), 2000)
    return () => clearTimeout(timer)
  }, [showTour])

  const tourActive = showTour && tourReady && !tourClosed
  const isLastStep = stepIndex >= TOUR_STEPS.length - 1

  function tourNext() {
    setStepIndex((i) => Math.min(i + 1, TOUR_STEPS.length - 1))
  }
  function tourBack() {
    setStepIndex((i) => Math.max(i - 1, 0))
  }
  function tourPause() {
    setTourClosed(true)
    if (remember) void finishOnboardingTour()
    else void pauseOnboardingTour(stepIndex)
  }
  function tourSkipAll() {
    setTourClosed(true)
    void finishOnboardingTour()
  }
  function tourFinish() {
    setTourClosed(true)
    void finishOnboardingTour()
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
        markSaved: (savedDraft) => {
          if (draftRef.current === savedDraft) setDirty(false)
        },
        lastBlockSavedAt,
        notifyBlockSaved,
        blockSaving: savingCount > 0,
        notifyBlockSavingStart,
        notifyBlockSavingEnd,
        tour: {
          active: tourActive,
          stepIndex,
          isFirst: stepIndex === 0,
          isLast: isLastStep,
          next: tourNext,
          back: tourBack,
          pause: tourPause,
          skipAll: tourSkipAll,
          finish: tourFinish,
          remember,
          setRemember,
        },
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
