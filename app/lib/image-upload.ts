const MAX_EDGE = 1400
const TARGET_BYTES = 600 * 1024

/**
 * Resizes and re-encodes an image in the browser, so what reaches storage is a
 * couple of hundred kilobytes rather than whatever the camera produced.
 * Shared by every photo upload on the site (portrait, chapter, project).
 */
export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('This browser cannot process images. Try another one.')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

  // Step the quality down rather than ever falling back to the original file,
  // so a stored photo has a predictable ceiling.
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

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'That file is not an image.'
  if (file.size > MAX_UPLOAD_BYTES) return 'That image is over 10MB. Pick a smaller one.'
  return null
}

// Date.now() alone can collide: a fast double-click fires two uploads in the
// same millisecond, and Supabase Storage rejects the second with "The
// resource already exists" (upsert is intentionally off). The random suffix
// makes that practically impossible.
export function uniqueUploadName(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
