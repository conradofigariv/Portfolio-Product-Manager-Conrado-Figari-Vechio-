'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Editor } from '@tiptap/react'
import {
  FONT_SIZES,
  type FontSizeValue,
  fontSizeToCss,
  cssToFontSize,
} from '../../../lib/editor/extensions/fontSize'

const DEFAULT_STEP_FROM: FontSizeValue = 16

export default function FontSizeControl({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const current = cssToFontSize(editor.getAttributes('textStyle').fontSize)
  const index = current ? FONT_SIZES.indexOf(current) : -1

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function apply(size: FontSizeValue) {
    editor.chain().focus().setFontSize(fontSizeToCss(size)).run()
    setOpen(false)
  }

  function step(dir: 1 | -1) {
    const from = index === -1 ? FONT_SIZES.indexOf(DEFAULT_STEP_FROM) : index
    const next = FONT_SIZES[Math.min(FONT_SIZES.length - 1, Math.max(0, from + dir))]
    apply(next)
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        aria-label="Decrease font size"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => step(-1)}
        disabled={index === 0}
        className="w-6 h-7 flex items-center justify-center rounded-md text-dark-200 hover:bg-dark-700 disabled:opacity-30 transition-colors duration-[80ms]"
      >
        −
      </button>

      <button
        type="button"
        aria-label="Font size"
        aria-haspopup="listbox"
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        className="min-w-9 h-7 px-1 flex items-center justify-center rounded-md text-xs text-dark-100 hover:bg-dark-700 tabular-nums transition-colors duration-[80ms]"
      >
        {current ?? '—'}
      </button>

      <button
        type="button"
        aria-label="Increase font size"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => step(1)}
        disabled={index === FONT_SIZES.length - 1}
        className="w-6 h-7 flex items-center justify-center rounded-md text-dark-200 hover:bg-dark-700 disabled:opacity-30 transition-colors duration-[80ms]"
      >
        +
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Font size"
            initial={{ opacity: 0, scale: 0.94, y: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 8,
              transition: { type: 'spring', stiffness: 400, damping: 30, mass: 0.6 },
            }}
            exit={{ opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.12, ease: 'easeOut' } }}
            style={{ transformOrigin: 'top' }}
            className="absolute top-full left-0 flex flex-col rounded-lg border border-dark-600 bg-dark-800/95 backdrop-blur py-1 shadow-xl min-w-14 z-10"
          >
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                role="option"
                aria-selected={size === current}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => apply(size)}
                className={`px-3 py-1.5 text-left text-xs transition-colors duration-[80ms] hover:bg-dark-700 ${
                  size === current ? 'text-dark-50 font-medium' : 'text-dark-300'
                }`}
              >
                {size}px
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
