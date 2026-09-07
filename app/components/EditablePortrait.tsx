'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLang } from '../context/LanguageContext'
import { createClient } from '../lib/supabase/client'
import { savePortrait } from '../lib/portfolio-actions'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const MAX_EDGE = 1400
const TARGET_BYTES = 600 * 1024

// Resizes and re-encodes in the browser, so what reaches storage is a couple of
// hundred kilobytes rather than the original. A 10MB phone photo is what the
// person may pick; it is not what gets stored or what visitors download.
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('This browser cannot process images. Try another one.')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

  // Step the quality down rather than ever falling back to the original file,
  // so a stored portrait has a predictable ceiling.
  let best: Blob | null = null
  for (const quality of [0.85, 0.7, 0.55]) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    )
    if (!blob) continue
    best = blob
    if (blob.size <= TARGET_BYTES) break
  }

  if (!best) throw new Error('Could not process that image. Try a different one.')
  return best
}

export default function EditablePortrait() {
  const { editing, media, content } = useLang()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const portrait = preview ?? media.portrait?.src ?? null

  async function onPick(file: File) {
    setError(null)

    if (!file.type.startsWith('image/')) {
      setError('That file is not an image.')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('That image is over 10MB. Pick a smaller one.')
      return
    }

    setBusy(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Your session expired. Sign in again.')

      const image = await compress(file)
      const path = `${user.id}/portrait-${Date.now()}.webp`

      const upload = await supabase.storage
        .from('portfolio-media')
        .upload(path, image, { contentType: 'image/webp', upsert: false })
      if (upload.error) throw upload.error

      const saved = await savePortrait(path, content.hero.name)
      if (!saved.ok) throw new Error(saved.error)

      setPreview(URL.createObjectURL(image))
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload that photo.')
    } finally {
      setBusy(false)
    }
  }

  if (!editing && !portrait) return null

  return (
    <div className="relative">
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-dark-50/5 rounded-2xl blur-2xl scale-110" />

      <div className="relative w-72 h-96 rounded-2xl overflow-hidden border border-dark-600 group">
        {portrait ? (
          <Image
            src={portrait}
            alt={media.portrait?.alt ?? content.hero.name}
            fill
            unoptimized={portrait.startsWith('blob:')}
            className="object-cover object-top"
            priority
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-dark-800 text-dark-500 text-sm">
            No photo yet
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-dark-900/60 to-transparent" />

        {editing && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="absolute inset-0 flex items-center justify-center bg-dark-900/70 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-sm font-medium text-dark-50"
          >
            {busy ? 'Uploading…' : portrait ? 'Change photo' : 'Add photo'}
          </button>
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
          {error && <p className="mt-2 text-xs text-red-400 max-w-72">{error}</p>}
        </>
      )}
    </div>
  )
}
