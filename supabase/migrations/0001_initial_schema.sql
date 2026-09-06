-- Portfolio App: profiles, portfolios and their media.
--
-- Text content is stored as JSONB keyed by language ({ en: {...}, es: {...} }) because it is
-- always read as a whole document to render a page, never queried field by field.
--
-- Media lives in its own table rather than inside that JSONB for two reasons: the same file
-- is shared by every language, and deleting a portfolio has to be able to find every storage
-- object it owns in one query.

create extension if not exists pgcrypto;

-- Usernames become URLs (/conrado), so anything that collides with an app route is refused.
create or replace function public.is_reserved_username(name text)
returns boolean
language sql
immutable
as $$
  select name in (
    'admin', 'api', 'app', 'auth', 'login', 'logout', 'signup', 'signin',
    'portfolio-app', 'settings', 'dashboard', 'new', 'edit', 'about',
    'privacy', 'terms', 'support', 'help', 'static', 'public', 'assets',
    'images', 'videos', 'favicon', 'robots', 'sitemap', 'www', 'root'
  );
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique
    check (username ~ '^[a-z0-9][a-z0-9-]{2,29}$')
    check (not public.is_reserved_username(username)),
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  -- One portfolio per user for now; drop this unique to allow several later.
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  published boolean not null default false,
  -- { en: { hero, journey, projects, skills, contact, footer }, es: { ... } }
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio_media (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios (id) on delete cascade,
  kind text not null check (kind in ('project', 'chapter', 'portrait', 'background_video', 'cv')),
  -- Stable id of the project or journey chapter inside portfolios.content, so reordering
  -- sections does not detach their media the way a positional index would.
  -- Null for kinds that belong to the portfolio as a whole.
  target_id text,
  storage_path text not null unique,
  alt text not null default '',
  sort_order integer not null default 0,
  bytes integer,
  created_at timestamptz not null default now()
);

create index portfolio_media_lookup_idx
  on public.portfolio_media (portfolio_id, kind, target_id, sort_order);

-- Product limits, enforced here so a bug or a direct API call cannot bypass the
-- checks the interface performs: 4 images per project, 2 background videos,
-- and a single portrait or CV.
create or replace function public.enforce_media_limits()
returns trigger
language plpgsql
as $$
declare
  existing integer;
  allowed integer;
begin
  allowed := case new.kind
    when 'project' then 4
    when 'background_video' then 2
    when 'chapter' then 1
    else 1
  end;

  select count(*) into existing
  from public.portfolio_media
  where portfolio_id = new.portfolio_id
    and kind = new.kind
    and target_id is not distinct from new.target_id
    and id <> new.id;

  if existing >= allowed then
    raise exception 'Limit reached: % allows at most % file(s)', new.kind, allowed;
  end if;

  return new;
end;
$$;

create trigger portfolio_media_enforce_limits
  before insert or update on public.portfolio_media
  for each row execute function public.enforce_media_limits();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

create trigger portfolios_touch_updated_at
  before update on public.portfolios
  for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;
alter table public.portfolio_media enable row level security;

-- Profiles are public: resolving /[username] happens before any session exists.
create policy "Profiles are readable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can create their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Published portfolios are readable by everyone"
  on public.portfolios for select
  using (published or auth.uid() = user_id);

create policy "Users can create their own portfolio"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own portfolio"
  on public.portfolios for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own portfolio"
  on public.portfolios for delete
  using (auth.uid() = user_id);

create policy "Media follows its portfolio's visibility"
  on public.portfolio_media for select
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id
        and (p.published or p.user_id = auth.uid())
    )
  );

create policy "Users can add media to their own portfolio"
  on public.portfolio_media for insert
  with check (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

create policy "Users can update media on their own portfolio"
  on public.portfolio_media for update
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

create policy "Users can delete media from their own portfolio"
  on public.portfolio_media for delete
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );
