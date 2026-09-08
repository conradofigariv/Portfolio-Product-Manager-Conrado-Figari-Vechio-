'use client'

import dynamic from 'next/dynamic'
import { useLang } from '../../context/LanguageContext'
import { isEmptyDoc, renderInlineHtml } from '../../lib/editor/render-html'

// Dynamic + ssr:false: this is the boundary that keeps Tiptap out of a
// public visitor's bundle entirely — it's only ever imported once `editing`
// is true below, which is never the case for anyone but the owner.
const RichEditableField = dynamic(() => import('./RichEditableField'), { ssr: false })

/**
 * A single rich text field, addressed by the same block_key content-path.ts
 * already resolves against portfolios.content (e.g. "hero.name") — this is
 * the migrated, Tiptap-backed counterpart to the plain EditableText.tsx,
 * used only for the fields that have moved to portfolio_blocks so far.
 */
export default function EditableText({
  blockKey,
  section,
  placeholder,
}: {
  blockKey: string
  section: string
  placeholder?: string
}) {
  const { editing, lang, blocks } = useLang()
  const block = blocks[blockKey]?.[lang] ?? null

  if (!editing) {
    if (!block || isEmptyDoc(block.json)) return null
    return <span dangerouslySetInnerHTML={{ __html: renderInlineHtml(block.json) }} />
  }

  return <RichEditableField blockKey={blockKey} section={section} placeholder={placeholder} initial={block} />
}
