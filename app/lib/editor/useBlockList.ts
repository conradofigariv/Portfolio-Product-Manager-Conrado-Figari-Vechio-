'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addListItemBlock, removeListItemBlock, reorderListItemBlocks } from '../block-list-actions'
import { useLang } from '../../context/LanguageContext'
import { moveBeforeId } from '../reorder'
import { EMPTY_DOC } from './render-html'

export type BlockListItem = { blockKey: string }

/**
 * The list-of-blocks counterpart to a single field's useBlockPersistence: an
 * ordered, owner-addable/removable set of rich text blocks sharing one key
 * prefix (e.g. "projects.items.<id>.narrative"), read from the same
 * `blocks` the context already carries and sorted by sort_order. Unlike a
 * single field, add/remove aren't autosave-on-idle — they're immediate
 * actions, so this exposes a busy flag instead of a save status.
 */
export function useBlockList({ prefix, section }: { prefix: string; section: string }) {
  const { lang, blocks, demo, mutateBlocks } = useLang()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const items: BlockListItem[] = Object.entries(blocks)
    .map(([blockKey, byLang]) => ({ blockKey, block: byLang[lang] }))
    .filter(
      (entry): entry is { blockKey: string; block: NonNullable<(typeof entry)['block']> } =>
        entry.blockKey.startsWith(`${prefix}.`) && !!entry.block
    )
    .sort((a, b) => a.block.sortOrder - b.block.sortOrder)
    .map(({ blockKey }) => ({ blockKey }))

  async function add() {
    // Landing-page demo: no database, so a new item is just another entry in
    // the context's own blocks map. Same shape the server would have written
    // (fresh random id under this prefix, sort_order past the current last),
    // so everything downstream — ordering, remove, reorder — is unchanged.
    if (demo) {
      const lastSort = items.reduce(
        (max, item) => Math.max(max, blocks[item.blockKey]?.[lang]?.sortOrder ?? 0),
        0
      )
      mutateBlocks((prev) => ({
        ...prev,
        [`${prefix}.${Math.random().toString(36).slice(2, 10)}`]: {
          [lang]: {
            json: EMPTY_DOC,
            html: '',
            updatedAt: new Date().toISOString(),
            sortOrder: lastSort + 1,
          },
        },
      }))
      return
    }

    setBusy(true)
    setError(null)
    const result = await addListItemBlock(prefix, section, lang)
    setBusy(false)
    if (result.ok) router.refresh()
    else setError(result.error)
  }

  async function remove(blockKey: string) {
    if (demo) {
      mutateBlocks((prev) => {
        const next = { ...prev }
        delete next[blockKey]
        return next
      })
      return
    }

    setBusy(true)
    setError(null)
    const result = await removeListItemBlock(blockKey, lang)
    setBusy(false)
    if (result.ok) router.refresh()
    else setError(result.error)
  }

  // Same by-id reorder logic as the plain-array lists (moveBeforeId), just
  // persisted immediately server-side instead of staged in draft state —
  // see reorderListItemBlocks for why. `targetBlockKey` missing (dropped
  // past the last item) falls out of moveBeforeId itself: appends at the end.
  async function reorder(movedBlockKey: string, targetBlockKey: string) {
    const reordered = moveBeforeId(
      items.map((item) => ({ id: item.blockKey })),
      movedBlockKey,
      targetBlockKey
    )

    // Same resequencing reorderListItemBlocks does server-side (every item's
    // sort_order set to its index in the new order), applied to the local map.
    if (demo) {
      mutateBlocks((prev) => {
        const next = { ...prev }
        reordered.forEach((item, i) => {
          const block = next[item.id]?.[lang]
          if (block) next[item.id] = { ...next[item.id], [lang]: { ...block, sortOrder: i } }
        })
        return next
      })
      return
    }

    setBusy(true)
    setError(null)
    const result = await reorderListItemBlocks(
      reordered.map((item) => item.id),
      lang
    )
    setBusy(false)
    if (result.ok) router.refresh()
    else setError(result.error)
  }

  return { items, add, remove, reorder, busy, error }
}
