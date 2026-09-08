'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Shared base for every toolbar control. onMouseDown+preventDefault is what
// stops a click from ever taking focus (and the selection) away from the
// editor before the command runs.
export default function ToolbarButton({
  label,
  shortcut,
  active,
  onToggle,
  children,
}: {
  label: string
  shortcut?: string
  active: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <motion.button
      type="button"
      aria-label={shortcut ? `${label} (${shortcut})` : label}
      aria-pressed={active}
      title={shortcut ? `${label} (${shortcut})` : label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onToggle}
      whileTap={{ scale: 0.94 }}
      className={`flex items-center justify-center w-7 h-7 rounded-md text-sm transition-colors duration-[80ms] ${
        active ? 'bg-dark-50 text-dark-900' : 'text-dark-200 hover:bg-dark-700'
      }`}
    >
      {children}
    </motion.button>
  )
}
