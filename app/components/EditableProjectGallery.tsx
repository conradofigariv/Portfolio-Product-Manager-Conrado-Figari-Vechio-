'use client'

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase/client'
import { addProjectPhoto, removeProjectPhoto } from '../lib/portfolio-actions'
import { compressImage, uniqueUploadName, validateImageFile } from '../lib/image-upload'
import { storagePathFromPublicUrl } from '../lib/media-path'
import PositionPicker from './PositionPicker'
import type { MediaImage } from '../lib/portfolio'

const MAX_PHOTOS = 4

// The management panel a project's owner sees instead of the public lightbox:
// thumbnails with a remove control, and an upload tile up to the 4 the
// database allows.
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
  const inputRef = useRef<HTMLInputElement>(null)

  async function onPick(file: File) {
    if (busy) return
    setError(null)
    const invalid = validateImageFile(file)
    if (invalid) {
      setError(invalid)
      return
    }

    setBusy(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Your session expired. Sign in again.')

      const image = await compressImage(file)
      const path = `${user.id}/project-${projectId}-${uniqueUploadName()}.webp`

      const upload = await supabase.storage
        .from('portfolio-media')
        .upload(path, image, { contentType: 'image/webp', upsert: false })
      if (upload.error) throw upload.error

      const saved = await addProjectPhoto(projectId, path, title)
      if (!saved.ok) throw new Error(saved.error)

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload that photo.')
    } finally {
      setBusy(false)
    }
  }

  async function onRemove(src: string) {
    setBusy(true)
    setError(null)
    const result = await removeProjectPhoto(projectId, src)
    setBusy(false)
    if (result.ok) router.refresh()
    else setError(result.error)
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
        className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-lg p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-dark-50">Photos — {title || 'Untitled'}</span>
          <button type="button" onClick={onClose} className="text-dark-400 hover:text-dark-50 text-sm">
            Done
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((photo) => {
            const storagePath = storagePathFromPublicUrl(photo.src)
            const position = positions[photo.src] ?? photo.position
            return (
              <div key={photo.src} className="relative aspect-square rounded-lg overflow-hidden border border-dark-600 group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  quality={90}
                  className="object-cover"
                  style={{ objectPosition: position }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-dark-900/70 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onRemove(photo.src)}
                    disabled={busy}
                    className="text-xs font-medium text-red-400"
                  >
                    Remove
                  </button>
                </div>

                {/* Direct child of the same relative box the photo fills, so
                    the picker's full-cover overlay lines up with the whole
                    thumbnail and stays visible while actively picking. */}
                {storagePath && (
                  <PositionPicker
                    storagePath={storagePath}
                    position={position}
                    onChange={(next) => setPositions((p) => ({ ...p, [photo.src]: next }))}
                    triggerClassName="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded bg-dark-900/70 text-dark-50 text-[11px] font-medium opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  />
                )}
              </div>
            )
          })}

          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="aspect-square rounded-lg border border-dashed border-dark-600 hover:border-dark-400 text-dark-400 hover:text-dark-50 text-xs transition disabled:opacity-50"
            >
              {busy ? 'Uploading…' : '+ Add photo'}
            </button>
          )}
        </div>

        <p className="text-xs text-dark-500 mt-3">Up to {MAX_PHOTOS} photos.</p>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) onPick(file)
          }}
        />
      </div>
    </div>,
    document.body
  )
}
