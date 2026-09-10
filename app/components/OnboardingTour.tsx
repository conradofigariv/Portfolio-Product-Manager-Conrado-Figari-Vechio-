'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react'
import { useLang } from '../context/LanguageContext'
import { TOUR_STEPS, findVisibleTarget } from '../lib/onboarding-tour'

// Nothing ever subscribes to this — it exists only so useSyncExternalStore
// below has a no-op to call, which is the point: this is the officially
// documented zero-effect way to detect "hydration has finished, we're
// genuinely client-side now" (getServerSnapshot runs during SSR *and* during
// the initial client render that has to match it, getSnapshot only takes over
// after that). A `useEffect(() => setMounted(true), [])` does the same thing
// but calling setState synchronously inside a bare effect body is exactly
// what this project's react-hooks/set-state-in-effect rule flags (the same
// rule Hero.tsx already has a known, unfixed instance of) — this sidesteps
// it by never calling setState at all.
const noopSubscribe = () => () => {}

/**
 * The onboarding tour's rendering engine: for whichever step is current, it
 * finds that step's live target element anywhere on the page (via a plain
 * `data-tour-target` attribute — see onboarding-tour.ts), scrolls it into
 * view, marks it with a spotlight ring, and floats a card next to it with the
 * step's copy plus Back/Next/Skip controls. One instance, rendered once from
 * PortfolioShell, replaces what used to be a callout hand-anchored inside
 * Navbar — that only worked while every step pointed at the same navbar
 * button; a step can now point at anything on the page (Hero's name field,
 * eventually further ones elsewhere), so the positioning has to be genuinely
 * dynamic rather than a `relative` wrapper placed by hand around one button.
 *
 * All actual state (current step, dismissed-this-session, the "remember"
 * checkbox) lives in LanguageContext's `tour`, not here — this component only
 * turns that state into DOM.
 */
export default function OnboardingTour() {
  const { t, tour } = useLang()

  // The CV modal's own portal in Navbar never needed this — its open state
  // always starts false, so its first (server) render never reaches
  // document.body. tour.active can be true on that very first render (it
  // comes from a server-computed prop, after the 2s delay elapses — but the
  // *component* itself still renders during SSR before that timer exists),
  // and `document` does not exist there. false during SSR and through the
  // client's initial (hydration-matching) render, true from the next client
  // render on — see noopSubscribe above.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    // shift() is what makes this robust regardless of where a target sits in
    // its row — the hand-rolled `left-0`/`right-0` CSS anchor this replaced
    // had to be chosen per-target and got it wrong for one of them (see
    // onboarding-tour history); shift keeps whichever edge is closest to
    // overflowing pulled back inside the viewport automatically, for any
    // target anywhere on the page.
    middleware: [offset(10), flip(), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
    // floating-ui positions via `transform: translate(...)` by default —
    // Framer Motion's own opacity/transform animation would fight it the
    // same way documented on FloatingToolbar; top/left avoids the collision.
    transform: false,
  })

  // Computed fresh every render rather than synced into state by an effect —
  // an effect that only ever calls setState (no other side effect) is
  // exactly what react-hooks/set-state-in-effect flags, same rule as the
  // `mounted` flag above and Hero.tsx's own known instance. querySelector is
  // a read, not a mutation, so doing it during render is fine; it's only
  // reachable once `mounted` is true, i.e. never during SSR or the
  // hydration-matching first client render, so the full DOM (including a
  // target added by a component elsewhere on the page) is always already
  // committed by the time this runs.
  const step = TOUR_STEPS[tour.stepIndex]
  const target = mounted && tour.active ? findVisibleTarget(step.target) : null

  // The actual side effects — floating-ui's reference, the spotlight class,
  // scrolling the target into view — belong in an effect, since they mutate
  // things outside React (the DOM, floating-ui's internal state) rather than
  // React state itself. Depending on `target` directly (not on
  // stepIndex/mounted/tour.active separately) means this only re-runs when
  // the actual element to point at changes, which is what those three
  // changing is supposed to cause anyway.
  useEffect(() => {
    if (!target) return
    target.classList.add('tour-spotlight')
    refs.setReference(target)
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return () => {
      target.classList.remove('tour-spotlight')
    }
  }, [target, refs])

  if (!mounted || !tour.active || !target) return null

  const copy = t.tour.steps[tour.stepIndex]

  return createPortal(
    <>
      {/* Dims the rest of the page. z-40, comfortably below the spotlighted
          target's own z-45 (see globals.css's .tour-spotlight) and this
          card's z-46, so both pop through the dim regardless of where in the
          page's own stacking order the target naturally sits — unlike the
          navbar-only version this replaced, a target here is not guaranteed
          to already sit inside some ancestor's elevated stacking context.
          pointer-events-none: a visual cue, not a click-trap — the page stays
          fully usable, and the card closes only via its own controls. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-40 bg-black/50 pointer-events-none"
        aria-hidden="true"
      />

      <motion.div
        // refs.setFloating is @floating-ui/react's memoized callback ref
        // setter (its documented usage), not a `.current` read — the
        // react-hooks/refs rule can't tell those apart by name alone, same
        // as FloatingToolbar's identical case.
        // eslint-disable-next-line react-hooks/refs
        ref={refs.setFloating}
        style={{ ...floatingStyles, zIndex: 46 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        role="dialog"
        aria-label={copy.title}
        className="w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-dark-600 bg-dark-900/95 backdrop-blur p-4 shadow-xl text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-dark-50">{copy.title}</p>
          {/* "Salir": pause, not skip — see tour.pause's own comment in
              LanguageContext. A corner × rather than a listed button because
              it's the "never mind, later" exit, not one of the tour's own
              actions. */}
          <button
            type="button"
            onClick={tour.pause}
            aria-label={t.tour.close}
            title={t.tour.close}
            className="flex-shrink-0 -m-1 p-1 rounded text-dark-400 hover:text-dark-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-1.5 text-xs text-dark-300 leading-relaxed">{copy.body}</p>

        <div className="mt-3 flex items-center gap-2">
          {!tour.isFirst && (
            <button
              type="button"
              onClick={tour.back}
              className="button-secondary text-xs py-1.5 px-3 flex-1"
            >
              {t.tour.back}
            </button>
          )}
          <button
            type="button"
            onClick={tour.isLast ? tour.finish : tour.next}
            className="button-primary text-xs py-1.5 px-3 flex-1"
          >
            {tour.isLast ? t.tour.finish : t.tour.next}
          </button>
        </div>

        {/* Only ever changes what the × (pause) above does — see tour.pause.
            Finishing normally or hitting "Saltear" below both dismiss for
            good regardless of this, so it isn't shown conditionally on step:
            it's relevant every time the × is a live option, which is every
            step. */}
        <label className="mt-3 flex items-center gap-2 text-xs text-dark-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={tour.remember}
            onChange={(e) => tour.setRemember(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-dark-500 accent-[#d8ff3e]"
          />
          {t.tour.dontShowAgain}
        </label>

        <button
          type="button"
          onClick={tour.skipAll}
          className="mt-3 block w-full text-center text-[11px] text-dark-500 hover:text-dark-300 transition"
        >
          {t.tour.skip}
        </button>
      </motion.div>
    </>,
    document.body
  )
}
