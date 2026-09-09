'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from './supabase/server'
import { EMPTY_DOC, renderBlockHtml } from './editor/render-html'
import type { Lang } from './portfolio'

type AddResult = { ok: true; blockKey: string } | { ok: false; error: string }
type RemoveResult = { ok: true } | { ok: false; error: string }
type ReorderResult = { ok: true } | { ok: false; error: string }

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

/**
 * Resequences a single-field list's blocks to match `orderedBlockKeys` —
 * the drag-to-reorder counterpart to add/remove. Unlike the plain-array
 * reorder used for projects/chapters (a local draft mutation via
 * updateBoth, nothing persisted until Save), a list-of-blocks field
 * autosaves immediately, same as add/remove, so this writes straight to
 * `sort_order` rather than staging anything client-side. Every block in
 * the list gets its array index as its new sort_order, in one batch —
 * simpler and safer than computing a single fractional value for just the
 * moved block, and cheap enough for lists this size (narrative lines,
 * tags, a handful of items).
 */
export async function reorderListItemBlocks(orderedBlockKeys: string[], lang: Lang): Promise<ReorderResult> {
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

  const results = await Promise.all(
    orderedBlockKeys.map((blockKey, index) =>
      supabase
        .from('portfolio_blocks')
        .update({ sort_order: index })
        .eq('portfolio_id', portfolio.id)
        .eq('block_key', blockKey)
        .eq('lang', lang)
    )
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) return { ok: false, error: failed.error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

type AddPairedResult = { ok: true; itemId: string } | { ok: false; error: string }

/**
 * Adds one new item to a list whose items carry more than one field each —
 * a metric (label + value), a certification (title + issuer), a contact
 * social (label + url). Unlike a single-field list (addListItemBlock), one
 * "item" here is a group of sibling blocks sharing a fresh item id:
 * block_key is "<listPrefix>.<itemId>.<field>" for each of `fields`, all
 * inserted together with the same sort_order so the group sorts and moves
 * as one unit — sort_order is read from whatever currently has the highest
 * value among *any* of that list's existing blocks (any field), since every
 * field of every item in the list shares its item's value.
 */
export async function addPairedListItemBlock(
  listPrefix: string,
  fields: string[],
  section: string,
  lang: Lang
): Promise<AddPairedResult> {
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

  const itemId = randomId()
  const sortOrder = (last?.sort_order ?? -1) + 1

  const { error } = await supabase.from('portfolio_blocks').insert(
    fields.map((field) => ({
      portfolio_id: portfolio.id,
      block_key: `${listPrefix}.${itemId}.${field}`,
      lang,
      section,
      sort_order: sortOrder,
      content_json: EMPTY_DOC,
      content_html: renderBlockHtml(EMPTY_DOC),
    }))
  )

  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true, itemId }
}

/**
 * Removes every field block belonging to one item of a multi-field list —
 * the counterpart to addPairedListItemBlock. Deletes by
 * "<listPrefix>.<itemId>.%" rather than a single block_key, so every field
 * sharing that item id goes together in one statement.
 */
export async function removePairedListItemBlock(
  listPrefix: string,
  itemId: string,
  lang: Lang
): Promise<RemoveResult> {
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
    .eq('lang', lang)
    .like('block_key', `${listPrefix}.${itemId}.%`)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}
