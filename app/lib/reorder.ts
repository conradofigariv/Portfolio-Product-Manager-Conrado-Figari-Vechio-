// Reorders a list of id-carrying entities (projects, chapters) by moving one
// item to sit right before another. Used for both languages' own arrays via
// updateBoth: the two arrays aren't guaranteed to be in the same index order
// (only the same set of ids, kept in sync by add/remove), so a drag computed
// from one language's rendered order is replayed here by id against each
// language's own array independently, rather than by index.
export function moveBeforeId<T extends { id: string }>(items: T[], movedId: string, targetId: string): T[] {
  const from = items.findIndex((item) => item.id === movedId)
  if (from === -1 || movedId === targetId) return items

  const next = [...items]
  const [moved] = next.splice(from, 1)
  const to = next.findIndex((item) => item.id === targetId)
  next.splice(to === -1 ? next.length : to, 0, moved)
  return next
}
