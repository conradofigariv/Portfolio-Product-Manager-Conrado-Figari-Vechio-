'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Editor } from '@tiptap/react'
import { FONT_FAMILIES, isAllowedFontFamily } from '../../../lib/editor/extensions/fontFamily'

/**
 * The family that actually renders, whether or not an explicit fontFamily
 * mark is set — same reasoning as FontSizeControl's computedFontSizePx and
 * ColorSwatches' computedColor: without a mark, these fields inherit
 * whatever the page's own CSS gives them (the site-wide font-sans stack, or
 * a font-mono utility on a specific field), so reading the mark alone would
 * show nothing for a field that's visibly using one of the ten options.
 */
function computedFontFamily(editor: Editor): string | null {
  try {
    const domInfo = editor.view.domAtPos(editor.state.selection.from)
    let node: Node | null = domInfo.node
    while (node && node.nodeType !== Node.ELEMENT_NODE) node = node.parentNode
    if (!(node instanceof Element)) return null
    return window.getComputedStyle(node).fontFamily || null
  } catch {
    return null
  }
}

// Matches "Georgia, 'Times New Roman', serif" against a computed
// "Georgia, \"Times New Roman\", serif" (browsers normalize quoting and
// spacing when they echo a font-family back through getComputedStyle) by
// comparing only the comma-separated family names, quotes and whitespace
// stripped from each.
function normalizeStack(stack: string): string {
  return stack
    .split(',')
    .map((part) => part.trim().replace(/^['"]|['"]$/g, '').toLowerCase())
    .join(',')
}

export default function FontFamilyControl({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const explicit = editor.getAttributes('textStyle').fontFamily as string | undefined
  const explicitValid = isAllowedFontFamily(explicit) ? explicit : null
  const computed = computedFontFamily(editor)
  const computedMatch = computed
    ? FONT_FAMILIES.find((f) => normalizeStack(f.value) === normalizeStack(computed))
    : undefined
  const activeValue = explicitValid ?? computedMatch?.value ?? null
  const activeLabel = FONT_FAMILIES.find((f) => f.value === activeValue)?.label ?? 'Aa'

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function apply(value: string | null) {
    if (value) editor.chain().focus().setFontFamily(value).run()
    else editor.chain().focus().unsetFontFamily().run()
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        aria-label="Font family"
        aria-haspopup="listbox"
        aria-expanded={open}
        title={activeValue ? `Font: ${activeLabel}` : 'Font'}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        className="min-w-16 h-7 px-2 flex items-center justify-center gap-1 rounded-md text-xs text-dark-100 hover:bg-dark-700 transition-colors duration-[80ms]"
        style={{ fontFamily: activeValue ?? undefined }}
      >
        <span className="truncate max-w-20">{activeLabel}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Font family"
            initial={{ opacity: 0, scale: 0.94, y: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 8,
              transition: { type: 'spring', stiffness: 400, damping: 30, mass: 0.6 },
            }}
            exit={{ opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.12, ease: 'easeOut' } }}
            style={{ transformOrigin: 'top left' }}
            className="absolute top-full left-0 flex flex-col rounded-lg border border-dark-600 bg-dark-800/95 backdrop-blur py-1 shadow-xl min-w-40 max-h-72 overflow-y-auto z-10"
          >
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.value}
                type="button"
                role="option"
                aria-selected={font.value === activeValue}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => apply(font.value)}
                style={{ fontFamily: font.value }}
                className={`px-3 py-1.5 text-left text-sm transition-colors duration-[80ms] hover:bg-dark-700 ${
                  font.value === activeValue ? 'text-dark-50 font-medium' : 'text-dark-300'
                }`}
              >
                {font.label}
              </button>
            ))}
            <div className="my-1 h-px bg-dark-600" />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => apply(null)}
              className="px-3 py-1.5 text-left text-xs text-dark-300 hover:text-dark-50 hover:bg-dark-700 transition-colors duration-[80ms]"
            >
              Default
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
