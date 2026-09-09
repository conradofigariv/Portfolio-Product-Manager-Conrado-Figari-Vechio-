-- Rich text blocks, phase 7: the two remaining project fields (year, tag)
-- and hero stats — closing out the migration except contact.socials/email,
-- which stay behind for good (see CLAUDE.md).
--
-- Project year/tag are scalar fields keyed by the project's own id, same
-- family as project title (0007) — not a list, no sort_order needed.
--
-- Hero stats are, like project metrics (0009), NOT an owner-addable/
-- removable list — the layout is a fixed 3-column grid, always exactly 3 —
-- so each is a fixed-index scalar block, "stats.<i>.value"/".label" with
-- <i> literally 0/1/2. Unlike project metrics, stats sit directly under
-- content (not nested per-project), so there's no parent id to interpolate.
--
-- Neither kept in sync across languages, same as every prior migration.
-- Purely a backfill; safe to re-run only against a database that hasn't
-- already had it applied.

-- Project year + tag.
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, content_json, content_html)
select
  portfolio_id,
  'projects',
  'projects.items.' || project_id || '.' || field_name,
  lang,
  jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', value))
      )
    )
  ),
  '<p>' || replace(replace(replace(replace(replace(
    value, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;'), '''', '&#39;') || '</p>'
from (
  select
    p.id as portfolio_id,
    lang.value as lang,
    proj.value ->> 'id' as project_id,
    field.name as field_name,
    proj.value ->> field.name as value
  from public.portfolios p
  cross join lateral (values ('en'), ('es')) as lang(value)
  cross join lateral jsonb_array_elements(
    coalesce(p.content #> array[lang.value, 'projects', 'items'], '[]'::jsonb)
  ) as proj(value)
  cross join lateral (values ('year'), ('tag')) as field(name)
) src
where project_id is not null
  and value is not null
  and value <> '';

-- Hero stats.
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, content_json, content_html)
select
  portfolio_id,
  'hero',
  'stats.' || (ordinality - 1) || '.' || field_name,
  lang,
  jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', value))
      )
    )
  ),
  '<p>' || replace(replace(replace(replace(replace(
    value, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;'), '''', '&#39;') || '</p>'
from (
  select
    p.id as portfolio_id,
    lang.value as lang,
    stat.ordinality as ordinality,
    field.name as field_name,
    stat.value ->> field.name as value
  from public.portfolios p
  cross join lateral (values ('en'), ('es')) as lang(value)
  cross join lateral jsonb_array_elements(
    coalesce(p.content #> array[lang.value, 'stats'], '[]'::jsonb)
  ) with ordinality as stat(value, ordinality)
  cross join lateral (values ('value'), ('label')) as field(name)
) src
where value is not null
  and value <> '';
