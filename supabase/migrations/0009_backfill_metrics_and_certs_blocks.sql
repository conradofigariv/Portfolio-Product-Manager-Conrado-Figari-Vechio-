-- Rich text blocks, phase 5: project metrics and skill certifications.
--
-- Project metrics are NOT a list an owner adds to/removes from — the layout
-- is a fixed 3-column grid, always exactly 3 metrics per project — so each
-- is a fixed-index scalar block ("projects.items.<projectId>.metrics.<i>.label"/
-- ".value", i literally 0/1/2), same family as 0007's chapter/title fields,
-- not a sort_order-ordered list. No sort_order needed; the column default
-- of 0 is left as-is.
--
-- Certifications ARE an owner-addable/removable list, and unlike a
-- narrative line or a tag (0006/0008), each item carries two fields
-- (title + issuer) rather than one — both share one fresh random item id
-- and one sort_order, block_key "skills.certs.<certId>.title"/".issuer".
-- The item id is generated once per cert in the inner subquery, before the
-- cross join against ('title'),('issuer') fans each cert out into two rows
-- — generating it after the fan-out would give title and issuer different,
-- unpaired ids.
--
-- Neither is kept in sync across languages (see LanguageContext's
-- updateActive), so both backfill en and es independently.
--
-- Purely a backfill; safe to re-run only against a database that hasn't
-- already had it applied.

-- Project metrics.
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, content_json, content_html)
select
  portfolio_id,
  'projects',
  'projects.items.' || project_id || '.metrics.' || (ordinality - 1) || '.' || field_name,
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
    metric.ordinality as ordinality,
    field.name as field_name,
    metric.value ->> field.name as value
  from public.portfolios p
  cross join lateral (values ('en'), ('es')) as lang(value)
  cross join lateral jsonb_array_elements(
    coalesce(p.content #> array[lang.value, 'projects', 'items'], '[]'::jsonb)
  ) as proj(value)
  cross join lateral jsonb_array_elements(
    coalesce(proj.value -> 'metrics', '[]'::jsonb)
  ) with ordinality as metric(value, ordinality)
  cross join lateral (values ('label'), ('value')) as field(name)
) src
where project_id is not null
  and value is not null
  and value <> '';

-- Skill certifications.
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, sort_order, content_json, content_html)
select
  portfolio_id,
  'skills',
  'skills.certs.' || item_id || '.' || field_name,
  lang,
  sort_order,
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
    cert_row.portfolio_id,
    cert_row.lang,
    cert_row.sort_order,
    cert_row.item_id,
    field.name as field_name,
    cert_row.value ->> field.name as value
  from (
    select
      p.id as portfolio_id,
      lang.value as lang,
      (cert.ordinality - 1)::int as sort_order,
      substr(gen_random_uuid()::text, 1, 8) as item_id,
      cert.value as value
    from public.portfolios p
    cross join lateral (values ('en'), ('es')) as lang(value)
    cross join lateral jsonb_array_elements(
      coalesce(p.content #> array[lang.value, 'skills', 'certs'], '[]'::jsonb)
    ) with ordinality as cert(value, ordinality)
  ) cert_row
  cross join lateral (values ('title'), ('issuer')) as field(name)
) src
where value is not null
  and value <> '';
