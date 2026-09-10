// The structural half of the onboarding tour — *where* each step points.
// The *copy* (title/body, per language) lives in translations.ts's `tour.steps`
// instead, index-aligned with this array: TOUR_STEPS[i] pairs with
// translations.<lang>.tour.steps[i]. Kept separate because this array is the
// same regardless of language, and translations.ts is specifically for
// bilingual interface copy.
//
// `target` is a CSS selector matched against a `data-tour-target` attribute
// that the pointed-at element carries — not a ref registry. Any component can
// become a tour target by adding one attribute to an element it already
// renders; nothing needs to import this file or know the tour exists. See
// OnboardingTour.tsx for how a step's live DOM node is resolved from this.
export const TOUR_STEPS = [
  { id: 'language', target: '[data-tour-target="language-toggle"]' },
  { id: 'name', target: '[data-tour-target="hero-name"]' },
  { id: 'story-reorder', target: '[data-tour-target="story-reorder"]' },
] as const

/**
 * Resolves a step's `target` selector to the one element that's actually
 * rendered right now. Some targets exist twice in the DOM at once — Navbar
 * renders the language toggle once for the desktop layout and once for
 * mobile, switched by a CSS media query rather than by mounting/unmounting —
 * so this picks whichever match is actually visible instead of always the
 * first one in document order, which on a phone would be the desktop copy
 * sitting there invisible.
 *
 * `offsetParent !== null` is a cheap, standard proxy for "this and every
 * ancestor renders" (a `display: none` element, or one inside a `display:
 * none` ancestor, always has a null offsetParent) — the same kind of check
 * used to detect whether a fixed-position element is actually laid out.
 *
 * Returns null if the target doesn't exist at all yet (a future step could
 * point at something the owner hasn't created — no chapters, no projects —
 * in which case the tour should skip rendering that step's spotlight
 * entirely rather than throw or point at nothing).
 */
export function findVisibleTarget(selector: string): HTMLElement | null {
  const candidates = document.querySelectorAll<HTMLElement>(selector)
  for (const el of candidates) {
    if (el.offsetParent !== null) return el
  }
  return null
}
