'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Editor } from '@tiptap/react'

/**
 * Unlike every other control here, the input inside this popover needs
 * *real* DOM focus to type into — it can't use the onMouseDown+preventDefault
 * trick the rest of the toolbar relies on to avoid stealing focus from the
 * editor. FloatingToolbar knows to suppress its hide-on-blur while this is
 * open (see its `open`/`onOpenChange` wiring) so focusing the input doesn't
 * make the whole toolbar disappear out from under it.
 */
export default function LinkPopover({
  editor,
  open,
  onOpenChange,
}: {
  editor: Editor
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Re-seed the field from the current link every time the popover opens
  // (not just once) — a plain render-time comparison against the previous
  // `open` value, rather than an effect, since this needs to happen before
  // the input paints, not after.
  const [lastOpen, setLastOpen] = useState(false)
  if (open !== lastOpen) {
    setLastOpen(open)
    if (open) setValue((editor.getAttributes('link').href as string | undefined) ?? '')
  }

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) onOpenChange(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, onOpenChange])

  function apply() {
    const href = value.trim()
    if (!href) {
      editor.chain().focus().unsetLink().run()
    } else {
      const normalized = /^(https?:\/\/|mailto:)/i.test(href) ? href : `https://${href}`
      editor.chain().focus().extendMarkRange('link').setLink({ href: normalized }).run()
    }
    onOpenChange(false)
  }

  function remove() {
    editor.chain().focus().unsetLink().run()
    onOpenChange(false)
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        aria-label="Link"
        aria-pressed={editor.isActive('link')}
        title="Link (Cmd/Ctrl+K)"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onOpenChange(!open)}
        className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-[80ms] ${
          editor.isActive('link') ? 'bg-dark-50 text-dark-900' : 'text-dark-200 hover:bg-dark-700'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 8,
              transition: { type: 'spring', stiffness: 400, damping: 30, mass: 0.6 },
            }}
            exit={{ opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.12, ease: 'easeOut' } }}
            style={{ transformOrigin: 'top left' }}
            className="absolute top-full left-0 flex items-center gap-1.5 rounded-lg border border-dark-600 bg-dark-800/95 backdrop-blur p-1.5 shadow-xl z-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                apply()
              }
              if (e.key === 'Escape') {
                e.preventDefault()
                e.stopPropagation()
                onOpenChange(false)
                editor.commands.focus()
              }
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://..."
              className="w-48 bg-dark-900 border border-dark-600 rounded-md px-2 py-1 text-xs text-dark-50 placeholder:text-dark-500 focus:outline-none focus:border-dark-400"
            />
            <button
              type="button"
              onClick={apply}
              className="px-2 py-1 rounded-md bg-dark-50 text-dark-900 text-xs font-medium hover:bg-dark-100 transition-colors duration-[80ms]"
            >
              Apply
            </button>
            {editor.isActive('link') && (
              <button
                type="button"
                onClick={remove}
                className="px-2 py-1 rounded-md text-red-400 text-xs hover:bg-dark-700 transition-colors duration-[80ms]"
              >
                Remove
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
