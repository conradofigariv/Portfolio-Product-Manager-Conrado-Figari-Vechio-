-- Rich text blocks, phase 2: project narrative lines move onto
-- portfolio_blocks too — the first list-shaped field to migrate (the
-- 15 fields in 0005 were all scalar, singular fields with no add/remove).
--
-- No schema change needed: portfolio_blocks already has sort_order (added
-- in 0001, unused by 0005's scalar fields since they have no siblings to
-- order). A narrative line's block_key is
-- "projects.items.<projectId>.narrative.<lineId>", where <lineId> is a
-- fresh random id with no meaning beyond uniqueness — order comes entirely
-- from sort_order, not from parsing the key.
--
-- Narrative lines are NOT kept in sync across languages by the app (see
-- LanguageContext's updateActive vs updateBoth), so this backfills en and
-- es independently — a project can end up with a different number of
-- narrative blocks per language, matching how the old array-based system
-- already behaved.
--
-- Purely a backfill; safe to re-run (re-running would just duplicate rows,
-- since there's no natural conflict target for a freshly-generated id — do
-- not run this twice against the same database).
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, sort_order, content_json, content_html)
select
  p.id,
  'projects',
  'projects.items.' || (proj.value ->> 'id') || '.narrative.' || substr(gen_random_uuid()::text, 1, 8),
  lang.value,
  (line.ordinality - 1)::int,
  jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'text', 'text', line.value)
        )
      )
    )
  ),
  '<p>' || replace(replace(replace(replace(replace(
    line.value, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;'), '''', '&#39;') || '</p>'
from public.portfolios p
cross join lateral (values ('en'), ('es')) as lang(value)
cross join lateral jsonb_array_elements(
  coalesce(p.content #> array[lang.value, 'projects', 'items'], '[]'::jsonb)
) as proj(value)
cross join lateral jsonb_array_elements_text(
  coalesce(proj.value -> 'narrative', '[]'::jsonb)
) with ordinality as line(value, ordinality)
where proj.value ->> 'id' is not null
  and line.value is not null
  and line.value <> '';
