'use client'

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function clamp(n: number) {
  return Math.max(0, Math.min(100, n))
}

function parsePosition(position?: string): [number, number] {
  const [x, y] = (position ?? '50% 50%')
    .split(' ')
    .map((v) => parseFloat(v))
    .map((v) => (Number.isFinite(v) ? v : 50))
  return [x ?? 50, y ?? 50]
}

/**
 * The whole photo, with a draggable frame showing exactly the part that
 * survives the crop on the page. The frame's shape is the shape of the box the
 * photo is displayed in, and everything outside it is dimmed — so what you see
 * inside the frame is what the visitor sees.
 *
 * The frame's travel is the same thing CSS object-position expresses: with the
 * photo scaled to cover the box, one axis has slack, and the percentage says
 * how much of that slack sits before the visible window.
 */
export default function PhotoCropModal({
  src,
  alt,
  aspect,
  position,
  onChange,
  onDone,
  saving = false,
}: {
  src: string
  alt: string
  // Width / height of the box this photo gets cropped into on the page.
  aspect: number
  position?: string
  onChange: (position: string) => void
  onDone: () => void
  saving?: boolean
}) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const [x, y] = parsePosition(position)

  // The visible window, as a share of the photo. Only the axis with slack
  // shrinks; the other one always spans the whole photo.
  let frameW = 100
  let frameH = 100
  if (natural) {
    const imageAspect = natural.w / natural.h
    if (imageAspect > aspect) frameW = (aspect / imageAspect) * 100
    else frameH = (imageAspect / aspect) * 100
  }

  const left = ((100 - frameW) * x) / 100
  const top = ((100 - frameH) * y) / 100

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, startX: x, startY: y }
    setDragging(true)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const start = drag.current
    const image = imageRef.current
    if (!start || !image) return

    const rect = image.getBoundingClientRect()
    // Slack in pixels: what the frame can actually travel across.
    const slackX = (rect.width * (100 - frameW)) / 100
    const slackY = (rect.height * (100 - frameH)) / 100

    const nextX = slackX > 0 ? clamp(start.startX + ((e.clientX - start.x) / slackX) * 100) : 50
    const nextY = slackY > 0 ? clamp(start.startY + ((e.clientY - start.y) / slackY) * 100) : 50
    onChange(`${Math.round(nextX)}% ${Math.round(nextY)}%`)
  }

  function onPointerUp() {
    drag.current = null
    setDragging(false)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4"
      onClick={onDone}
    >
      <div
        className="flex flex-col items-center gap-3 max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-dark-300 text-center">
          Drag the frame to choose what stays visible
        </p>

        <div className="relative inline-block leading-none select-none">
          {/* A plain img: it sizes itself to the photo's own proportions inside
              the max box, so the frame below can be positioned in percentages
              of the photo rather than of a letterboxed container. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            onLoad={(e) =>
              setNatural({
                w: e.currentTarget.naturalWidth,
                h: e.currentTarget.naturalHeight,
              })
            }
            className="block max-h-[70vh] max-w-[min(92vw,900px)] rounded-lg"
            draggable={false}
          />

          {natural && (
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${frameW}%`,
                height: `${frameH}%`,
                cursor: dragging ? 'grabbing' : 'grab',
                // Dims everything outside the frame without needing four
                // separate overlay panels.
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.62)',
              }}
              className="absolute touch-none border-2 border-dark-50 rounded-sm"
            >
              <div className="absolute inset-0 border border-dark-900/40" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onDone}
          className="button-primary text-sm py-1.5 px-5 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Done'}
        </button>
      </div>
    </div>,
    document.body
  )
}
