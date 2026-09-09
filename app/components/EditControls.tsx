'use client'

// Small add/remove/reorder affordances shared by every editable list on the
// site (chapters, projects, narrative lines, tags, skills, categories,
// certs). Rendered only while editing, by each caller.

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

// A small grip icon that's the *only* draggable part of a reorderable row —
// not the whole row, since a row full of contentEditable/Tiptap fields would
// otherwise fight the native drag gesture with text selection. The row
// itself just needs onDragOver/onDrop; only this handle needs `draggable`.
export function DragHandle({ onDragStart, onDragEnd }: { onDragStart: () => void; onDragEnd: () => void }) {
  return (
    <span
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      role="button"
      aria-label="Reorder"
      title="Drag to reorder"
      className="inline-flex items-center justify-center w-5 h-5 rounded text-dark-500 hover:text-dark-200 hover:bg-dark-700/60 transition flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5" cy="3" r="1.4" />
        <circle cx="11" cy="3" r="1.4" />
        <circle cx="5" cy="8" r="1.4" />
        <circle cx="11" cy="8" r="1.4" />
        <circle cx="5" cy="13" r="1.4" />
        <circle cx="11" cy="13" r="1.4" />
      </svg>
    </span>
  )
}
