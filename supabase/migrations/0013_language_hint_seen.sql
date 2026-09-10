-- Tracks whether an owner has dismissed-for-good the one-time onboarding
-- callout that points at the language toggle right after they start editing
-- ("podés crear tu currículum en inglés y en español"). Defaults to false so
-- every existing account sees it once too, same as a brand-new one — there is
-- no way to tell "just signed up" from "signed up a while ago but never
-- dismissed this", and both should see the hint until they do.
--
-- A checkbox in the callout is what sets this to true; closing the callout
-- with "Entendido" alone does not persist anything, so it comes back next
-- time the owner loads the editor (see LanguageHint.tsx and
-- dismissLanguageHint in portfolio-actions.ts).

alter table public.portfolios
  add column if not exists language_hint_seen boolean not null default false;
