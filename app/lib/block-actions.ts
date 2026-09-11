'use server'

import { revalidatePath } from 'next/cache'
import type { JSONContent } from '@tiptap/core'
import { createClient } from './supabase/server'
import { renderBlockHtml, sanitizeDoc } from './editor/render-html'
import type { Lang } from './portfolio'

// Generous relative to any of the fields this currently backs (a name, a
// tagline, a section title) — exists so a malformed or hostile payload can't
// store an unbounded document, same reasoning as the caps in
// portfolio-actions.ts.
const MAX_BLOCK_LENGTH = 2000

type UpsertResult =
  // json/html echo back the *sanitized* version actually stored (sanitizeDoc
  // can strip things the client sent) — the caller uses these to keep its
  // own local copy of `blocks` in sync with the server, since nothing here
  // triggers a client-side refetch on its own (see useBlockPersistence).
  | { ok: true; updatedAt: string; json: JSONContent; html: string }
  | { ok: false; error: string; conflict?: true; latest?: { json: JSONContent; html: string; updatedAt: string } }

/**
 * Saves one rich text block. `expectedUpdatedAt` is the updatedAt the editor
 * last loaded — if the stored row has since moved past it (another tab, or
 * this same field mid-flight from a previous keystroke that landed after
 * this one started), the write is refused and the caller gets the current
 * value back to reconcile instead of silently overwriting it.
 */
export async function upsertBlock(
  blockKey: string,
  lang: Lang,
  section: string,
  json: JSONContent,
  expectedUpdatedAt: string | null
): Promise<UpsertResult> {
  // Wrapped in try/catch so this action always *resolves* rather than ever
  // rejecting — useBlockPersistence.save() has its own catch as a backstop
  // (see its comment), but that one has no way to know *why* the call
  // failed, only that it did, and shows a generic fallback message. This is
  // the one place that can report the real reason (a thrown Supabase client
  // error, a network failure, ...) instead of leaving every such failure
  // looking identical from the UI.
  try {
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

    const { data: existing } = await supabase
      .from('portfolio_blocks')
      .select('content_json, content_html, updated_at')
      .eq('portfolio_id', portfolio.id)
      .eq('block_key', blockKey)
      .eq('lang', lang)
      .maybeSingle()

    if (existing && expectedUpdatedAt && existing.updated_at !== expectedUpdatedAt) {
      return {
        ok: false,
        error: 'This field changed elsewhere — refresh to see the latest version.',
        conflict: true,
        latest: {
          json: existing.content_json as JSONContent,
          html: existing.content_html,
          updatedAt: existing.updated_at,
        },
      }
    }

    const safeJson = sanitizeDoc(json, MAX_BLOCK_LENGTH)
    const html = renderBlockHtml(safeJson)

    const { data: saved, error } = await supabase
      .from('portfolio_blocks')
      .upsert(
        {
          portfolio_id: portfolio.id,
          block_key: blockKey,
          lang,
          section,
          content_json: safeJson,
          content_html: html,
        },
        { onConflict: 'portfolio_id,block_key,lang' }
      )
      .select('updated_at')
      .single()

    if (error) return { ok: false, error: error.message }

    revalidatePath('/', 'layout')
    return { ok: true, updatedAt: saved.updated_at, json: safeJson, html }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unexpected error saving this field.' }
  }
}
