const BUCKET = 'portfolio-media'

// Client components only ever see the public URL Supabase builds from a
// storage_path, never the raw path itself — but saving a focal point needs
// that raw path to find the row. Public URLs always follow
// .../object/public/<bucket>/<path>, so it can be recovered from there.
export function storagePathFromPublicUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return decodeURIComponent(url.slice(idx + marker.length))
}
