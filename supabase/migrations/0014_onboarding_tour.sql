-- The single language-toggle callout (0013) is becoming a multi-step
-- onboarding tour, where each step can point at a different element on the
-- page rather than always the language toggle. Renaming the column to match
-- what it now means, and adding one more to remember where the owner left
-- off.
--
-- language_hint_seen -> onboarding_tour_seen: unchanged semantics (true =
-- permanently dismissed, set either by finishing the tour or by explicitly
-- skipping it — see finishOnboardingTour in portfolio-actions.ts), just a
-- name that still makes sense now that it's not only about language.
--
-- onboarding_tour_step (new): the step index to resume from next time, set
-- only when the owner closes early via the small "X" ("Salir" — pause, not
-- skip) rather than finishing or skipping outright. Closing via "X" without
-- ticking "don't show again" should pick back up where they left off, not
-- restart from step 0 — that tracking needs its own column since it's a
-- position, not a boolean.

alter table public.portfolios
  rename column language_hint_seen to onboarding_tour_seen;

alter table public.portfolios
  add column if not exists onboarding_tour_step integer not null default 0;
