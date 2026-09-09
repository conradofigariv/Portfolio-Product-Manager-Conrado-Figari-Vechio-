-- Rich text blocks, phase 6: skills categories — the last of the
-- multi-field/nested list-shaped fields, and the trickiest, because unlike
-- projects/chapters, SkillCategory has never had a stable `id`. A category
-- is itself an owner-addable/removable entity (like a chapter or project)
-- that *also* owns its own nested addable/removable list (its skills), so
-- this needs both an id assigned to the entity and a migration of two
-- different kinds of fields hanging off it.
--
-- Step 1: assign every existing category a deterministic, index-based id
-- ("skillcat-<index>", matching the app's skillCategoryId() helper and the
-- same scheme projectId()/chapterId() already use) by rewriting
-- portfolios.content directly. Unlike every migration before this one,
-- which only ever INSERTed into portfolio_blocks, this one also UPDATEs the
-- JSONB content column itself — the category entity's own structural
-- existence (its id) still lives in portfolios.content, exactly like a
-- chapter's or project's id does, only the category's *fields* move to
-- portfolio_blocks. Deriving the id purely from array position (not a
-- random value) makes this idempotent and safe to re-run: re-running
-- recomputes the same id for the same position every time, and the two
-- backfills below independently recompute that same id from that same
-- position rather than reading it back out of content, so statement order
-- between this UPDATE and the INSERTs below never matters.
update public.portfolios p
set content = jsonb_set(
  jsonb_set(
    p.content,
    '{en,skills,categories}',
    coalesce((
      select jsonb_agg(cat.value || jsonb_build_object('id', 'skillcat-' || (cat.ordinality - 1)) order by cat.ordinality)
      from jsonb_array_elements(coalesce(p.content #> '{en,skills,categories}', '[]'::jsonb)) with ordinality as cat(value, ordinality)
    ), '[]'::jsonb)
  ),
  '{es,skills,categories}',
  coalesce((
    select jsonb_agg(cat.value || jsonb_build_object('id', 'skillcat-' || (cat.ordinality - 1)) order by cat.ordinality)
    from jsonb_array_elements(coalesce(p.content #> '{es,skills,categories}', '[]'::jsonb)) with ordinality as cat(value, ordinality)
  ), '[]'::jsonb)
);

-- Step 2: category name, a scalar field keyed by that category id —
-- "skills.categories.<catId>.category", same family as chapter tag/heading/body.
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, content_json, content_html)
select
  p.id,
  'skills',
  'skills.categories.skillcat-' || (cat.ordinality - 1) || '.category',
  lang.value,
  jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', cat.value ->> 'category'))
      )
    )
  ),
  '<p>' || replace(replace(replace(replace(replace(
    cat.value ->> 'category', '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;'), '''', '&#39;') || '</p>'
from public.portfolios p
cross join lateral (values ('en'), ('es')) as lang(value)
cross join lateral jsonb_array_elements(
  coalesce(p.content #> array[lang.value, 'skills', 'categories'], '[]'::jsonb)
) with ordinality as cat(value, ordinality)
where (cat.value ->> 'category') is not null
  and (cat.value ->> 'category') <> '';

-- Step 3: each category's skills — a nested owner-addable/removable list of
-- single-field blocks, "skills.categories.<catId>.skills.<skillId>", same
-- shape as a project's narrative lines or tags. Not kept in sync across
-- languages, same as every other list in this app.
insert into public.portfolio_blocks
  (portfolio_id, section, block_key, lang, sort_order, content_json, content_html)
select
  p.id,
  'skills',
  'skills.categories.skillcat-' || (cat.ordinality - 1) || '.skills.' || substr(gen_random_uuid()::text, 1, 8),
  lang.value,
  (skill.ordinality - 1)::int,
  jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', skill.value))
      )
    )
  ),
  '<p>' || replace(replace(replace(replace(replace(
    skill.value, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;'), '''', '&#39;') || '</p>'
from public.portfolios p
cross join lateral (values ('en'), ('es')) as lang(value)
cross join lateral jsonb_array_elements(
  coalesce(p.content #> array[lang.value, 'skills', 'categories'], '[]'::jsonb)
) with ordinality as cat(value, ordinality)
cross join lateral jsonb_array_elements_text(
  coalesce(cat.value -> 'skills', '[]'::jsonb)
) with ordinality as skill(value, ordinality)
where skill.value is not null
  and skill.value <> '';
