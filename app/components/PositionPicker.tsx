'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveMediaPosition } from '../lib/portfolio-actions'

// Click-anywhere-on-the-photo focal point picker. Render this as a direct
// child of the same `relative` box the photo fills — not nested inside
// another absolutely-positioned wrapper, or its own `inset-0` overlay would
// resolve against that wrapper instead of the whole photo.
export default function PositionPicker({
  storagePath,
  position,
  onChange,
  triggerClassName = 'text-xs font-medium text-dark-50',
}: {
  storagePath: string
  position?: string
  onChange: (position: string) => void
  triggerClassName?: string
}) {
  const [active, setActive] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const [x, y] = (position ?? '50% 50%')
    .split(' ')
    .map((v) => parseFloat(v))
    .map((v) => (Number.isFinite(v) ? v : 50))

  async function pick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const py = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    const next = `${Math.max(0, Math.min(100, px))}% ${Math.max(0, Math.min(100, py))}%`
    onChange(next)
    setSaving(true)
    const result = await saveMediaPosition(storagePath, next)
    setSaving(false)
    if (result.ok) router.refresh()
  }

  if (!active) {
    return (
      <button type="button" onClick={() => setActive(true)} className={triggerClassName}>
        Adjust position
      </button>
    )
  }

  return (
    <div
      className="absolute inset-0 z-20 cursor-crosshair bg-dark-900/40"
      onClick={pick}
      role="button"
      tabIndex={-1}
      aria-label="Click to set the visible part of the photo"
    >
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-dark-50 bg-dark-900/70 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${x}%`, top: `${y}%` }}
      />
      <div className="absolute top-2 left-2 right-2 flex items-center gap-2">
        <p className="flex-1 text-xs font-medium text-dark-50 bg-dark-900/70 rounded px-2 py-1 pointer-events-none">
          Click the part of the photo you want visible
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setActive(false)
          }}
          className="flex-shrink-0 px-2.5 py-1 rounded-md bg-dark-50 text-dark-900 text-xs font-medium"
        >
          {saving ? 'Saving…' : 'Done'}
        </button>
      </div>
    </div>
  )
}
