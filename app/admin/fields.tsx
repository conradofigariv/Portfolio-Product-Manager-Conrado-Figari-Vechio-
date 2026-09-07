'use client'

import type { ReactNode } from 'react'

const inputClass =
  'w-full rounded-lg bg-dark-800 border border-dark-600 px-3 py-2 text-sm text-dark-50 placeholder:text-dark-500 focus:outline-none focus:border-dark-400'

export function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-dark-400 mb-1.5">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  hint?: string
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-dark-400 mb-1.5">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} resize-y leading-relaxed`}
      />
      {hint && <span className="block text-xs text-dark-500 mt-1">{hint}</span>}
    </label>
  )
}

// String arrays are edited one item per line. It keeps lists of bullet points,
// tags and skills to a single familiar control instead of a nested form.
export function LineList({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  rows?: number
  hint?: string
}) {
  return (
    <TextArea
      label={label}
      value={value.join('\n')}
      rows={rows}
      hint={hint ?? 'One per line'}
      onChange={(text) => onChange(text.split('\n'))}
    />
  )
}

export function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="border border-dark-700 rounded-xl p-5 md:p-6 bg-dark-800/40">
      <h2 className="text-lg font-semibold text-dark-50">{title}</h2>
      {description && <p className="text-sm text-dark-400 mt-1 mb-5">{description}</p>}
      <div className={description ? 'space-y-4' : 'space-y-4 mt-5'}>{children}</div>
    </section>
  )
}

export function RepeatableItem({
  title,
  onRemove,
  onMoveUp,
  onMoveDown,
  children,
}: {
  title: string
  onRemove: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  children: ReactNode
}) {
  return (
    <div className="border border-dark-700 rounded-lg p-4 space-y-4 bg-dark-900/40">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-dark-200">{title}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!onMoveUp}
            aria-label="Move up"
            className="px-2 py-1 text-dark-400 hover:text-dark-50 disabled:opacity-30 disabled:hover:text-dark-400"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!onMoveDown}
            aria-label="Move down"
            className="px-2 py-1 text-dark-400 hover:text-dark-50 disabled:opacity-30 disabled:hover:text-dark-400"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="px-2 py-1 text-xs text-red-400/80 hover:text-red-400"
          >
            Remove
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-dashed border-dark-600 rounded-lg py-2.5 text-sm text-dark-400 hover:text-dark-50 hover:border-dark-400 transition"
    >
      + {label}
    </button>
  )
}
