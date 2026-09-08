'use client'

import type { Editor } from '@tiptap/react'
import ToolbarButton from './ToolbarButton'

const ALIGNMENTS = [
  { value: 'left', label: 'Align left', lines: [16, 10, 16, 10] },
  { value: 'center', label: 'Align center', lines: [16, 10, 16, 10] },
  { value: 'right', label: 'Align right', lines: [16, 10, 16, 10] },
  { value: 'justify', label: 'Justify', lines: [16, 16, 16, 16] },
] as const

function AlignIcon({ align }: { align: (typeof ALIGNMENTS)[number]['value'] }) {
  const widths = [14, align === 'justify' ? 14 : 9, 14, align === 'justify' ? 14 : 11]
  const justify = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'stretch'
  return (
    <span className="flex flex-col gap-[3px] w-4" style={{ alignItems: justify }}>
      {widths.map((w, i) => (
        <span key={i} className="h-[1.5px] bg-current rounded-full" style={{ width: w }} />
      ))}
    </span>
  )
}

export default function AlignmentGroup({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center gap-0.5">
      {ALIGNMENTS.map(({ value, label }) => (
        <ToolbarButton
          key={value}
          label={label}
          active={editor.isActive({ textAlign: value }) || (value === 'left' && !editor.getAttributes('paragraph').textAlign)}
          onToggle={() => editor.chain().focus().setTextAlign(value).run()}
        >
          <AlignIcon align={value} />
        </ToolbarButton>
      ))}
    </div>
  )
}
