'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from './supabase/server'
import type { Lang, PortfolioContent } from './portfolio'
import { MAX_BACKGROUND_VIDEOS, isPresetVideo } from './preset-media'

// Caps exist so a malformed or hostile payload cannot store an unbounded
// document. They are generous enough that no real portfolio hits them.
const LIMITS = {
  short: 200,
  line: 1000,
  body: 5000,
  chapters: 20,
  projects: 30,
  narrative: 10,
  metrics: 3,
  tags: 12,
  categories: 12,
  skills: 30,
  certs: 20,
  stats: 3,
  contactItems: 10,
  socials: 6,
}

function text(value: unknown, max = LIMITS.line): string {
  return typeof value === 'string' ? value.slice(0, max).trim() : ''
}

function list<T>(value: unknown, max: number, map: (item: unknown, index: number) => T): T[] {
  return Array.isArray(value) ? value.slice(0, max).map(map) : []
}

function textList(value: unknown, max: number, maxLen = LIMITS.line): string[] {
  return list(value, max, (item) => text(item, maxLen)).filter(Boolean)
}

function id(value: unknown, fallback: string): string {
  const raw = text(value, 64)
  return /^[A-Za-z0-9_-]{1,64}$/.test(raw) ? raw : fallback
}

// Only http(s) survive, so a stored link can never become a javascript: URL.
function url(value: unknown, max = LIMITS.line): string {
  const raw = text(value, max)
  if (!raw) return ''
  try {
    const parsed = new URL(raw)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? raw : ''
  } catch {
    return ''
  }
}

function email(value: unknown): string {
  const raw = text(value, LIMITS.short)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? raw : ''
}

// Rebuilds the document field by field, so anything the client sends that is
// not part of the shape is simply not carried over.
function sanitize(input: unknown): PortfolioContent {
  const c = (input ?? {}) as Record<string, never>
  const hero = (c.hero ?? {}) as Record<string, unknown>
  const journey = (c.journey ?? {}) as Record<string, unknown>
  const projects = (c.projects ?? {}) as Record<string, unknown>
  const skills = (c.skills ?? {}) as Record<string, unknown>
  const contact = (c.contact ?? {}) as Record<string, unknown>
  const footer = (c.footer ?? {}) as Record<string, unknown>

  return {
    hero: {
      greeting: text(hero.greeting, LIMITS.short),
      name: text(hero.name, LIMITS.short),
      tagline: text(hero.tagline, LIMITS.line),
      description: text(hero.description, LIMITS.body),
    },
    stats: list(c.stats, LIMITS.stats, (item) => {
      const s = (item ?? {}) as Record<string, unknown>
      return { value: text(s.value, LIMITS.short), label: text(s.label, LIMITS.short) }
    }),
    journey: {
      title: text(journey.title, LIMITS.short),
      chapters: list(journey.chapters, LIMITS.chapters, (item, index) => {
        const ch = (item ?? {}) as Record<string, unknown>
        return {
          id: id(ch.id, `chapter-${index}`),
          tag: text(ch.tag, LIMITS.short),
          heading: text(ch.heading, LIMITS.line),
          body: text(ch.body, LIMITS.body),
        }
      }),
    },
    projects: {
      title: text(projects.title, LIMITS.short),
      subtitle: text(projects.subtitle, LIMITS.line),
      ctaTitle: text(projects.ctaTitle, LIMITS.short),
      ctaDescription: text(projects.ctaDescription, LIMITS.body),
      items: list(projects.items, LIMITS.projects, (item, index) => {
        const p = (item ?? {}) as Record<string, unknown>
        return {
          id: id(p.id, `project-${index}`),
          year: text(p.year, LIMITS.short),
          tag: text(p.tag, LIMITS.short),
          title: text(p.title, LIMITS.line),
          narrative: textList(p.narrative, LIMITS.narrative, LIMITS.body),
          metrics: list(p.metrics, LIMITS.metrics, (m) => {
            const metric = (m ?? {}) as Record<string, unknown>
            return {
              label: text(metric.label, LIMITS.short),
              value: text(metric.value, LIMITS.short),
            }
          }),
          tags: textList(p.tags, LIMITS.tags, LIMITS.short),
        }
      }),
    },
    skills: {
      title: text(skills.title, LIMITS.short),
      subtitle: text(skills.subtitle, LIMITS.line),
      categories: list(skills.categories, LIMITS.categories, (item) => {
        const cat = (item ?? {}) as Record<string, unknown>
        return {
          category: text(cat.category, LIMITS.short),
          skills: textList(cat.skills, LIMITS.skills, LIMITS.short),
        }
      }),
      certs: list(skills.certs, LIMITS.certs, (item) => {
        const cert = (item ?? {}) as Record<string, unknown>
        return { title: text(cert.title, LIMITS.line), issuer: text(cert.issuer, LIMITS.short) }
      }),
    },
    contact: {
      title: text(contact.title, LIMITS.short),
      subtitle: text(contact.subtitle, LIMITS.body),
      availableItems: textList(contact.availableItems, LIMITS.contactItems),
      email: email(contact.email),
      socials: list(contact.socials, LIMITS.socials, (item) => {
        const s = (item ?? {}) as Record<string, unknown>
        return { label: text(s.label, LIMITS.short), url: url(s.url) }
      }).filter((s) => s.label && s.url),
    },
    footer: {
      tagline: text(footer.tagline, LIMITS.line),
      rights: text(footer.rights, LIMITS.short),
    },
  }
}

