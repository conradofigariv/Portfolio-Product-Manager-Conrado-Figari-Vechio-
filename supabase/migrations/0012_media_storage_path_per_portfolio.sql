-- Background videos could only ever be used by one account in the whole
-- database.
--
-- `portfolio_media.storage_path` carried a GLOBAL unique constraint. That is
-- fine for uploaded files, whose paths are already unique by construction
-- ("<user-id>/portrait-<timestamp>-<random>.webp"), but the preset background
-- videos are not uploads: they ship in /public and every portfolio references
-- the exact same string, "/videos/video-1.mp4". So the first account to pick a
-- preset took that path for good, and the next one to try it got
--
--   duplicate key value violates unique constraint "portfolio_media_storage_path_key"
--
-- reported live from a second, brand-new account that could not select
-- "Sunset flight" because the deployment owner already had it.
--
-- Uniqueness per portfolio is what the application actually means anywhere it
-- touches this column: every read, update and delete already filters by
-- portfolio_id alongside storage_path (see removeProjectPhoto,
-- saveMediaPosition, reorderProjectPhotos, replaceProjectPhoto). Scoping the
-- constraint to match makes shared preset paths work and still prevents one
-- portfolio from holding the same file twice.

alter table public.portfolio_media
  drop constraint if exists portfolio_media_storage_path_key;

create unique index if not exists portfolio_media_portfolio_storage_path_key
  on public.portfolio_media (portfolio_id, storage_path);
