'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Editor } from '@tiptap/react'
import { TEXT_COLORS, isAllowedColor } from '../../../lib/editor/extensions/colors'

function hexToRgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}

/**
 * The color that actually renders, whether or not an explicit color mark is
 * set. Without one, these fields inherit their color from whatever class
 * wraps them on the page (e.g. text-dark-400), so reading the mark alone
 * would show an empty swatch for text that's visibly colored — this reads
 * the real computed style at the selection instead, same reasoning as
 * FontSizeControl's computedFontSizePx.
 */
function computedColor(editor: Editor): string | null {
  try {
    const domInfo = editor.view.domAtPos(editor.state.selection.from)
    let node: Node | null = domInfo.node
    while (node && node.nodeType !== Node.ELEMENT_NODE) node = node.parentNode
    if (!(node instanceof Element)) return null
    return window.getComputedStyle(node).color || null
  } catch {
    return null
  }
}

export default function ColorSwatches({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const explicit = editor.getAttributes('textStyle').color as string | undefined
  const explicitValid = isAllowedColor(explicit) ? explicit : null
  const displayColor = explicitValid ?? computedColor(editor)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function apply(color: string | null) {
    if (color) editor.chain().focus().setColor(color).run()
    else editor.chain().focus().unsetColor().run()
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        aria-label="Text color"
        aria-haspopup="listbox"
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-dark-700 transition-colors duration-[80ms]"
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-dark-500"
          style={{ backgroundColor: displayColor ?? 'transparent' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Text color"
            initial={{ opacity: 0, scale: 0.94, y: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 8,
              transition: { type: 'spring', stiffness: 400, damping: 30, mass: 0.6 },
            }}
            exit={{ opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.12, ease: 'easeOut' } }}
            style={{ transformOrigin: 'top left' }}
            className="absolute top-full left-0 flex w-36 flex-col gap-2 rounded-lg border border-dark-600 bg-dark-800/95 backdrop-blur p-2.5 shadow-xl z-10"
          >
            <div className="grid grid-cols-4 gap-1.5">
              {TEXT_COLORS.map((c) => {
                const selected = c.value === explicitValid || hexToRgb(c.value) === displayColor
                return (
                  <button
                    key={c.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    aria-label={c.label}
                    title={c.label}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => apply(c.value)}
                    className={`w-6 h-6 rounded-full border transition-colors duration-[80ms] ${
                      selected ? 'border-dark-50 ring-2 ring-dark-50/40' : 'border-dark-500 hover:border-dark-300'
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                )
              })}
            </div>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => apply(null)}
              className="text-xs text-dark-300 hover:text-dark-50 transition-colors duration-[80ms] text-left"
            >
              Default
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
