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
  const readOnlyHtml = block && !isEmptyDoc(block.json) ? renderInlineHtml(block.json) : null

  if (!editing) {
    if (!readOnlyHtml) return null
    return <span dangerouslySetInnerHTML={{ __html: readOnlyHtml }} />
  }

  // RichEditableField arrives through next/dynamic with ssr:false, which
  // renders nothing at all until the chunk resolves *and* Tiptap has built the
  // editor instance — measured at ~260ms with a page full of fields, during
  // which every one of them is an empty box. Keeping the read-only HTML in the
  // DOM underneath means the text simply stays put and the editor takes over
  // in place, instead of the whole page blanking out and refilling.
  //
  // Hidden by CSS (`.rich-field:has(.ProseMirror)`) rather than by state: no
  // extra render, and nothing to keep in sync — the fallback disappears the
  // moment a real editor exists next to it. The wrapper is display:contents,
  // so it adds an element to the tree without adding a box to the layout.
  return (
    <span className="rich-field">
      {readOnlyHtml && (
        <span className="rich-field-fallback" dangerouslySetInnerHTML={{ __html: readOnlyHtml }} />
      )}
      {/* key={blockKey+lang}: `useEditor`'s `content` option only seeds the
          Tiptap document once, at creation — it is not reactively synced on
          later renders. Toggling the content-language pill re-renders this
          component with a new `initial` (the other language's block), but
          without a key tied to `lang`, React just re-renders the *same*
          RichEditableField/editor instance in place, so the field kept
          showing/editing whichever language's content it happened to load
          at mount — reported live as "hice el portfolio en español y ahora
          tampoco cambia a ingles" (autosave itself was never broken: `lang`
          is passed fresh to useBlockPersistence on every render and always
          wrote to the correct block row underneath — only the *display*
          was stuck). Changing `key` forces a full remount on every language
          switch, so the editor is always rebuilt fresh from the correct
          language's `initial` content. The `.rich-field-fallback` read-only
          HTML above (recomputed fresh from `blocks[blockKey][lang]` on
          every render, independent of any editor instance) already exists
          to cover exactly this kind of remount gap, so there's no new
          flash-of-emptiness this introduces. */}
      <RichEditableField
        key={`${blockKey}:${lang}`}
        blockKey={blockKey}
        section={section}
        placeholder={placeholder}
        initial={block}
      />
    </span>
  )
}
