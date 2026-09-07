// Addresses a single string inside the content document, e.g. "hero.name" or
// "projects.items.2.narrative.0". Inline editing needs this because each
// editable element on the page knows only which field it renders.

type Node = Record<string, unknown> | unknown[] | undefined | null

export function getAtPath(content: unknown, path: string): string {
  const value = path.split('.').reduce<unknown>((node, key) => {
    if (node == null) return undefined
    return (node as Record<string, unknown>)[key]
  }, content)

  return typeof value === 'string' ? value : ''
}

export function setAtPath<T>(content: T, path: string, value: string): T {
  const keys = path.split('.')

  const write = (node: Node, depth: number): unknown => {
    const key = keys[depth]
    const isLast = depth === keys.length - 1
    const next = isLast ? value : write((node as Record<string, Node>)?.[key], depth + 1)

    if (Array.isArray(node)) {
      const copy = [...node]
      copy[Number(key)] = next
      return copy
    }
    return { ...(node ?? {}), [key]: next }
  }

  return write(content as Node, 0) as T
}
