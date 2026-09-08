'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from './supabase/server'
import { EMPTY_DOC, renderBlockHtml } from './editor/render-html'
import type { Lang } from './portfolio'

type AddResult = { ok: true; blockKey: string } | { ok: false; error: string }
type RemoveResult = { ok: true } | { ok: false; error: string }

function randomId(): string {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Adds one new (empty) block to an owner-editable list — a narrative line,
 * a tag, and so on — identified by `listPrefix` (e.g.
 * "projects.items.<id>.narrative"). Its own block_key is listPrefix plus a
 * fresh random id, appended after whatever currently has the highest
 * sort_order among that list's existing blocks in this language. Lists
 * aren't kept in sync across languages (same as the plain-text system this
 * replaces — see LanguageContext's updateActive), so this only ever touches
 * one.
 */
export async function addListItemBlock(listPrefix: string, section: string, lang: Lang): Promise<AddResult> {
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

  const { data: last } = await supabase
    .from('portfolio_blocks')
    .select('sort_order')
    .eq('portfolio_id', portfolio.id)
    .eq('lang', lang)
    .like('block_key', `${listPrefix}.%`)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const blockKey = `${listPrefix}.${randomId()}`

  const { error } = await supabase.from('portfolio_blocks').insert({
    portfolio_id: portfolio.id,
    block_key: blockKey,
    lang,
    section,
    sort_order: (last?.sort_order ?? -1) + 1,
    content_json: EMPTY_DOC,
    content_html: renderBlockHtml(EMPTY_DOC),
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true, blockKey }
}

/**
 * Removes one block from a list. Sibling sort_orders are left as-is — order
 * only ever depends on relative sort_order, not contiguity — so this is a
 * single delete with no resequencing.
 */
export async function removeListItemBlock(blockKey: string, lang: Lang): Promise<RemoveResult> {
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
    .from('portfolio_blocks')
    .delete()
    .eq('portfolio_id', portfolio.id)
    .eq('block_key', blockKey)
    .eq('lang', lang)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}
