'use client'

import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle, FontSize, Color } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import FloatingToolbar from './FloatingToolbar'
import { useBlockPersistence } from '../../lib/editor/useBlockPersistence'
import { useLang } from '../../context/LanguageContext'
import { EMPTY_DOC } from '../../lib/editor/render-html'
import { HIGHLIGHT_STYLE } from '../../lib/editor/extensions/colors'
import type { PortfolioBlock } from '../../lib/portfolio'

// The Tiptap-powered half of EditableText — split into its own module and
// always reached through next/dynamic(..., { ssr: false }) so a public
// visitor's bundle never pulls in the editor at all, only the owner's does
// once edit mode is actually on.
export default function RichEditableField({
  blockKey,
  section,
  placeholder,
  initial,
}: {
  blockKey: string
  section: string
  placeholder?: string
  initial: PortfolioBlock | null
}) {
  const { lang } = useLang()

  const editor = useEditor({
    extensions: [
      // These fields are short, single-paragraph text (a name, a title, a
      // tagline) — everything StarterKit bundles for multi-block documents
      // (headings, lists, quotes, code) is switched off, and Enter below is
      // disabled outright rather than left free to start a second paragraph.
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        hardBreak: false,
      }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      // Single fixed color rather than multicolor — see HIGHLIGHT_STYLE's
      // own comment for why the edit and public-read views share it.
      Highlight.configure({ HTMLAttributes: { style: HIGHLIGHT_STYLE } }),
      Link.configure({
        openOnClick: false,
        autolink: false,
        protocols: ['http', 'https', 'mailto'],
      }),
      TextAlign.configure({ types: ['paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content: initial?.json ?? EMPTY_DOC,
    editorProps: {
      attributes: {
        class:
          'editable-field outline-dashed outline-1 outline-offset-4 outline-transparent hover:outline-dark-400/50 focus:outline-dark-50/70 focus:outline-solid rounded-sm transition-[outline-color]',
        role: 'textbox',
        'aria-label': placeholder ?? '',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter') return true
        if (event.key === 'Escape') {
          view.dom.blur()
          return true
        }
        return false
      },
    },
    immediatelyRender: false,
  })

  const { status, error } = useBlockPersistence({
    editor,
    blockKey,
    lang,
    section,
    initialUpdatedAt: initial?.updatedAt ?? null,
  })

  return (
    <>
      <EditorContent editor={editor} />
      <FloatingToolbar editor={editor} />
      {(status === 'error' || status === 'conflict') &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key={error}
              role="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-4 right-4 z-[130] max-w-xs rounded-lg border border-red-800/60 bg-dark-900/95 backdrop-blur px-3 py-2.5 text-xs text-red-300 shadow-xl"
            >
              {error ?? 'Could not save this field.'}
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
