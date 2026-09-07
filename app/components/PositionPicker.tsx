'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveMediaPosition } from '../lib/portfolio-actions'

function clamp(n: number) {
  return Math.max(0, Math.min(100, n))
}

function percentFromPointer(e: { clientX: number; clientY: number }, rect: DOMRect) {
  const x = clamp(Math.round(((e.clientX - rect.left) / rect.width) * 100))
  const y = clamp(Math.round(((e.clientY - rect.top) / rect.height) * 100))
  return `${x}% ${y}%`
}

// Drag-anywhere-on-the-photo focal point picker. Render this as a direct
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
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const [x, y] = (position ?? '50% 50%')
    .split(' ')
    .map((v) => parseFloat(v))
    .map((v) => (Number.isFinite(v) ? v : 50))

  async function save(next: string) {
    setSaving(true)
    const result = await saveMediaPosition(storagePath, next)
    setSaving(false)
    if (result.ok) router.refresh()
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    onChange(percentFromPointer(e, e.currentTarget.getBoundingClientRect()))
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    onChange(percentFromPointer(e, e.currentTarget.getBoundingClientRect()))
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    setDragging(false)
    save(percentFromPointer(e, e.currentTarget.getBoundingClientRect()))
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
      className="absolute inset-0 z-20 touch-none select-none bg-dark-900/40"
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      role="slider"
      aria-label="Drag to choose the visible part of the photo"
      aria-valuenow={0}
      tabIndex={-1}
    >
      <div
        className={`absolute w-6 h-6 rounded-full border-2 border-dark-50 bg-dark-900/70 shadow-lg -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform ${
          dragging ? 'scale-110' : ''
        }`}
        style={{ left: `${x}%`, top: `${y}%` }}
      />
      <div className="absolute top-2 left-2 right-2 flex items-center gap-2 pointer-events-none">
        <p className="flex-1 text-xs font-medium text-dark-50 bg-dark-900/70 rounded px-2 py-1">
          Drag to choose what&apos;s visible
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setActive(false)
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex-shrink-0 px-2.5 py-1 rounded-md bg-dark-50 text-dark-900 text-xs font-medium pointer-events-auto"
        >
          {saving ? 'Saving…' : 'Done'}
        </button>
      </div>
    </div>
  )
}