export async function savePortfolio(payload: {
  content: Record<Lang, unknown>
  published: boolean
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()

  // Checked here rather than relying on proxy.ts: the Next docs are explicit
  // that proxy coverage can be dropped by a matcher change without warning.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  const content = {
    en: sanitize(payload.content?.en),
    es: sanitize(payload.content?.es),
  }

  if (!content.en.hero.name && !content.es.hero.name) {
    return { ok: false, error: 'Your name cannot be empty.' }
  }

  // The row filter is belt and braces — row level security already restricts
  // updates to the caller's own portfolio.
  const { error } = await supabase
    .from('portfolios')
    .update({ content, published: payload.published })
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }

  return { ok: true }
}

const BUCKET = 'portfolio-media'

/**
 * Points the portfolio at a newly uploaded portrait. The file itself is
 * uploaded from the browser straight to storage, where the bucket policy
 * already restricts writes to the caller's own folder; this records it and
 * clears the previous one so a single portrait is kept.
 */
export async function savePortrait(
  storagePath: string,
  alt: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  // Storage policies key off the first path segment, so a path outside the
  // caller's own folder could never have been written in the first place.
  if (!storagePath.startsWith(`${user.id}/`)) {
    return { ok: false, error: 'That file does not belong to your account.' }
  }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!portfolio) return { ok: false, error: 'Your portfolio is still being set up.' }

  const { data: previous } = await supabase
    .from('portfolio_media')
    .select('id, storage_path')
    .eq('portfolio_id', portfolio.id)
    .eq('kind', 'portrait')

  // Remove the old row first: the database allows only one portrait, so an
  // insert alongside a leftover row would be rejected.
  if (previous?.length) {
    await supabase
      .from('portfolio_media')
      .delete()
      .in('id', previous.map((row) => row.id))
    await supabase.storage.from(BUCKET).remove(previous.map((row) => row.storage_path))
  }

  const { error } = await supabase.from('portfolio_media').insert({
    portfolio_id: portfolio.id,
    kind: 'portrait',
    target_id: null,
    storage_path: storagePath,
    alt: alt.slice(0, 200),
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

/**
 * Replaces the background videos with a selection from the presets that ship
 * with the site. Only presets are accepted: video is the heaviest asset here,
 * and letting every account store its own would exhaust the storage tier long
 * before anything else. Enforced here rather than only in the interface.
 */
export async function setBackgroundVideos(
  paths: string[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  const wanted = paths.slice(0, MAX_BACKGROUND_VIDEOS)
  if (wanted.some((path) => !isPresetVideo(path))) {
    return { ok: false, error: 'Backgrounds can only be chosen from the built-in set.' }
  }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!portfolio) return { ok: false, error: 'Your portfolio is still being set up.' }

  const { data: existing } = await supabase
    .from('portfolio_media')
    .select('id, storage_path')
    .eq('portfolio_id', portfolio.id)
    .eq('kind', 'background_video')

  // Clear first: the database caps background videos, so inserting alongside
  // the old rows would be rejected.
  if (existing?.length) {
    await supabase
      .from('portfolio_media')
      .delete()
      .in('id', existing.map((row) => row.id))

    // Anything that was not a preset predates this rule; drop the file too so
    // deselecting it actually frees the space.
    const orphaned = existing
      .map((row) => row.storage_path)
      .filter((path) => !isPresetVideo(path) && !path.startsWith('/'))
    if (orphaned.length) await supabase.storage.from(BUCKET).remove(orphaned)
  }

  if (wanted.length) {
    const { error } = await supabase.from('portfolio_media').insert(
      wanted.map((path, index) => ({
        portfolio_id: portfolio.id,
        kind: 'background_video',
        target_id: null,
        storage_path: path,
        alt: '',
        sort_order: index,
      }))
    )
    if (error) return { ok: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}

/**
 * Points a journey chapter at a newly uploaded photo, replacing any it had —
 * the database allows only one per chapter. Mirrors savePortrait.
 */
export async function saveChapterPhoto(
  chapterId: string,
  storagePath: string,
  alt: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  if (!storagePath.startsWith(`${user.id}/`)) {
    return { ok: false, error: 'That file does not belong to your account.' }
  }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!portfolio) return { ok: false, error: 'Your portfolio is still being set up.' }

  const { data: previous } = await supabase
    .from('portfolio_media')
    .select('id, storage_path')
    .eq('portfolio_id', portfolio.id)
    .eq('kind', 'chapter')
    .eq('target_id', chapterId)

  if (previous?.length) {
    await supabase.from('portfolio_media').delete().in('id', previous.map((row) => row.id))
    const owned = previous.map((row) => row.storage_path).filter((path) => !path.startsWith('/'))
    if (owned.length) await supabase.storage.from(BUCKET).remove(owned)
  }

  const { error } = await supabase.from('portfolio_media').insert({
    portfolio_id: portfolio.id,
    kind: 'chapter',
    target_id: chapterId,
    storage_path: storagePath,
    alt: alt.slice(0, 200),
  })
  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function removeChapterPhoto(
  chapterId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!portfolio) return { ok: false, error: 'Your portfolio is still being set up.' }

  const { data: rows } = await supabase
    .from('portfolio_media')
    .select('id, storage_path')
    .eq('portfolio_id', portfolio.id)
    .eq('kind', 'chapter')
    .eq('target_id', chapterId)

  if (rows?.length) {
    await supabase.from('portfolio_media').delete().in('id', rows.map((row) => row.id))
    const owned = rows.map((row) => row.storage_path).filter((path) => !path.startsWith('/'))
    if (owned.length) await supabase.storage.from(BUCKET).remove(owned)
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}

const MAX_PROJECT_PHOTOS = 4

/**
 * Adds one photo to a project's gallery, up to the 4 the database allows.
 */
export async function addProjectPhoto(
  projectId: string,
  storagePath: string,
  alt: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  if (!storagePath.startsWith(`${user.id}/`)) {
    return { ok: false, error: 'That file does not belong to your account.' }
  }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!portfolio) return { ok: false, error: 'Your portfolio is still being set up.' }

  const { count } = await supabase
    .from('portfolio_media')
    .select('id', { count: 'exact', head: true })
    .eq('portfolio_id', portfolio.id)
    .eq('kind', 'project')
    .eq('target_id', projectId)

  if ((count ?? 0) >= MAX_PROJECT_PHOTOS) {
    return { ok: false, error: `A project can have at most ${MAX_PROJECT_PHOTOS} photos.` }
  }

  const { error } = await supabase.from('portfolio_media').insert({
    portfolio_id: portfolio.id,
    kind: 'project',
    target_id: projectId,
    storage_path: storagePath,
    alt: alt.slice(0, 200),
    sort_order: count ?? 0,
  })
  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function removeProjectPhoto(
  projectId: string,
  storagePath: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!portfolio) return { ok: false, error: 'Your portfolio is still being set up.' }

  const { error } = await supabase
    .from('portfolio_media')
    .delete()
    .eq('portfolio_id', portfolio.id)
    .eq('kind', 'project')
    .eq('target_id', projectId)
    .eq('storage_path', storagePath)
  if (error) return { ok: false, error: error.message }

  if (!storagePath.startsWith('/')) await supabase.storage.from(BUCKET).remove([storagePath])

  revalidatePath('/', 'layout')
  return { ok: true }
}
