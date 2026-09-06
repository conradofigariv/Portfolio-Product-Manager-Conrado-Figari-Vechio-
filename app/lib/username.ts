// Turns a Google display name or email into a candidate username matching the
// database constraint: ^[a-z0-9][a-z0-9-]{2,29}$ (3-30 chars, starts alphanumeric).
export function slugifyUsername(input: string): string {
  const accentsStripped = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
  const base = accentsStripped
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30)

  return base.length >= 3 ? base : `user-${base}`.slice(0, 30)
}

export function withSuffix(base: string, attempt: number): string {
  if (attempt === 0) return base
  const suffix = `-${attempt + 1}`
  return `${base.slice(0, 30 - suffix.length)}${suffix}`
}
