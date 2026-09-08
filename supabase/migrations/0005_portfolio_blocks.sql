-- Rich text blocks (Tiptap), phase 1: only the scalar, non-list text fields
-- (hero name, section titles/subtitles, footer lines, ...) move here. Fields
-- that are list items an owner can add/remove (narrative lines, tags,
-- metrics, project/chapter fields) stay in portfolios.content JSONB until a
-- follow-up migration gives that structure a home in this table too.
--
-- Keyed by portfolio_id (not user_id) to match portfolio_media's pattern:
-- ownership checks go through the portfolios row everywhere else in this
-- schema, so this stays consistent rather than introducing a second,
-- parallel ownership column.
--
-- block_key reuses the same dot-path strings content-path.ts already
-- resolves against portfolios.content (e.g. "hero.name"), so the client
-- needs no new key scheme — only where the value is read from changes.
create table public.portfolio_blocks (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios (id) on delete cascade,
  section text not null,
  block_key text not null,
  lang text not null check (lang in ('en', 'es')),
  content_json jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  content_html text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create unique index portfolio_blocks_key_idx
  on public.portfolio_blocks (portfolio_id, block_key, lang);

create trigger portfolio_blocks_touch_updated_at
  before update on public.portfolio_blocks
  for each row execute function public.touch_updated_at();

alter table public.portfolio_blocks enable row level security;

create policy "Blocks follow their portfolio's visibility"
  on public.portfolio_blocks for select
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id
        and (p.published or p.user_id = auth.uid())
    )
  );

create policy "Users can add blocks to their own portfolio"
  on public.portfolio_blocks for insert
  with check (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

create policy "Users can update blocks on their own portfolio"
  on public.portfolio_blocks for update
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

create policy "Users can delete blocks from their own portfolio"
  on public.portfolio_blocks for delete
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

-- Backfill: seed a block for every existing portfolio's current value of the
-- 16 scalar fields being migrated, in both languages. Wrapped as a single
-- unformatted paragraph, since the old plain-text system never stored any
-- formatting to carry over. Safe to re-run (on conflict do nothing).
do $$
declare
  field record;
  p record;
  lang text;
  v text;
  escaped text;
begin
  for field in
    select * from (values
      ('hero',     'hero.greeting',           array['hero','greeting']),
      ('hero',     'hero.name',                array['hero','name']),
      ('hero',     'hero.tagline',             array['hero','tagline']),
      ('hero',     'hero.description',         array['hero','description']),
      ('projects', 'projects.title',           array['projects','title']),
      ('projects', 'projects.subtitle',        array['projects','subtitle']),
      ('projects', 'projects.ctaTitle',        array['projects','ctaTitle']),
      ('projects', 'projects.ctaDescription',  array['projects','ctaDescription']),
      ('journey',  'journey.title',            array['journey','title']),
      ('skills',   'skills.title',             array['skills','title']),
      ('skills',   'skills.subtitle',          array['skills','subtitle']),
      ('footer',   'footer.tagline',           array['footer','tagline']),
      ('footer',   'footer.rights',            array['footer','rights']),
      ('contact',  'contact.title',            array['contact','title']),
      ('contact',  'contact.subtitle',         array['contact','subtitle'])
    ) as f(section, block_key, path)
  loop
    for p in select id, content from public.portfolios loop
      foreach lang in array array['en', 'es'] loop
        v := p.content #>> (array[lang] || field.path);
        continue when v is null or v = '';

        escaped := replace(replace(replace(replace(replace(
          v, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;'), '''', '&#39;');

        insert into public.portfolio_blocks
          (portfolio_id, section, block_key, lang, content_json, content_html)
        values (
          p.id,
          field.section,
          field.block_key,
          lang,
          jsonb_build_object(
            'type', 'doc',
            'content', jsonb_build_array(
              jsonb_build_object(
                'type', 'paragraph',
                'content', jsonb_build_array(
                  jsonb_build_object('type', 'text', 'text', v)
                )
              )
            )
          ),
          '<p>' || escaped || '</p>'
        )
        on conflict (portfolio_id, block_key, lang) do nothing;
      end loop;
    end loop;
  end loop;
end $$;
