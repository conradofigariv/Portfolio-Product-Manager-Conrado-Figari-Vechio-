'use client'

import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useBlockList } from '../lib/editor/useBlockList'
import RichText from './editor/EditableText'
import { AddButton, DragHandle, RemoveButton } from './EditControls'

// A project's tag pills, migrated off portfolios.content onto
// portfolio_blocks — its own component for the same Rules-of-Hooks reason as
// ProjectNarrative (useBlockList can't be called inside ProjectTimeline's
// own dynamic-length project .map()).
export default function ProjectTags({ projectId }: { projectId: string }) {
  const { editing } = useLang()
  const { items, add, remove, reorder, busy, error } = useBlockList({
    prefix: `projects.items.${projectId}.tags`,
    section: 'projects',
  })
  const [dragKey, setDragKey] = useState<string | null>(null)
  const [overKey, setOverKey] = useState<string | null>(null)

  function drop(targetKey: string) {
    setOverKey(null)
    if (!dragKey || dragKey === targetKey) {
      setDragKey(null)
      return
    }
    reorder(dragKey, targetKey)
    setDragKey(null)
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {items.map((item) => (
        <span
          key={item.blockKey}
          className={`flex items-center gap-1.5 px-2 md:px-3 py-1 bg-dark-700/60 text-dark-300 text-xs rounded-full border border-dark-600 transition-all ${
            dragKey === item.blockKey ? 'opacity-40' : ''
          } ${
            overKey === item.blockKey && dragKey !== null && dragKey !== item.blockKey
              ? 'outline outline-2 outline-offset-2 outline-dark-50/60'
              : ''
          }`}
          onDragOver={(e) => {
            if (!dragKey) return
            e.preventDefault()
            setOverKey(item.blockKey)
          }}
          onDrop={() => drop(item.blockKey)}
        >
          {editing && (
            <DragHandle
              onDragStart={() => setDragKey(item.blockKey)}
              onDragEnd={() => {
                setDragKey(null)
                setOverKey(null)
              }}
            />
          )}
          <RichText blockKey={item.blockKey} section="projects" placeholder="Tag" />
          {editing && (
            <RemoveButton label="Remove tag" disabled={busy} onClick={() => remove(item.blockKey)} />
          )}
        </span>
      ))}
      {editing && <AddButton label="Add tag" disabled={busy} onClick={add} />}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
