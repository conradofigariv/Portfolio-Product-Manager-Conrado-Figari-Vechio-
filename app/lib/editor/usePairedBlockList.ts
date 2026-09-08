'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addPairedListItemBlock, removePairedListItemBlock } from '../block-list-actions'
import { useLang } from '../../context/LanguageContext'

export type PairedBlockListItem<F extends string> = {
  itemId: string
  blockKeys: Record<F, string>
}

/**
 * The multi-field counterpart to useBlockList — for a list whose items each
 * carry more than one field (a metric's label + value, a certification's
 * title + issuer, a contact social's label + url). Every field of one item
 * shares a block_key prefix, "<prefix>.<itemId>.<field>", and one sort_order
 * (set together by addPairedListItemBlock), so the item — not the
 * individual field block — is the unit add/remove operate on.
 */
export function usePairedBlockList<F extends string>({
  prefix,
  fields,
  section,
}: {
  prefix: string
  fields: readonly F[]
  section: string
}) {
  const { lang, blocks } = useLang()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const groups = new Map<string, { blockKeys: Partial<Record<F, string>>; sortOrder: number }>()

  for (const [blockKey, byLang] of Object.entries(blocks)) {
    const block = byLang[lang]
    if (!block || !blockKey.startsWith(`${prefix}.`)) continue

    const rest = blockKey.slice(prefix.length + 1)
    const field = fields.find((f) => rest.endsWith(`.${f}`))
    if (!field) continue
    const itemId = rest.slice(0, rest.length - field.length - 1)
    if (!itemId) continue

    const group = groups.get(itemId) ?? { blockKeys: {} as Partial<Record<F, string>>, sortOrder: block.sortOrder }
    group.blockKeys[field] = blockKey
    group.sortOrder = block.sortOrder
    groups.set(itemId, group)
  }

  const items: PairedBlockListItem<F>[] = Array.from(groups.entries())
    .sort((a, b) => a[1].sortOrder - b[1].sortOrder)
    .map(([itemId, group]) => ({ itemId, blockKeys: group.blockKeys as Record<F, string> }))

  async function add() {
    setBusy(true)
    setError(null)
    const result = await addPairedListItemBlock(prefix, [...fields], section, lang)
    setBusy(false)
    if (result.ok) router.refresh()
    else setError(result.error)
  }

  async function remove(itemId: string) {
    setBusy(true)
    setError(null)
    const result = await removePairedListItemBlock(prefix, itemId, lang)
    setBusy(false)
    if (result.ok) router.refresh()
    else setError(result.error)
  }

  return { items, add, remove, busy, error }
}
