'use client'

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase/client'
import {
  addProjectPhoto,
  removeProjectPhoto,
  reorderProjectPhotos,
  replaceProjectPhoto,
} from '../lib/portfolio-actions'
import { compressImage, uniqueUploadName, validateImageFile } from '../lib/image-upload'
import { storagePathFromPublicUrl } from '../lib/media-path'
import PositionPicker from './PositionPicker'
import type { MediaImage } from '../lib/portfolio'

const MAX_PHOTOS = 4

// Roughly the shape of the visual half of a project card on the page. The card
// stretches to the height of the text beside it, so this is an approximation —
// close enough for the crop frame to mean what it shows.
const CARD_ASPECT = 1.2

// The management panel a project's owner sees instead of the public lightbox:
// thumbnails they can drag to reorder, drop files onto, and crop.
export default function EditableProjectGallery({
  projectId,
  title,
  photos,
  onClose,
}: {
  projectId: string
  title: string
  photos: MediaImage[]
  onClose: () => void
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [positions, setPositions] = useState<Record<string, string>>({})
  // Keyed by the photo's original src (a stable identity the same as
  // `positions` and `localOrder` use). A rotation re-encodes the file under a
  // new storage path, so this tracks where each tile's *current* bytes
  // actually live until the next router.refresh() catches up.
  const [rotatedPhotos, setRotatedPhotos] = useState<Record<string, { src: string; storagePath: string }>>(
    {}
  )
  const [localOrder, setLocalOrder] = useState<string[] | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [fileOver, setFileOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // A drag reorders optimistically, before the server round trip. Anything the
  // server later reports that this order doesn't know about (a photo added or
  // removed meanwhile) still shows up, so the two can never disagree for long.
  const ordered = (() => {
    if (!localOrder) return photos
    const bySrc = new Map(photos.map((p) => [p.src, p]))
    const kept = localOrder.map((src) => bySrc.get(src)).filter((p): p is MediaImage => !!p)
    const seen = new Set(kept.map((p) => p.src))
    return [...kept, ...photos.filter((p) => !seen.has(p.src))]
  })()

  async function onFiles(list: FileList | File[]) {
    if (busy) return
    const room = MAX_PHOTOS - ordered.length
    const files = Array.from(list).slice(0, Math.max(0, room))
    if (!files.length) {
      if (room <= 0) setError(`A project can have at most ${MAX_PHOTOS} photos.`)
      return
    }

    setError(null)
    setBusy(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Your session expired. Sign in again.')

      for (const file of files) {
        const invalid = validateImageFile(file)
        if (invalid) throw new Error(invalid)

        const image = await compressImage(file)
        const path = `${user.id}/project-${projectId}-${uniqueUploadName()}.webp`

        const upload = await supabase.storage
          .from('portfolio-media')
          .upload(path, image, { contentType: 'image/webp', upsert: false })
        if (upload.error) throw upload.error

        const saved = await addProjectPhoto(projectId, path, title)
        if (!saved.ok) throw new Error(saved.error)
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload that photo.')
    } finally {
      setBusy(false)
    }
  }

  async function onRemove(storagePath: string) {
    setBusy(true)
    setError(null)
    const result = await removeProjectPhoto(projectId, storagePath)
    setBusy(false)
    if (result.ok) router.refresh()
    else setError(result.error)
  }

  async function persistOrder(next: MediaImage[]) {
    const paths = next.map(
      (p) => rotatedPhotos[p.src]?.storagePath ?? storagePathFromPublicUrl(p.src) ?? p.src
    )
    setError(null)
    const result = await reorderProjectPhotos(projectId, paths)
    if (result.ok) router.refresh()
    else setError(result.error)
  }

  function dropOnTile(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.stopPropagation()
    setFileOver(false)
    setOverIndex(null)

    if (e.dataTransfer.files?.length) {
      onFiles(e.dataTransfer.files)
      return
    }

    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null)
      return
    }

    const next = [...ordered]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(index, 0, moved)
    setLocalOrder(next.map((p) => p.src))
    setDragIndex(null)
    persistOrder(next)
  }

  // Portalled to <body>: the project card is a transform/animation target
  // (scale, translate), and any of those on an ancestor would trap a plain
  // `fixed` element inside the card instead of the viewport — the same
  // containing-block issue the public lightbox below already works around.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-dark-800 border rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto flex flex-col transition-colors ${
          fileOver ? 'border-dark-300' : 'border-dark-700'
        }`}
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => {
          if (!e.dataTransfer.types.includes('Files')) return
          e.preventDefault()
          setFileOver(true)
        }}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return
          setFileOver(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setFileOver(false)
          if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files)
        }}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-dark-700 flex-shrink-0">
          <div>
            <span className="text-base font-semibold text-dark-50">Photos</span>
            <span className="text-dark-500"> — {title || 'Untitled'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-dark-300 hover:text-dark-50 transition p-1.5 -m-1.5 rounded-lg hover:bg-dark-700/60"
            aria-label="Done"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ordered.map((photo, i) => {
              const override = rotatedPhotos[photo.src]
              const displaySrc = override?.src ?? photo.src
              const storagePath = override?.storagePath ?? storagePathFromPublicUrl(photo.src)
              const position = positions[photo.src] ?? photo.position

              const onRotated = async (newStoragePath: string, newPublicUrl: string) => {
                if (!storagePath) return { ok: false as const, error: 'Missing storage path.' }
                const result = await replaceProjectPhoto(
                  projectId,
                  storagePath,
                  newStoragePath,
                  photo.alt || title
                )
                if (!result.ok) return result
                setRotatedPhotos((r) => ({
                  ...r,
                  [photo.src]: { src: newPublicUrl, storagePath: newStoragePath },
                }))
                router.refresh()
                return { ok: true as const }
              }

              return (
                <div
                  key={photo.src}
                  draggable
                  onDragStart={(e) => {
                    setDragIndex(i)
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', String(i))
                  }}
                  onDragEnd={() => {
                    setDragIndex(null)
                    setOverIndex(null)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    if (dragIndex !== null) setOverIndex(i)
                  }}
                  onDrop={(e) => dropOnTile(e, i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border cursor-grab active:cursor-grabbing transition-all group ${
                    overIndex === i && dragIndex !== null && dragIndex !== i
                      ? 'border-dark-50 scale-95'
                      : 'border-dark-600'
                  } ${dragIndex === i ? 'opacity-40' : ''}`}
                >
                  <Image
                    src={displaySrc}
                    alt={photo.alt}
                    fill
                    quality={90}
                    sizes="(min-width: 640px) 25vw, 50vw"
                    draggable={false}
                    className="object-cover pointer-events-none"
                    style={{ objectPosition: position }}
                  />

                  {i === 0 && (
                    <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-dark-900/80 backdrop-blur text-dark-100 text-[11px] font-medium">
                      Cover
                    </span>
                  )}

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-dark-900/75 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    {storagePath && (
                      <PositionPicker
                        storagePath={storagePath}
                        src={displaySrc}
                        alt={photo.alt}
                        aspect={CARD_ASPECT}
                        position={position}
                        onChange={(next) => setPositions((p) => ({ ...p, [photo.src]: next }))}
                        onRotated={onRotated}
                        triggerClassName="text-sm font-medium text-dark-50"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(storagePath ?? photo.src)}
                      disabled={busy}
                      className="text-sm font-medium text-red-400 hover:text-red-300 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}

            {ordered.length < MAX_PHOTOS ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                onDragOver={(e) => {
                  e.preventDefault()
                  setFileOver(true)
                }}
                onDrop={(e) => dropOnTile(e, ordered.length)}
                className={`aspect-square rounded-xl border border-dashed flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition disabled:opacity-50 ${
                  fileOver
                    ? 'border-dark-300 text-dark-50 bg-dark-700/40'
                    : 'border-dark-600 hover:border-dark-400 text-dark-400 hover:text-dark-50'
                }`}
              >
                {busy ? (
                  'Uploading…'
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add photo
                  </>
                )}
              </button>
            ) : (
              <div className="aspect-square rounded-xl border border-dashed border-dark-700 flex items-center justify-center text-center px-3">
                <span className="text-xs text-dark-500">Limit reached — remove one to add another</span>
              </div>
            )}
          </div>

          <p className="text-xs text-dark-500 mt-4">
            {ordered.length} / {MAX_PHOTOS} photos. Drop files here to upload, drag a photo to reorder
            — the first one is the cover.
          </p>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>

        {/* Single-select: on many mobile photo pickers, `multiple` requires an
            extra confirm/checkmark tap after choosing a photo, so tapping the
            photo alone (the gesture used everywhere else in this app) fires
            no change event at all — indistinguishable from the upload doing
            nothing. Dropping multiple files still works via the panel's
            onDrop, which isn't subject to that picker behavior. */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            // input.files is live: resetting e.target.value clears it in
            // place, so it must be copied into a plain array *before* the
            // reset or the upload below always sees zero files.
            const files = e.target.files ? Array.from(e.target.files) : []
            e.target.value = ''
            if (files.length) onFiles(files)
          }}
        />
      </div>
    </div>,
    document.body
  )
}
