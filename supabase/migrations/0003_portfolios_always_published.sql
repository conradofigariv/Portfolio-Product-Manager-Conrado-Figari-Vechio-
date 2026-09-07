-- Portfolios are always public now — there is no draft/private state, and
-- the app no longer offers a way to unpublish. Existing drafts (including
-- anyone who signed up but never hit Save) become visible too.
alter table public.portfolios alter column published set default true;

update public.portfolios set published = true where published = false;
