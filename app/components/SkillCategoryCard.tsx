'use client'

import { useLang } from '../context/LanguageContext'
import { useBlockList } from '../lib/editor/useBlockList'
import type { SkillCategory } from '../lib/portfolio'
import RichText from './editor/EditableText'
import { AddButton, RemoveButton } from './EditControls'

// One skills category — its own component for the same Rules-of-Hooks
// reason as ProjectNarrative/ProjectTags: useBlockList can't be called
// inside Skills.tsx's own dynamic-length categories .map(). The category's
// name is a scalar block keyed by its (now stable) id; its skills are a
// nested owner-addable/removable list sharing that id as their prefix.
export default function SkillCategoryCard({
  category,
  onRemove,
}: {
  category: SkillCategory
  onRemove: () => void
}) {
  const { editing } = useLang()
  const { items: skills, add, remove, busy, error } = useBlockList({
    prefix: `skills.categories.${category.id}.skills`,
    section: 'skills',
  })

  return (
    <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 md:p-6 hover:border-dark-500 transition">
      <div className="flex items-start justify-between gap-2 mb-3 md:mb-4">
        {/* flex-1 + min-w-0: a flex-row item with no grow shrink-wraps to its
            own text, leaving the alignment toolbar's buttons no slack to
            visibly shift text into. */}
        <h3 className="flex-1 min-w-0 text-sm md:text-base font-semibold text-dark-50">
          <RichText blockKey={`skills.categories.${category.id}.category`} section="skills" placeholder="Category" />
        </h3>
        {editing && <RemoveButton label="Remove category" onClick={onRemove} />}
      </div>
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill.blockKey} className="flex items-center gap-3 text-dark-300 text-xs md:text-sm">
            <span className="w-1 h-1 bg-dark-400 rounded-full flex-shrink-0" />
            <span className="flex-1">
              <RichText blockKey={skill.blockKey} section="skills" placeholder="Skill" />
            </span>
            {editing && (
              <RemoveButton label="Remove skill" disabled={busy} onClick={() => remove(skill.blockKey)} />
            )}
          </li>
        ))}
      </ul>
      {editing && (
        <div className="mt-3">
          <AddButton label="Add skill" disabled={busy} onClick={add} />
        </div>
      )}
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  )
}
