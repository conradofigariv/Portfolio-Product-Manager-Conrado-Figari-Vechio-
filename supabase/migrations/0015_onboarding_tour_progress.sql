-- Fixes a real gap reported live: an owner who had already finished the
-- (then 2-step) tour saw nothing when a 3rd step was added afterwards.
-- `onboarding_tour_seen` was a plain boolean — "finished" meant "never show
-- this again, forever," with no way to tell "finished everything that
-- existed back then" from "finished everything, period." Adding a step later
-- could never re-surface, since the boolean had already latched permanently.
--
-- Collapsing to a single progress counter fixes this structurally rather
-- than patching around it: `onboarding_tour_step` (already added in 0014,
-- previously used only as the pause/resume position) now does double duty
-- as "how many steps this owner has gotten through." Finishing sets it to
-- however many steps exist *right now* (TOUR_STEPS.length, read directly in
-- finishOnboardingTour — see portfolio-actions.ts) instead of flipping a
-- separate flag. Showing the tour becomes `tourStep < TOUR_STEPS.length`,
-- computed against the *current* step count every time — so appending a 4th,
-- 5th, ... step to TOUR_STEPS automatically re-surfaces the tour for anyone
-- who'd finished it before, landing them directly on the new step rather
-- than restarting from the beginning. Pausing keeps behaving exactly as
-- before: it always meant "resume from this index," which is exactly what
-- the unified counter already means too.
--
-- The backfill below is a one-time, hand-derived value, not a general
-- formula: at the moment this migration was written, the tour had grown
-- from 2 steps to 3 (language toggle, name field, then the newly-added story
-- drag handle). Anyone who has `onboarding_tour_seen = true` finished under
-- that 2-step version, so their progress becomes 2 regardless of whatever
-- `onboarding_tour_step` happens to currently hold (a stale value from an
-- earlier pause that was later superseded by actually finishing) — the
-- result is exactly "you're caught up through step 2, the next one you
-- haven't seen is step 3." Anyone who never finished (`onboarding_tour_seen
-- = false`) is untouched by this UPDATE and keeps whatever pause position
-- they already had, including a brand-new account's untouched default of 0.

update public.portfolios
set onboarding_tour_step = 2
where onboarding_tour_seen = true;

alter table public.portfolios
  drop column onboarding_tour_seen;
