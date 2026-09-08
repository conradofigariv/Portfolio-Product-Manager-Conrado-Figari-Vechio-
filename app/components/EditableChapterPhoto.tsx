'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLang } from '../context/LanguageContext'
import { createClient } from '../lib/supabase/client'
import { saveChapterPhoto, removeChapterPhoto } from '../lib/portfolio-actions'
import { compressImage, uniqueUploadName, validateImageFile } from '../lib/image-upload'
import { storagePathFromPublicUrl } from '../lib/media-path'
import PositionPicker from './PositionPicker'

export default function EditableChapterPhoto({
  chapterId,
  heading,
}: {
  chapterId: string
  heading: string
}) {
  const { editing, media } = useLang()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadedPath, setUploadedPath] = useState<string | null>(null)
  const [position, setPosition] = useState<string | undefined>(undefined)

  const existing = media.chapterPhotos[chapterId]
  const src = preview ?? existing?.src ?? null
  const alt = existing?.alt ?? heading
  const storagePath = uploadedPath ?? (existing ? storagePathFromPublicUrl(existing.src) : null)
  const resolvedPosition = position ?? existing?.position

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
      const path = `${user.id}/chapter-${chapterId}-${uniqueUploadName()}.webp`

      const upload = await supabase.storage
        .from('portfolio-media')
        .upload(path, image, { contentType: 'image/webp', upsert: false })
      if (upload.error) throw upload.error

      const saved = await saveChapterPhoto(chapterId, path, heading)
      if (!saved.ok) throw new Error(saved.error)

      setPreview(URL.createObjectURL(image))
      setUploadedPath(path)
      setPosition(undefined)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload that photo.')
    } finally {
      setBusy(false)
    }
  }

  async function onRemove() {
    setBusy(true)
    setError(null)
    const result = await removeChapterPhoto(chapterId)
    setBusy(false)
    if (result.ok) {
      setPreview(null)
      router.refresh()
    } else {
      setError(result.error)
    }
  }

  if (!editing && !src) return null

  const unoptimized = !!src?.startsWith('blob:')

  return (
    <div className="h-full">
      <div className="w-full h-44 md:w-48 md:h-full md:min-h-52 rounded-xl overflow-hidden border border-dark-700 relative flex-shrink-0 group">
        {src ? (
          <>
            {/* Mobile position */}
            <div className="md:hidden absolute inset-0">
              <Image
                src={src}
                alt={alt}
                fill
                quality={90}
                unoptimized={unoptimized}
                className="object-cover"
                style={{ objectPosition: existing?.positionMobile || resolvedPosition }}
              />
            </div>
            {/* Desktop position */}
            <div className="hidden md:block absolute inset-0">
              <Image
                src={src}
                alt={alt}
                fill
                quality={90}
                unoptimized={unoptimized}
                className="object-cover"
                style={{ objectPosition: resolvedPosition }}
              />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-dark-800 text-dark-500 text-xs text-center px-2">
            No photo
          </div>
        )}

        {editing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-dark-900/70 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="text-xs font-medium text-dark-50"
            >
              {busy ? 'Uploading…' : src ? 'Change' : 'Add photo'}
            </button>
            {src && (
              <button
                type="button"
                onClick={onRemove}
                disabled={busy}
                className="text-xs text-red-400/90 hover:text-red-400"
              >
                Remove
              </button>
            )}
          </div>
        )}

        {/* Direct child of the same relative box the photo fills, so the
            picker's full-cover overlay lines up with the whole photo and
            stays visible (independent of the hover-fade group above) while
            the owner is actively picking a spot. */}
        {editing && src && storagePath && (
          <PositionPicker
            storagePath={storagePath}
            src={src}
            alt={alt}
            // 12rem wide, stretching to the chapter's text height.
            aspect={0.78}
            position={resolvedPosition}
            onChange={setPosition}
            triggerClassName="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-dark-900/70 text-dark-50 text-xs font-medium opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          />
        )}
      </div>

      {editing && (
        <>
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
          {error && <p className="mt-2 text-xs text-red-400 max-w-52">{error}</p>}
        </>
      )}
    </div>
  )
}
