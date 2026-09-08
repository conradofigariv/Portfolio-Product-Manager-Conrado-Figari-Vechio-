'use client'

// Small add/remove affordances shared by every editable list on the site
// (chapters, projects, narrative lines, tags, skills, categories, certs).
// Rendered only while editing, by each caller.

export function RemoveButton({
  onClick,
  label = 'Remove',
  className = '',
  disabled = false,
}: {
  onClick: () => void
  label?: string
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-dark-500 hover:text-red-400 hover:bg-red-400/10 transition flex-shrink-0 disabled:opacity-40 disabled:pointer-events-none ${className}`}
    >
      ×
    </button>
  )
}

export function AddButton({
  onClick,
  label,
  className = '',
  disabled = false,
}: {
  onClick: () => void
  label: string
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-xs text-dark-500 hover:text-dark-50 border border-dashed border-dark-600 hover:border-dark-400 rounded-lg px-3 py-1.5 transition disabled:opacity-40 disabled:pointer-events-none ${className}`}
    >
      + {label}
    </button>
  )
}
