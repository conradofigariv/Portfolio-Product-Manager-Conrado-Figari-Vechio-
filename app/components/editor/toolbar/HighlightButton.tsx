'use client'

import type { Editor } from '@tiptap/react'
import ToolbarButton from './ToolbarButton'

// Single fixed color (see HIGHLIGHT_STYLE in extensions/colors.ts) rather
// than a swatch picker like text color — a quick toggle, matching how the
// brief lists "highlight" separately from "text color swatches".
export default function HighlightButton({ editor }: { editor: Editor }) {
  return (
    <ToolbarButton
      label="Highlight"
      active={editor.isActive('highlight')}
      onToggle={() => editor.chain().focus().toggleHighlight().run()}
    >
      <span
        className="px-0.5 rounded-sm"
        style={{ backgroundColor: 'rgba(216, 255, 62, 0.55)', color: '#0a0a0b' }}
      >
        H
      </span>
    </ToolbarButton>
  )
}
