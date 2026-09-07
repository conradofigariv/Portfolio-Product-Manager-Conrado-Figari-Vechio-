'use client'

import { useEffect, useRef } from 'react'
import { useLang } from '../context/LanguageContext'
import { getAtPath } from '../lib/content-path'

/**
 * One editable field, rendered in place inside the real design. When not
 * editing it is plain text, so the published page is untouched by any of this.
 *
 * The element is deliberately uncontrolled: React writing into a focused
 * contentEditable moves the caret to the start on every keystroke. Instead the
 * text is set imperatively, and only while the field is not focused.
 */
export default function EditableText({
  path,
  placeholder,
}: {
  path: string
  placeholder?: string
}) {
  const { editing, content, setField } = useLang()
  const value = getAtPath(content, path)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || document.activeElement === el) return
    if (el.textContent !== value) el.textContent = value
  }, [value, editing])

  if (!editing) return <>{value}</>

  return (
    // Wrapper carries the edit affordances (margin bar, "Edit" pill) as
    // presentational siblings, so the contentEditable span below only ever
    // contains the real text — never UI a stray keystroke could delete.
    <span className="group/field relative inline-block align-top">
      <span
        aria-hidden
        className="absolute -left-3 top-0.5 bottom-0.5 w-0.5 rounded-full bg-[#EE8C7F]/30 transition-colors group-hover/field:bg-[#EE8C7F] group-focus-within/field:bg-[#EE8C7F] pointer-events-none"
      />
      <span className="hidden sm:inline-flex absolute -right-1.5 -top-3 items-center gap-1 rounded-full border border-dark-600 bg-dark-900 px-2 py-1 text-[11px] text-dark-100 opacity-0 transition-opacity group-hover/field:opacity-100 group-focus-within/field:!opacity-0 pointer-events-none">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#EE8C7F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        Edit
      </span>
      <span
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        tabIndex={0}
        aria-label={placeholder}
        data-placeholder={placeholder}
        className="editable-field block rounded-sm outline-none transition-colors group-hover/field:bg-white/[0.03] focus:bg-[#EE8C7F]/5 focus:shadow-[inset_0_0_0_1px_rgba(238,140,122,0.4)]"
        onBlur={(e) => setField(path, e.currentTarget.textContent ?? '')}
        onKeyDown={(e) => {
          if (e.key === 'Escape') e.currentTarget.blur()
        }}
      />
    </span>
  )
}
