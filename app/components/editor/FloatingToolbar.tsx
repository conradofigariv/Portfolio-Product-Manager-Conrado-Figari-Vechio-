'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useFloating, offset, flip, shift, autoUpdate, type VirtualElement } from '@floating-ui/react'
import type { Editor } from '@tiptap/react'
import ToolbarButton from './toolbar/ToolbarButton'
import FontSizeControl from './toolbar/FontSizeControl'

// Clicking into a field is often just moving between several fields fast —
// this delay keeps the toolbar from flickering in and out on every click.
// A real text selection (rule 2) skips it entirely; that's a deliberate act.
const FOCUS_DELAY_MS = 120
const SCROLL_HIDE_THRESHOLD = 4

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const modKey = isMac ? '⌘' : 'Ctrl'

/**
 * Anchors to the caret (empty selection) or the selection's bounding rect,
 * via ProseMirror's own coordsAtPos rather than the DOM Selection API — that
 * keeps this correct even for selections made with the keyboard, which don't
 * always produce a live window.getSelection() range.
 */
function selectionRect(editor: Editor): DOMRect {
  const { from, to, empty } = editor.state.selection
  if (empty) {
    const c = editor.view.coordsAtPos(from)
    return new DOMRect(c.left, c.top, 0, c.bottom - c.top)
  }
  const start = editor.view.coordsAtPos(from)
  const end = editor.view.coordsAtPos(to)
  const left = Math.min(start.left, end.left)
  const top = Math.min(start.top, end.top)
  return new DOMRect(left, top, Math.max(start.right, end.right) - left, Math.max(start.bottom, end.bottom) - top)
}

export default function FloatingToolbar({ editor }: { editor: Editor | null }) {
  const [visible, setVisible] = useState(false)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollOrigin = useRef<{ x: number; y: number } | null>(null)
  const reduceMotion = useReducedMotion()

  // editor.isActive()/getAttributes() below read live editor state at
  // render time — React has no way to know that state changed on its own,
  // so without this a toolbar already open (visible didn't flip) would keep
  // showing stale button/size states after the selection moves to a
  // differently-formatted run, or after a command runs.
  const [, forceUpdate] = useReducer((n: number) => n + 1, 0)

  const { refs, floatingStyles, placement } = useFloating({
    placement: 'top',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    // floating-ui positions via `transform: translate(...)` by default —
    // Framer Motion also owns `transform` (for the enter/exit scale/y
    // animation) and overwrites it, which left the toolbar pinned at its
    // unpositioned top-left corner. `top`/`left` instead keeps the two out
    // of each other's way.
    transform: false,
  })

  useEffect(() => {
    if (!editor) return
    const activeEditor = editor

    function place() {
      const rect = selectionRect(activeEditor)
      const virtual: VirtualElement = {
        getBoundingClientRect: () => rect,
        contextElement: activeEditor.view.dom,
      }
      refs.setReference(virtual)
      scrollOrigin.current = { x: window.scrollX, y: window.scrollY }
      setVisible(true)
    }

    function updateAnchor(delay: number) {
      if (showTimer.current) clearTimeout(showTimer.current)
      if (delay <= 0) {
        place()
      } else {
        showTimer.current = setTimeout(place, delay)
      }
    }

    function onFocus() {
      updateAnchor(activeEditor.state.selection.empty ? FOCUS_DELAY_MS : 0)
    }
    function onSelectionUpdate() {
      if (!activeEditor.isFocused) return
      updateAnchor(0)
    }
    function onBlur() {
      if (showTimer.current) clearTimeout(showTimer.current)
      setVisible(false)
    }

    editor.on('focus', onFocus)
    editor.on('selectionUpdate', onSelectionUpdate)
    editor.on('blur', onBlur)
    // Every selection move and every formatting command fires a
    // transaction — forcing a render here is what keeps isActive()/
    // getAttributes() reads below from going stale between those.
    editor.on('transaction', forceUpdate)
    return () => {
      editor.off('focus', onFocus)
      editor.off('selectionUpdate', onSelectionUpdate)
      editor.off('blur', onBlur)
      editor.off('transaction', forceUpdate)
      if (showTimer.current) clearTimeout(showTimer.current)
    }
  }, [editor, refs, forceUpdate])

  useEffect(() => {
    if (!visible) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setVisible(false)
        editor?.commands.blur()
      }
    }
    function onScroll() {
      const origin = scrollOrigin.current
      if (!origin) return
      const dx = Math.abs(window.scrollX - origin.x)
      const dy = Math.abs(window.scrollY - origin.y)
      if (dx > SCROLL_HIDE_THRESHOLD || dy > SCROLL_HIDE_THRESHOLD) setVisible(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [visible, editor])

  if (!editor) return null

  // The frame should grow away from the text it's anchored to, not from its
  // own center — so the transform origin follows whichever side floating-ui
  // actually resolved (it flips to "bottom" near the top of the viewport).
  const origin = placement.startsWith('top') ? 'bottom' : 'top'

  const variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.12, ease: 'easeOut' as const } },
        exit: { opacity: 0, transition: { duration: 0.12, ease: 'easeOut' as const } },
      }
    : {
        hidden: { opacity: 0, scale: 0.94, y: 6 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: 'spring' as const, stiffness: 400, damping: 30, mass: 0.6 },
        },
        exit: { opacity: 0, scale: 0.96, transition: { duration: 0.12, ease: 'easeOut' as const } },
      }

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          // refs.setFloating is @floating-ui/react's memoized callback ref
          // setter (its documented usage), not a `.current` read — the
          // react-hooks/refs rule can't tell those apart by name alone.
          // eslint-disable-next-line react-hooks/refs
          ref={refs.setFloating}
          style={{ ...floatingStyles, transformOrigin: origin, zIndex: 120 }}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="toolbar"
          aria-label="Text formatting"
          className="flex items-center gap-1 rounded-lg border border-dark-600 bg-dark-800/95 backdrop-blur px-1.5 py-1 shadow-xl"
        >
          <ToolbarButton
            label="Bold"
            shortcut={`${modKey}B`}
            active={editor.isActive('bold')}
            onToggle={() => editor.chain().focus().toggleBold().run()}
          >
            <span className="font-bold">B</span>
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            shortcut={`${modKey}I`}
            active={editor.isActive('italic')}
            onToggle={() => editor.chain().focus().toggleItalic().run()}
          >
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            shortcut={`${modKey}U`}
            active={editor.isActive('underline')}
            onToggle={() => editor.chain().focus().toggleUnderline().run()}
          >
            <span className="underline">U</span>
          </ToolbarButton>
          <div className="w-px h-5 bg-dark-600 mx-0.5" />
          <FontSizeControl editor={editor} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
