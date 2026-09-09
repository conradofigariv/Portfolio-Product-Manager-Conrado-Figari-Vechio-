'use client'

import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useBlockList } from '../lib/editor/useBlockList'
import RichText from './editor/EditableText'
import { AddButton, DragHandle, RemoveButton } from './EditControls'

// A project's narrative lines, migrated off portfolios.content onto
// portfolio_blocks — a separate component (not inlined in ProjectTimeline's
// own project .map()) because useBlockList is a hook, and the number of
// projects rendered there varies, which hooks can't tolerate directly
// inside that loop.
export default function ProjectNarrative({ projectId }: { projectId: string }) {
  const { editing } = useLang()
  const { items, add, remove, reorder, busy, error } = useBlockList({
    prefix: `projects.items.${projectId}.narrative`,
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
    <div className="space-y-2 md:space-y-3 mb-5 md:mb-7">
      {items.map((item, i) => (
        <div
          key={item.blockKey}
          className={`text-dark-300 text-sm md:text-base leading-relaxed flex items-start gap-2 md:gap-3 rounded-lg transition-all ${
            dragKey === item.blockKey ? 'opacity-40' : ''
          } ${
            overKey === item.blockKey && dragKey !== null && dragKey !== item.blockKey
              ? 'outline outline-2 outline-offset-4 outline-dark-50/60'
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
          <span className="text-dark-500 font-light mt-0.5 text-xs md:text-sm select-none flex-shrink-0">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="flex-1">
            <RichText blockKey={item.blockKey} section="projects" placeholder="Line" />
          </span>
          {editing && (
            <RemoveButton label="Remove line" disabled={busy} onClick={() => remove(item.blockKey)} />
          )}
        </div>
      ))}
      {editing && <AddButton label="Add line" disabled={busy} onClick={add} />}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
