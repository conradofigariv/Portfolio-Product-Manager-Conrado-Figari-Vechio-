'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import type { JSONContent } from '@tiptap/core'
import { upsertBlock } from '../block-actions'
import { useLang } from '../../context/LanguageContext'
import type { Lang } from '../portfolio'

const DEBOUNCE_MS = 800

export type PersistStatus = 'idle' | 'saving' | 'saved' | 'error' | 'conflict'

/**
 * Autosaves one Tiptap editor's content to its portfolio_blocks row: 800ms
 * after the last keystroke, or immediately on blur (so navigating away right
 * after typing doesn't lose whatever was still sitting in the debounce
 * window). Independent of the old draft/Save-button flow — a migrated field
 * never touches LanguageContext's dirty flag.
 */
export function useBlockPersistence({
  editor,
  blockKey,
  lang,
  section,
  initialUpdatedAt,
}: {
  editor: Editor | null
  blockKey: string
  lang: Lang
  section: string
  initialUpdatedAt: string | null
}) {
  const [status, setStatus] = useState<PersistStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const updatedAtRef = useRef(initialUpdatedAt)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<JSONContent | null>(null)
  const { notifyBlockSaved, notifyBlockSavingStart, notifyBlockSavingEnd } = useLang()

  const save = useCallback(
    async (json: JSONContent) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      pendingRef.current = null
      setStatus('saving')
      setError(null)
      notifyBlockSavingStart()

      try {
        // ProseMirror/Tiptap builds each node's `attrs` via Object.create(null)
        // internally — editor.getJSON() hands those objects back as-is, with
        // no Object.prototype. React's server-action argument serialization
        // doesn't treat that as plain data; it substitutes an opaque
        // "temporary client reference" instead, which the server side then
        // can't read properties off of at all (surfaced as: "Cannot access
        // textAlign on the server... you can only pass the value through to
        // the client" — textAlign being a paragraph-level attr from the
        // alignment extension, the first attrs object hit). A JSON
        // round-trip rebuilds the whole tree out of ordinary object/array
        // literals, which serializes normally.
        const plainJson = JSON.parse(JSON.stringify(json)) as JSONContent
        const result = await upsertBlock(blockKey, lang, section, plainJson, updatedAtRef.current)
        if (result.ok) {
          updatedAtRef.current = result.updatedAt
          setStatus('saved')
          notifyBlockSaved()
          return
        }

        if (result.conflict && result.latest) {
          updatedAtRef.current = result.latest.updatedAt
          setStatus('conflict')
          setError(result.error)
          // Someone/something else just overwrote this field — show that
          // instead of silently discarding it under what's on screen.
          editor?.commands.setContent(result.latest.json, { emitUpdate: false })
          return
        }

        setStatus('error')
        setError(result.error)
      } catch {
        // upsertBlock itself rejecting (network failure, a revalidatePath
        // navigation aborting the request mid-flight, ...) used to leave
        // status stuck at 'saving' forever — nothing after the await ever
        // ran. Catching here is what makes the global saving count in
        // EditBar reliably drop back to 0 even when the request never
        // resolves normally.
        setStatus('error')
        setError('Could not save this field.')
      } finally {
        // Always balances the start above, on every branch including a
        // thrown/rejected upsertBlock call — this is what the global
        // "is anything still saving" count on EditBar's Save button relies
        // on to never get stuck showing "Saving…" forever.
        notifyBlockSavingEnd()
      }
    },
    [blockKey, lang, section, editor, notifyBlockSaved, notifyBlockSavingStart, notifyBlockSavingEnd]
  )

  const scheduleSave = useCallback(
    (json: JSONContent) => {
      pendingRef.current = json
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) save(pendingRef.current)
      }, DEBOUNCE_MS)
    },
    [save]
  )

  useEffect(() => {
    if (!editor) return

    const onUpdate = () => scheduleSave(editor.getJSON())
    const onBlur = () => {
      if (pendingRef.current) save(pendingRef.current)
    }

    editor.on('update', onUpdate)
    editor.on('blur', onBlur)
    return () => {
      editor.off('update', onUpdate)
      editor.off('blur', onBlur)
    }
  }, [editor, scheduleSave, save])

  // Flush on unmount too — the field's DOM might disappear (e.g. edit mode
  // toggled off) before the debounce timer would otherwise have fired.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (pendingRef.current) save(pendingRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { status, error }
}
