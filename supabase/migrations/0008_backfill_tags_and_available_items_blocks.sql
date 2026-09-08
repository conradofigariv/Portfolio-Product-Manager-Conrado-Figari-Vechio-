-- Rich text blocks, phase 4: two more plain string lists move onto
-- portfolio_blocks — a project's tags (nested under each project, same
-- shape as 0006's narrative lines) and contact.availableItems (not nested
-- under any per-entity array at all, since there's only ever one contact
-- section per portfolio).
--
-- Same "list of blocks sharing a key prefix, ordered by sort_order" pattern
-- as 0006: block_key is "<prefix>.<freshRandomId>", sort_order comes from
-- jsonb_array_elements_text's ordinality, not from parsing the key. Not kept
-- in sync across languages (see LanguageContext's updateActive), so this
-- backfills en and es independently.
--
-- Purely a backfill; safe to re-run only against a database that hasn't
-- already had it applied — re-running would duplicate rows, since a
-- freshly-generated id has no natural conflict target.

-- Project tags.
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, sort_order, content_json, content_html)
select
  p.id,
  'projects',
  'projects.items.' || (proj.value ->> 'id') || '.tags.' || substr(gen_random_uuid()::text, 1, 8),
  lang.value,
  (tag.ordinality - 1)::int,
  jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'text', 'text', tag.value)
        )
      )
    )
  ),
  '<p>' || replace(replace(replace(replace(replace(
    tag.value, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;'), '''', '&#39;') || '</p>'
from public.portfolios p
cross join lateral (values ('en'), ('es')) as lang(value)
cross join lateral jsonb_array_elements(
  coalesce(p.content #> array[lang.value, 'projects', 'items'], '[]'::jsonb)
) as proj(value)
cross join lateral jsonb_array_elements_text(
  coalesce(proj.value -> 'tags', '[]'::jsonb)
) with ordinality as tag(value, ordinality)
where proj.value ->> 'id' is not null
  and tag.value is not null
  and tag.value <> '';

-- Contact availableItems.
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, sort_order, content_json, content_html)
select
  p.id,
  'contact',
  'contact.availableItems.' || substr(gen_random_uuid()::text, 1, 8),
  lang.value,
  (item.ordinality - 1)::int,
  jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'text', 'text', item.value)
        )
      )
    )
  ),
  '<p>' || replace(replace(replace(replace(replace(
    item.value, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;'), '''', '&#39;') || '</p>'
from public.portfolios p
cross join lateral (values ('en'), ('es')) as lang(value)
cross join lateral jsonb_array_elements_text(
  coalesce(p.content #> array[lang.value, 'contact', 'availableItems'], '[]'::jsonb)
) with ordinality as item(value, ordinality)
where item.value is not null
  and item.value <> '';
