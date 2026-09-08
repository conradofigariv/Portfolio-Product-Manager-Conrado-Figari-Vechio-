'use client'

import { useLang } from '../context/LanguageContext'
import { useBlockList } from '../lib/editor/useBlockList'
import RichText from './editor/EditableText'
import { AddButton, RemoveButton } from './EditControls'

// A project's narrative lines, migrated off portfolios.content onto
// portfolio_blocks — a separate component (not inlined in ProjectTimeline's
// own project .map()) because useBlockList is a hook, and the number of
// projects rendered there varies, which hooks can't tolerate directly
// inside that loop.
export default function ProjectNarrative({ projectId }: { projectId: string }) {
  const { editing } = useLang()
  const { items, add, remove, busy, error } = useBlockList({
    prefix: `projects.items.${projectId}.narrative`,
    section: 'projects',
  })

  return (
    <div className="space-y-2 md:space-y-3 mb-5 md:mb-7">
      {items.map((item, i) => (
        <p
          key={item.blockKey}
          className="text-dark-300 text-sm md:text-base leading-relaxed flex items-start gap-2 md:gap-3"
        >
          <span className="text-dark-500 font-light mt-0.5 text-xs md:text-sm select-none flex-shrink-0">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="flex-1">
            <RichText blockKey={item.blockKey} section="projects" placeholder="Line" />
          </span>
          {editing && (
            <RemoveButton label="Remove line" disabled={busy} onClick={() => remove(item.blockKey)} />
          )}
        </p>
      ))}
      {editing && <AddButton label="Add line" disabled={busy} onClick={add} />}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
