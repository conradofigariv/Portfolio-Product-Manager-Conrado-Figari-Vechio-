'use client'

// Small add/remove affordances shared by every editable list on the site
// (chapters, projects, narrative lines, tags, skills, categories, certs).
// Rendered only while editing, by each caller.

export function RemoveButton({
  onClick,
  label = 'Remove',
  className = '',
}: {
  onClick: () => void
  label?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-dark-500 hover:text-red-400 hover:bg-red-400/10 transition flex-shrink-0 ${className}`}
    >
      ×
    </button>
  )
}

export function AddButton({
  onClick,
  label,
  className = '',
}: {
  onClick: () => void
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs text-dark-500 hover:text-dark-50 border border-dashed border-dark-600 hover:border-dark-400 rounded-lg px-3 py-1.5 transition ${className}`}
    >
      + {label}
    </button>
  )
}
