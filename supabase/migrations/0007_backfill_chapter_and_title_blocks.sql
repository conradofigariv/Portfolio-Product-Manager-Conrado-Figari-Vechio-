-- Rich text blocks, phase 3: two more scalar fields, each keyed by a
-- dynamic parent id rather than a fixed path — a chapter's tag/heading/body
-- (one each per chapter, not a list an owner adds/removed within a
-- chapter — the chapter itself is the list item) and a project's title.
-- No sort_order needed (each has no siblings to order against); the column
-- default of 0 is left as-is.
--
-- Same subquery-then-format shape as 0006, without 0006's per-array-item
-- fan-out — these aren't lists themselves.

-- Chapter tag/heading/body.
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, content_json, content_html)
select
  portfolio_id,
  'journey',
  'journey.chapters.' || chapter_id || '.' || field_name,
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
    chap.value ->> 'id' as chapter_id,
    field.name as field_name,
    chap.value ->> field.name as value
  from public.portfolios p
  cross join lateral (values ('en'), ('es')) as lang(value)
  cross join lateral jsonb_array_elements(
    coalesce(p.content #> array[lang.value, 'journey', 'chapters'], '[]'::jsonb)
  ) as chap(value)
  cross join lateral (values ('tag'), ('heading'), ('body')) as field(name)
) src
where chapter_id is not null
  and value is not null
  and value <> '';

-- Project title.
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, content_json, content_html)
select
  portfolio_id,
  'projects',
  'projects.items.' || project_id || '.title',
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
    proj.value ->> 'title' as value
  from public.portfolios p
  cross join lateral (values ('en'), ('es')) as lang(value)
  cross join lateral jsonb_array_elements(
    coalesce(p.content #> array[lang.value, 'projects', 'items'], '[]'::jsonb)
  ) as proj(value)
) src
where project_id is not null
  and value is not null
  and value <> '';
