'use client'

// The one-time callout that points at the language toggle. Purely
// presentational — Navbar owns the open/remember state and passes it down,
// because Navbar renders its language toggle twice (once for the desktop
// layout, once for mobile, switched by CSS media query, both always mounted).
// If this component held its own state, dismissing it on whichever one is
// currently visible would leave the other instance's state stale, and it
// would reappear on the next viewport resize.
//
// Visually matches BackgroundPicker's own dropdown (same size/border
// convention — the two are the only navbar-anchored popovers in the app),
// plus the lime glow ring EditBar already puts on its Save button to mean
// "look here" (`shadow-[0_0_0_3px_rgba(216,255,62,0.35)]`), applied by the
// caller to the toggle button itself so the callout and its target read as
// one unit.
//
// Anchored left-0 (grows rightward), unlike BackgroundPicker's own right-0 —
// BackgroundPicker sits further right in the same row, so growing leftward
// from it stays on screen. The language toggle is the *first* item in that
// row (both in the desktop cluster and the mobile one), close to the left
// edge on a phone, so a right-0 box exactly reproduced there overflowed off
// the left edge of the viewport on mobile. left-0 is the correct anchor
// wherever the trigger sits closer to the start of its row than the end.
export default function LanguageHint({
  t,
  remember,
  onToggleRemember,
  onConfirm,
}: {
  t: { title: string; body: string; confirm: string; dontShowAgain: string }
  remember: boolean
  onToggleRemember: (value: boolean) => void
  onConfirm: () => void
}) {
  return (
    <div
      role="dialog"
      aria-label={t.title}
      className="absolute left-0 top-full mt-2 z-10 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-dark-600 bg-dark-900/95 backdrop-blur p-4 shadow-xl text-left"
    >
      <p className="text-sm font-semibold text-dark-50">{t.title}</p>
      <p className="mt-1.5 text-xs text-dark-300 leading-relaxed">{t.body}</p>

      <label className="mt-3 flex items-center gap-2 text-xs text-dark-400 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => onToggleRemember(e.target.checked)}
          className="w-3.5 h-3.5 rounded border-dark-500 accent-[#d8ff3e]"
        />
        {t.dontShowAgain}
      </label>

      <button
        type="button"
        onClick={onConfirm}
        className="button-primary text-xs py-2 w-full mt-3"
      >
        {t.confirm}
      </button>
    </div>
  )
}
