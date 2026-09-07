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
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      aria-label={placeholder}
      data-placeholder={placeholder}
      // Outline rather than border or padding: it draws outside the box, so
      // nothing on the page shifts when a field becomes editable.
      className="editable-field outline-dashed outline-1 outline-offset-4 outline-transparent hover:outline-dark-400/50 focus:outline-dark-50/70 focus:outline-solid rounded-sm transition-[outline-color]"
      onBlur={(e) => setField(path, e.currentTarget.textContent ?? '')}
      onKeyDown={(e) => {
        if (e.key === 'Escape') e.currentTarget.blur()
      }}
    />
  )
}
